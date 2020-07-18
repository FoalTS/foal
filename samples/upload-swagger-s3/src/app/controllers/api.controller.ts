import { Context, HttpResponseOK, ApiInfo, Post, ApiServer } from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';
import { JWTRequired } from '@foal/jwt';

@ApiInfo({
  version: '1.1.0',
  title: 'My API'
})
@ApiServer({
  url: '/api'
})
@JWTRequired()
export class ApiController {

  @Post('/profile')
  @ValidateMultipartFormDataBody({
    fields: {
      email: { type: 'string', format: 'email' }
    },
    files: {
      profile: { required: true, saveTo: 'profiles' },
      pictures: { required: false, multiple: true, saveTo: 'pictures' }
    }
  })
  index(ctx: Context) {
    // Return the paths of the files (for the demo)
    return new HttpResponseOK(ctx.request.body.files);
  }

}
