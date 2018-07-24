import {
  Class,
  Context,
  Controller,
  Delete,
  Get,
  HttpResponseCreated,
  HttpResponseMethodNotAllowed,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  Patch,
  Post,
  Put,
  ServiceManager
} from '../../core';
import { isObjectDoesNotExist } from '../errors';
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

  getQuery(ctx: Context): object {
    return {};
  }

  @Delete('/')
  delete() {
    return new HttpResponseMethodNotAllowed();
  }

  @Delete('/:id')
  async deleteById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.removeOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    try {
      return new HttpResponseOK(await serializer.removeOne(query));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound();
      }
      throw error;
    }
  }

  @Get('/')
  async get(ctx: Context) {
    // schema and id
    // hooks
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.findMany) {
      return new HttpResponseNotImplemented();
    }

    const query = this.getQuery(ctx);
    return new HttpResponseOK(await serializer.findMany(query));
  }

  @Get('/:id')
  async getById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.findOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    try {
      return new HttpResponseOK(await serializer.findOne(query));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound();
      }
      throw error;
    }
  }

  @Patch('/')
  patch() {
    return new HttpResponseMethodNotAllowed();
  }

  @Patch('/:id')
  async patchById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.updateOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    try {
      return new HttpResponseOK(await serializer.updateOne(
        query, ctx.request.body
      ));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound();
      }
      throw error;
    }
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
  async putById(ctx: Context) {
    const serializer = this.services.get(this.serializerClass);
    if (!serializer.updateOne) {
      return new HttpResponseNotImplemented();
    }

    const query = { ...this.getQuery(ctx), id: ctx.request.params.id };
    try {
      return new HttpResponseOK(await serializer.updateOne(
        query, ctx.request.body
      ));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound();
      }
      throw error;
    }
  }

}
