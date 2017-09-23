export function sendSuccess(res: any, successStatus: number, data: any) {
  if (typeof data === 'undefined') {
    res.sendStatus(successStatus);
  } else {
    res.status(successStatus).send(typeof data === 'number' ? data.toString() : data);
  }
}
