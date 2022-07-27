export function checkUserIdType(userId: number|string, userIdType?: 'string'|'number'): string|number {
  switch (userIdType) {
    case 'string':
      if (typeof userId !== 'string') {
        throw new Error(`Invalid user ID type: ${typeof userId}`);
      }
      return userId;
    case 'number':
      if (typeof userId !== 'number') {
        throw new Error(`Invalid user ID type: ${typeof userId}`);
      }
      return userId;
    default:
      if (typeof userId !== 'number') {
        throw new Error(`Invalid user ID type: ${typeof userId}`);
      }
      return userId;
  }
}