// std
import { createHmac } from 'crypto';

// FoalTS
import { convertBase64ToBase64url } from '../encoding';

export function sign(base64Value: string, base64Secret: string): Buffer {
  return createHmac('sha256', Buffer.from(base64Secret, 'base64'))
    .update(Buffer.from(base64Value, 'base64'))
    .digest();
}

export function signToken(unsignedToken: string, secret: string): string {
  const signature = sign(unsignedToken, secret).toString('base64');
  return `${unsignedToken}.${convertBase64ToBase64url(signature)}`;
}
