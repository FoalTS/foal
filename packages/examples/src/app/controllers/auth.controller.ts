// 3p
import {
  Context,
  dependency,
  Get,
  HttpResponse,
  HttpResponseRedirect,
  Session,
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
    return this.google.redirect();
  }

  @Get('/signin/google/cb')
  async handleGoogleRedirection(ctx: Context<any, Session>) {
    const { userInfo } = await this.google.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/facebook')
  redirectToFacebook() {
    return this.facebook.redirect();
  }

  @Get('/signin/facebook/cb')
  async handleFacebookRedirection(ctx: Context<any, Session>) {
    const { userInfo } = await this.facebook.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/github')
  redirectToGithub() {
    return this.github.redirect();
  }

  @Get('/signin/github/cb')
  async handleGithubRedirection(ctx: Context<any, Session>) {
    const { userInfo } = await this.github.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/linkedin')
  redirectToLinkedIn() {
    return this.linkedin.redirect();
  }

  @Get('/signin/linkedin/cb')
  async handleLinkedInRedirection(ctx: Context<any, Session>) {
    const { userInfo } = await this.linkedin.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  @Get('/signin/twitter')
  redirectToTwittern() {
    return this.twitter.redirect();
  }

  @Get('/signin/twitter/cb')
  async handleTwitterRedirection(ctx: Context<any, Session>) {
    const { userInfo } = await this.twitter.getUserInfo(ctx);
    return this.createSessionAndSaveUserInfo(userInfo, ctx);
  }

  private async createSessionAndSaveUserInfo(userInfo: any, ctx: Context<any, Session>): Promise<HttpResponse> {
    ctx.session.set('userInfo', userInfo);
    ctx.session.regenerateID();

    return new HttpResponseRedirect('/');
  }

}
