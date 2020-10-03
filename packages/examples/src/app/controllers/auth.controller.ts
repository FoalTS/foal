// 3p
import {
  Context,
  createSession,
  dependency,
  Get,
  HttpResponse,
  HttpResponseRedirect,
  TokenOptional,
} from '@foal/core';
import { FacebookProvider, GithubProvider, GoogleProvider, LinkedInProvider } from '@foal/social';
import { TypeORMStore } from '@foal/typeorm';

@TokenOptional({ cookie: true })
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
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/facebook')
  redirectToFacebook() {
    return this.facebook.redirect();
  }

  @Get('/signin/facebook/cb')
  async handleFacebookRedirection(ctx: Context) {
    const { userInfo } = await this.facebook.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/github')
  redirectToGithub() {
    return this.github.redirect();
  }

  @Get('/signin/github/cb')
  async handleGithubRedirection(ctx: Context) {
    const { userInfo } = await this.github.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/linkedin')
  redirectToLinkedIn() {
    return this.linkedin.redirect();
  }

  @Get('/signin/linkedin/cb')
  async handleLinkedInRedirection(ctx: Context) {
    const { userInfo } = await this.linkedin.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  private async createSessionAndSaveUserInfo(userInfo: any, ctx: Context): Promise<HttpResponse> {
    ctx.session = ctx.session || await createSession(this.store);
    ctx.session.set('userInfo', userInfo);
    ctx.session.regenerateID();

    return new HttpResponseRedirect('/');
  }

}
