export interface BasicController {
  post?: (req: any, res: any) => any;
  get?: (req: any, res: any) => any;
  patch?: (req: any, res: any) => any;
  put?: (req: any, res: any) => any;
  delete?: (req: any, res: any) => any;
}
