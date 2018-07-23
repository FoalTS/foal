import {
  Class,
  Context,
  Controller,
  Delete,
  Get,
  HttpResponseCreated,
  HttpResponseMethodNotAllowed,
  HttpResponseNotImplemented,
  Patch,
  Post,
  Put,
  ServiceManager
} from '../../core';
import { ISerializer } from '../services';
import { okOrNotFound } from '../utils';

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

  getQuery(ctx: Context): object {
    return {};
  }

  @Delete('/')
  delete() {
    return new HttpResponseMethodNotAllowed();
  }

  @Delete('/:id')
  deleteById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.removeOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    return okOrNotFound(serializer.removeOne(query));
  }

  @Get('/')
  get(ctx: Context) {
    // schema and id
    // hooks
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.findMany) {
      return new HttpResponseNotImplemented();
    }

    const query = this.getQuery(ctx);
    return okOrNotFound(serializer.findMany(query));
  }

  @Get('/:id')
  getById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.findOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    return okOrNotFound(serializer.findOne(query));
  }

  @Patch('/')
  patch() {
    return new HttpResponseMethodNotAllowed();
  }

  @Patch('/:id')
  patchById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.updateOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    return okOrNotFound(serializer.updateOne(
      query, ctx.request.body
    ));
  }

  @Post('/')
  async post(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.createOne) {
      return new HttpResponseNotImplemented();
    }

    return new HttpResponseCreated(await serializer.createOne(ctx.request.body));
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
  putById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.updateOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    return okOrNotFound(serializer.updateOne(
      query, ctx.request.body
    ));
  }

}
