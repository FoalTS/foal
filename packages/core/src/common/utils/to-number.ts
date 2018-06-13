export function toNumber(str: string|undefined): number {
  const result = parseInt(str || '', 10);

  if (isNaN(result)) {
    throw new Error(`${str} cannot be converted to a number.`);
  }

  return result;
}
