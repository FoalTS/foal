// 3p
import {
  Context,
  dependency,
  Get,
  HttpResponseRedirect,
  setSessionCookie,
} from '@foal/core';
import { FacebookProvider, GithubProvider, GoogleProvider } from '@foal/social';
import { TypeORMStore } from '@foal/typeorm';

export class AuthController {
  @dependency
  google: GoogleProvider;

  @dependency
  facebook: FacebookProvider;

  @dependency
  github: GithubProvider;

  @dependency
  store: TypeORMStore;

  @Get('/signin/google')
  redirectToGoogle() {
    return this.google.redirect();
  }

  @Get('/signin/google/cb')
  async handleGoogleRedirection(ctx: Context) {
    const { userInfo } = await this.google.getUserInfo(ctx);
    const session = await this.store.createAndSaveSession({ userInfo });
    const response = new HttpResponseRedirect('/');
    setSessionCookie(response, session.getToken());
    return response;
  }

  @Get('/signin/facebook')
  redirectToFacebook() {
    return this.facebook.redirect();
  }

  @Get('/signin/facebook/cb')
  async handleFacebookRedirection(ctx: Context) {
    const { userInfo } = await this.facebook.getUserInfo(ctx);
    const session = await this.store.createAndSaveSession({ userInfo });
    const response = new HttpResponseRedirect('/');
    setSessionCookie(response, session.getToken());
    return response;
  }

  @Get('/signin/github')
  redirectToGithub() {
    return this.github.redirect();
  }

  @Get('/signin/github/cb')
  async handleGithubRedirection(ctx: Context) {
    const { userInfo } = await this.github.getUserInfo(ctx);
    const session = await this.store.createAndSaveSession({ userInfo });
    const response = new HttpResponseRedirect('/');
    setSessionCookie(response, session.getToken());
    return response;
  }

}
