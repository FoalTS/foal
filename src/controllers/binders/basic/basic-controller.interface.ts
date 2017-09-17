import { Request, Response } from 'express';

export interface BasicController {
  post?: (req: Request, res: Response) => any;
  get?: (req: Request, res: Response) => any;
  patch?: (req: Request, res: Response) => any;
  put?: (req: Request, res: Response) => any;
  delete?: (req: Request, res: Response) => any;
}
