import { LoginRequired } from '../../auth';
import { Class, Controller, Delete, Get, HttpResponseMethodNotAllowed, HttpResponseNotImplemented, Patch, Post, Put, ServiceManager } from '../../core';
import { ISerializer } from '../services';

@Controller()
export abstract class RestController {
  abstract serializerClass: Class<Partial<ISerializer>>;

  constructor(private services: ServiceManager) { }
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
  delete() {
    return new HttpResponseMethodNotAllowed();
  }

  @Delete('/:id')
  deleteById() {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.removeOne) {
      return new HttpResponseNotImplemented();
    }
  }

  @Get('/')
  get() {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.findMany) {
      return new HttpResponseNotImplemented();
    }
  }

  @Get('/:id')
  getById() {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.findOne) {
      return new HttpResponseNotImplemented();
    }
  }

  @Patch('/')
  patch() {
    return new HttpResponseMethodNotAllowed();
  }

  @Patch('/:id')
  patchById() {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.updateOne) {
      return new HttpResponseNotImplemented();
    }
  }

  @Post('/')
  post() {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.createOne) {
      return new HttpResponseNotImplemented();
    }
  }

  @Post('/:id')
  postById() {
    return new HttpResponseMethodNotAllowed();
  }

  @Put('/')
  put() {
    return new HttpResponseMethodNotAllowed();
  }

  @Put('/:id')
  putById() {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.updateOne) {
      return new HttpResponseNotImplemented();
    }
  }

}
