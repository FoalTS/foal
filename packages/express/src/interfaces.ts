export type NextFunction = (err?: Error) => void;
export type ExpressMiddleware = (req: any, res: any, next: NextFunction) => any;
