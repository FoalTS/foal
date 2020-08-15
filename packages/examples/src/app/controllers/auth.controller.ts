// 3p
import {
  Context,
  createSession,
  dependency,
  Get,
  HttpResponse,
  HttpResponseRedirect,
  setSessionCookie,
} from '@foal/core';
import { FacebookProvider, GithubProvider, GoogleProvider, LinkedInProvider } from '@foal/social';
import { TypeORMStore } from '@foal/typeorm';

export class AuthController {
  @dependency
  google: GoogleProvider;

  @dependency
  facebook: FacebookProvider;

  @dependency
  github: GithubProvider;

  @dependency
  linkedin: LinkedInProvider;

  @dependency
  store: TypeORMStore;

  @Get('/signin/google')
  redirectToGoogle() {
    return this.google.redirect();
  }

  @Get('/signin/google/cb')
  async handleGoogleRedirection(ctx: Context) {
    const { userInfo } = await this.google.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo);
  }

  @Get('/signin/facebook')
  redirectToFacebook() {
    return this.facebook.redirect();
  }

  @Get('/signin/facebook/cb')
  async handleFacebookRedirection(ctx: Context) {
    const { userInfo } = await this.facebook.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo);
  }

  @Get('/signin/github')
  redirectToGithub() {
    return this.github.redirect();
  }

  @Get('/signin/github/cb')
  async handleGithubRedirection(ctx: Context) {
    const { userInfo } = await this.github.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo);
  }

  @Get('/signin/linkedin')
  redirectToLinkedIn() {
    return this.linkedin.redirect();
  }

  @Get('/signin/linkedin/cb')
  async handleLinkedInRedirection(ctx: Context) {
    const { userInfo } = await this.linkedin.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo);
  }

  private async createSessionAndSaveUserInfo(userInfo: any): Promise<HttpResponse> {
    const session = await createSession(this.store);
    session.set('userInfo', userInfo);
    await session.commit();

    const response = new HttpResponseRedirect('/');
    setSessionCookie(response, session);
    return response;
  }

}
