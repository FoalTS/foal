import { Class, Context, Get } from '@foal/core';

export abstract class SwaggerController {
  options: { url: string } |
           { controllerClass: Class } |
           (
             { name: string, url: string, primary?: boolean } |
             { name: string, controllerClass: Class, primary?: boolean }
           )[];

  @Get('swagger.json')
  getOpenApiDefinition(ctx: Context) {
    // Use a query /swagger.json?name=v1
  }

  // et un get pour chaque fichier

}
