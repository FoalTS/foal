import { Request, Response } from 'express';

import { BasicController, Service } from '@foal/core';

@Service()
export class MyController implements BasicController {
  public foobar = '';
  constructor() {}

  public post(req: Request, res: Response) {
    res.send(`foobar: ${this.foobar}`);
  }

  public get(req: Request, res: Response) {
    throw new Error();
  }

  public put(req: Request, res: Response) {
    res.send('put');
  }

  public patch(req: Request, res: Response) {
    res.send('patch');
  }

  public delete(req: Request, res: Response) {
    res.send('delete');
  }
}
