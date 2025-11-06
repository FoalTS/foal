// std
import { deepStrictEqual } from 'assert';
import { readFileSync } from 'fs';
import { Server } from 'http';
import { join } from 'path';

// 3p
import { sign } from 'jsonwebtoken';
import * as superagent from 'superagent';

// FoalTS
import { createApp, Get, HttpResponseOK } from '@foal/core';
import { getRSAPublicKeyFromJWKS } from '@foal/jwks-rsa';
import { JWTRequired } from '@foal/jwt';

describe('[Authentication|JWT|JWKS] Users can be authenticated with a JWKS retreived', () => {

  let server: Server;

  afterEach(() => {
    if (server) {
      server.close();
    }
  });

  it('from a local server.', async () => {
    // RSA keys taken from https://github.com/auth0/node-jsonwebtoken/tree/master/test
    const privateKey = readFileSync(join(process.cwd(), 'assets/authentication/rsa-private.pem'), 'utf8');
    // const publicKey = readFileSync(join(__dirname, 'rsa-public-key.pem'), 'utf8');

    const jwks = {
      keys: [
        {
          alg: 'RS256',
          e: 'AQAB',
          kid: 'aaa',
          kty: 'RSA',
          n: 'vzoCEC2rpSpJQaWZbUmlsDNwp83Jr4fi6KmBWIwnj1MZ6CUQ7rBasuLI8AcfX5_10scSfQNCsTLV2t'
            + 'MKQaHuvyrVfwY0dINk-nkqB74QcT2oCCH9XduJjDuwWA4xLqAKuF96FsIes52opEM50W7_W7DZCKX'
            + 'kC8fFPFj6QF5ZzApDw2Qsu3yMRmr7_W9uWeaTwfPx24YdY7Ah-fdLy3KN40vXv9c4xiSafVvnx9Bw'
            + 'YL7H1Q8NiK9LGEN6-JSWfgckQCs6UUBOXSZdreNN9zbQCwyzee7bOJqXUDAuLcFARzPw1EsZAyjVt'
            + 'GCKIQ0_btqK-jFunT2NBC8RItanDZpptQ',
          use: 'sig',
        }
      ]
    };

    class AppController {

      @Get('/.well-known/jwks.json')
      getJWKS() {
        return new HttpResponseOK(jwks);
      }

      @Get('/api/users/me')
      @JWTRequired({
        secretOrPublicKey: getRSAPublicKeyFromJWKS({
          jwksUri: 'http://localhost:3000/.well-known/jwks.json'
        })
      })
      getUser() {
        return new HttpResponseOK({
          name: 'Alix'
        });
      }

    }

    server = (await createApp(AppController)).listen(3000);

    const response = await superagent
      .get('http://localhost:3000/api/users/me')
      .set('Authorization', 'Bearer ' + sign({}, privateKey, { algorithm: 'RS256', header: { kid: 'aaa' } }));

    deepStrictEqual(response.body, {
      name: 'Alix'
    });
  });

});
