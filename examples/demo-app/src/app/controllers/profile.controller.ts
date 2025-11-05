import {
  ApiInfo, ApiServer, Context, dependency, Get, Hook, HttpResponseNotFound, HttpResponseRedirect, Logger, Post, render, UserRequired
} from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';

import { User } from '../entities';

@ApiInfo({
  title: 'Profile API',
  version: '1.0.0',
})
@ApiServer({
  url: '/profile'
})
export class ProfileController {
  @dependency
  disk: Disk;

  @dependency
  logger: Logger;

  @Post('/image')
  @Hook(async ctx => { ctx.user = await User.findOneBy({ email: 'john@foalts.org' }); })
  @UserRequired()
  @ParseAndValidateFiles({
    profile: { required: true, saveTo: 'images/profiles' }
  })
  async uploadProfilePicture(ctx: Context<User>) {
    const user = ctx.user;
    if (user.profile) {
      try {
        await this.disk.delete(user.profile);
      } catch (error: any) {
        this.logger.error(error.message, { error });
      }
    }

    user.profile = ctx.files.get('profile')[0].path;
    await user.save();

    return new HttpResponseRedirect('/profile');
  }

  @Get('/image')
  @Hook(async ctx => { ctx.user = await User.findOneBy({ email: 'john@foalts.org' }); })
  @UserRequired()
  async downloadProfilePicture(ctx: Context<User>) {
    const { profile } = ctx.user;

    if (!profile) {
      return new HttpResponseNotFound();
    }

    return this.disk.createHttpResponse(profile);
  }

  @Get()
  profile() {
    return render('./templates/profile.html');
  }
}
