declare module 'pump' {
  function pump(source: any, dest: any, callback: (err: any) => void): any;
  namespace pump {}
  export = pump;
}