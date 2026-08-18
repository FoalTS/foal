/**
 * Extract the properties of a JSON schema object along with whether each of them is required.
 *
 * @export
 * @param {object} schema - The JSON schema to extract the properties from.
 * @returns {{ name: string, schema: any, required: boolean }[]} The extracted properties.
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
