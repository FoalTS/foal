import {
  Context,
  Delete,
  Get,
  HttpResponseBadRequest,
  HttpResponseCreated,
  HttpResponseForbidden,
  HttpResponseMethodNotAllowed,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  Patch,
  Post,
  Put,
} from '../../core';
import { isObjectDoesNotExist, isPermissionDenied, isValidationError } from '../errors';
import { CollectionParams, IResourceCollection } from '../services';

export abstract class RestController {
  abstract collection: Partial<IResourceCollection>;

  extendParams(ctx: Context, params: CollectionParams): CollectionParams {
    return params;
  }

  @Delete('/')
  delete() {
    return new HttpResponseMethodNotAllowed();
  }

  @Delete('/:id')
  async deleteById(ctx: Context) {
    if (!this.collection.deleteById) {
      return new HttpResponseNotImplemented();
    }

    try {
      return new HttpResponseOK(await this.collection.deleteById(ctx.user, ctx.request.params.id, {}));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound(error.content);
      } else if (isValidationError(error)) {
        return new HttpResponseBadRequest(error.content);
      } else if (isPermissionDenied(error)) {
        return new HttpResponseForbidden(error.content);
      }
      throw error;
    }
  }

  @Get('/')
  async get(ctx: Context) {
    if (!this.collection.find) {
      return new HttpResponseNotImplemented();
    }

    const params = this.extendParams(ctx, {});
    try {
      return new HttpResponseOK(await this.collection.find(ctx.user, params));
    } catch (error) {
      if (isValidationError(error)) {
        return new HttpResponseBadRequest(error.content);
      } else if (isPermissionDenied(error)) {
        return new HttpResponseForbidden(error.content);
      }
      throw error;
    }
  }

  @Get('/:id')
  async getById(ctx: Context) {
    if (!this.collection.findById) {
      return new HttpResponseNotImplemented();
    }

    try {
      return new HttpResponseOK(await this.collection.findById(ctx.user, ctx.request.params.id, {}));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound(error.content);
      } else if (isValidationError(error)) {
        return new HttpResponseBadRequest(error.content);
      } else if (isPermissionDenied(error)) {
        return new HttpResponseForbidden(error.content);
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
    if (!this.collection.modifyById) {
      return new HttpResponseNotImplemented();
    }

    try {
      return new HttpResponseOK(await this.collection.modifyById(
        ctx.user, ctx.request.params.id , ctx.request.body, {}
      ));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound(error.content);
      } else if (isValidationError(error)) {
        return new HttpResponseBadRequest(error.content);
      } else if (isPermissionDenied(error)) {
        return new HttpResponseForbidden(error.content);
      }
      throw error;
    }
  }

  @Post('/')
  async post(ctx: Context) {
    if (!this.collection.create) {
      return new HttpResponseNotImplemented();
    }

    try {
      return new HttpResponseCreated(await this.collection.create(ctx.user, ctx.request.body, {}));
    } catch (error) {
      if (isValidationError(error)) {
        return new HttpResponseBadRequest(error.content);
      } else if (isPermissionDenied(error)) {
        return new HttpResponseForbidden(error.content);
      }
      throw error;
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
  async putById(ctx: Context) {
    if (!this.collection.updateById) {
      return new HttpResponseNotImplemented();
    }

    try {
      return new HttpResponseOK(await this.collection.updateById(
        ctx.user, ctx.request.params.id, ctx.request.body, {}
      ));
    } catch (error) {
      if (isObjectDoesNotExist(error)) {
        return new HttpResponseNotFound(error.content);
      } else if (isValidationError(error)) {
        return new HttpResponseBadRequest(error.content);
      } else if (isPermissionDenied(error)) {
        return new HttpResponseForbidden(error.content);
      }
      throw error;
    }
  }

}
