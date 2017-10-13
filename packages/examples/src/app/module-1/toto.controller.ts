import { Request, Response } from 'express';

import { BasicController, Service } from '@foal/core';

import { MyController } from '../services/my-controller.controller';

@Service()
export class TotoController implements BasicController {
  constructor(private myController: MyController) {}

  public post(req: Request, res: Response) {
    console.log(this.myController.foobar);
    this.myController.foobar = 'toto';
    res.send('Yeah man!');
  }

  public get(req: Request, res: Response) {

  }

  public put(req: Request, res: Response) {

  }

  public patch(req: Request, res: Response) {

  }

  public delete(req: Request, res: Response) {

  }
}
