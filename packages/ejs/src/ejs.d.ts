declare module 'ejs' {
  // TODO: The returned type is wrong. It should be string|Promise<string>;
  function render(template: string, data?: any, opts?: any): string;
}