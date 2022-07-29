export function getCoreDependency(dependencies: { name: string, version: string }[]): { name: string, version: string } {
  return dependencies.find(dep => dep.name === '@foal/core')!;
}

export function createNotifierMessage(
  dependencies: { name: string, version: string }[],
  devDependencies: { name: string, version: string }[],
  version: string
): string {
  const foalDependencies = dependencies
    .concat(devDependencies)
    .filter(dep => dep.name.startsWith('@foal/'))
    .map(dep => `${dep.name}@${version}`)
    .join(' ');
  const command = `npm install ${foalDependencies}`;
  return `Run \`${command}\` to update.`;
}