export class ConsoleLogger {
  log(str: string) {
    console.log(str);
  }
}

export { ConsoleLogger as ConcreteLogger };
