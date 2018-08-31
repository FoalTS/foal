export function getCommandLineArguments(argv: string[]) {
<<<<<<< HEAD
  const args = argv.splice(4);
=======
  const args = argv.splice(2);
>>>>>>> Add getCommandLineArguments util.
  const result: any = {};
  args.forEach(keyAndValue => {
    const [ key, value ] = keyAndValue.split('=');

    if (typeof value === 'undefined') {
      result[key] = true;
      return;
    }

    try {
      result[key] = JSON.parse(value);
    } catch (error) {
      result[key] = value;
    }
  });
  return result;
}
