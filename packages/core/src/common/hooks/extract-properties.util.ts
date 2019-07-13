/**
 * Returns the properties of an AJV schema of type object.
 *
 * @export
 * @param {object} schema - The AJV schema.
 * @returns {{ name: string, schema: any, required: boolean }[]} The well-formated properties.
 */
export function extractProperties(schema: object): { name: string, schema: any, required: boolean }[] {
  const properties = (schema as any).properties || {};
  const required: string[] = (schema as any).required || [];

  return Object.keys(properties).map(property => ({
    name: property,
    required: required.includes(property),
    schema: properties[property],
  }));
}
