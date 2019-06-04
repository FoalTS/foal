export function extractProperties(schema: object): { name: string, schema: any, required: boolean }[] {
  const properties = (schema as any).properties || {};
  const required: string[] = (schema as any).required || [];

  return Object.keys(properties).reverse().map(property => ({
    name: property,
    required: required.includes(property),
    schema: properties[property],
  }));
}
