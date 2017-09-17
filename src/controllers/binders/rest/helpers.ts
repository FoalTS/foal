import { Response } from 'express';

export function sendSuccess(res: Response, successStatus: number, data: any) {
  if (typeof data === 'undefined') {
    res.sendStatus(successStatus);
  } else {
    res.status(successStatus).send(data);
  }
}
