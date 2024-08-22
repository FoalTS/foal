// 3p
import {
  Context,
  dependency,
  Get,
  HttpResponse,
  HttpResponseRedirect,
  UseSessions,
} from '@foal/core';
import { FacebookProvider, GithubProvider, GoogleProvider, LinkedInProvider, TwitterProvider } from '@foal/social';
import { TypeORMStore } from '@foal/typeorm';

@UseSessions({ cookie: true, store: TypeORMStore })
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
  twitter: TwitterProvider;

  @dependency
  store: TypeORMStore;

  @Get('/signin/google')
  redirectToGoogle() {
    return this.google.createHttpResponseWithConsentPageUrl({ isRedirection: true });
  }

  @Get('/signin/google/cb')
  async handleGoogleRedirection(ctx: Context) {
    const { userInfo } = await this.google.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/facebook')
  redirectToFacebook() {
    return this.facebook.createHttpResponseWithConsentPageUrl({ isRedirection: true });
  }

  @Get('/signin/facebook/cb')
  async handleFacebookRedirection(ctx: Context) {
    const { userInfo } = await this.facebook.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/github')
  redirectToGithub() {
    return this.github.createHttpResponseWithConsentPageUrl({ isRedirection: true });
  }

  @Get('/signin/github/cb')
  async handleGithubRedirection(ctx: Context) {
    const { userInfo } = await this.github.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/linkedin')
  redirectToLinkedIn() {
    return this.linkedin.createHttpResponseWithConsentPageUrl({ isRedirection: true });
  }

  @Get('/signin/linkedin/cb')
  async handleLinkedInRedirection(ctx: Context) {
    const { userInfo } = await this.linkedin.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/twitter')
  redirectToTwitter() {
    return this.twitter.createHttpResponseWithConsentPageUrl({ isRedirection: true });
  }

  @Get('/signin/twitter/cb')
  async handleTwitterRedirection(ctx: Context) {
    const { userInfo } = await this.twitter.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  private async createSessionAndSaveUserInfo(userInfo: any, ctx: Context): Promise<HttpResponse> {
    ctx.session!.set('userInfo', userInfo);
    ctx.session!.regenerateID();

    return new HttpResponseRedirect('/');
  }

}
