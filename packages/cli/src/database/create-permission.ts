// 3p
import { createConnection } from 'typeorm';

export async function createPermission(name: string, codeName: string, permissionPath: string): Promise<string> {
  const connection = await createConnection();
  return '';
}
