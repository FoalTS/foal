// FoalTS
import { IApiExternalDocumentation, IApiInfo, IApiServer, IApiTag } from './interfaces';

export function ApiInfo(info: IApiInfo) {
  return Reflect.metadata('api:info', info);
}

export function ApiServer(server: IApiServer) {

}

export function ApiExternalDoc(externalDoc: IApiExternalDocumentation) {

}

export function ApiDefineTag(tag: IApiTag) {

}
