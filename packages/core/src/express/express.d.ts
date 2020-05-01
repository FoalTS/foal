declare module 'express' {
  function express(): any;

  namespace express {
    function Router(options?: any): any;
    function json(options?: any): any;
    function text(options?: any): any;
    function urlencoded(options?: any): any;
    function static(root: string, options?: any): any;
  }
  export = express;
}
