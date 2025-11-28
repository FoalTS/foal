export function getNames(name: string): { camelName: string, kebabName: string, upperFirstCamelName: string } {
  const camelName = name.replace(/-([a-z])/gi, g => g[1].toUpperCase());
  const kebabName = name.replace(/([a-z][A-Z])/g, g => `${g[0]}-${g[1].toLowerCase()}`);
  const upperFirstCamelName = camelName.charAt(0).toUpperCase() + camelName.slice(1);

  return { camelName, kebabName, upperFirstCamelName };
}
