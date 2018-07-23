import { LoginRequired } from '../../auth';
import { Class, Controller, Delete, Get, Patch, Post, Put } from '../../core';
import { ISerializer } from '../services';

@Controller()
export abstract class RestController {
  abstract serializerClass: Class<Partial<ISerializer>>;
  // schema = {
  //   id: { type: 'number' }
  // };

  // requiredFields = {
  //   post: [ 'id' ],
  //   put: [ 'id' ]
  // };

  // hooks = {
  //   post: [ LoginRequired(), /*AssignUserId()*/ ]
  // };

  // getQuery(ctx): object {
  //   return {};
  // }

  @Delete('/')
  delete() {}

  @Delete('/:id')
  deleteById() {}

  @Get('/')
  get() {}

  @Get('/:id')
  getById() {}

  @Patch('/')
  patch() {}

  @Patch('/:id')
  patchById() {}

  @Post('/')
  post() {}

  @Post('/:id')
  postById() {}

  @Put('/')
  put() {}

  @Put('/:id')
  putById() {}

}
