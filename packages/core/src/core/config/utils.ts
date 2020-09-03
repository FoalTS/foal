function makeLine(str: string): string {
  const length = 58;
  const spacesAfter = length - str.length;
  if (spacesAfter <= 0) {
    return str;
  }
  return '|' + str + ' '.repeat(spacesAfter) + '|\n';
}

export function makeBox(title: string, content: string[]): string {
  return '  --------------------------------------------------------\n'
  + '|                                                          |\n'
  + makeLine('  ' + title)
  + '|                                                          |\n'
  + '| -------------------------------------------------------- |\n'
  + '|                                                          |\n'
  + content.map(line => makeLine(line)).join('')
  + '|                                                          |\n'
  + '  --------------------------------------------------------\n';
}
