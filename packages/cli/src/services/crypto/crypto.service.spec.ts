// std
import { strictEqual } from 'assert';

// FoalTS
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {

  it('should generate a 256-bit secret encoded in base64.', async () => {
    const cryptoService = new CryptoService();
    const secret = await cryptoService.createSecret();
    strictEqual(secret.length, 44);
  });

});

