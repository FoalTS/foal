import { generateToken } from './generate-token.util';
import { signToken } from './sign-token.util';

export async function generateSignedToken(secret: string): Promise<string> {
  const unsignedToken = await generateToken();
  return signToken(unsignedToken, secret);
}
