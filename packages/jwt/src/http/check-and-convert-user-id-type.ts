export function checkAndConvertUserIdType(userId: string, userIdType?: 'string'|'number'): string|number {
  switch (userIdType) {
    case 'string':
      return userId;
    case 'number':
    default:
      const numericalUserId = parseInt(userId, 10);
      if (isNaN(numericalUserId)) {
        throw new Error('Suspicious operation: invalid user ID type.');
      }
      return numericalUserId;
  }
}
