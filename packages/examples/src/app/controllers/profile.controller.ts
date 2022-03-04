import {
  ApiInfo, ApiServer, Context, dependency, Get, Hook, HttpResponseNotFound, HttpResponseRedirect, Post, render
} from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';
import { getRepository } from '@foal/typeorm/node_modules/typeorm';

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

  @Post('/image')
  @Hook(async ctx => { ctx.user = await getRepository(User).findOne({ email: 'john@foalts.org' }); })
  @ParseAndValidateFiles({
    profile: { required: true, saveTo: 'images/profiles' }
  })
  async uploadProfilePicture(ctx: Context<User>) {
    const user = ctx.user;
    if (user.profile) {
      try {
        await this.disk.delete(user.profile);
      } catch (error: any) {
        console.log(error.message);
      }
    }

    user.profile = ctx.files.get('profile')[0].path;
    await getRepository(User).save(user);

    return new HttpResponseRedirect('/profile');
  }

  @Get('/image')
  @Hook(async ctx => { ctx.user = await getRepository(User).findOne({ email: 'john@foalts.org' }); })
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
