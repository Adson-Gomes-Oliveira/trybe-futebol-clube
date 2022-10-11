import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../helper/httpStatus.helper';

function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (!err.stack) return res.status(HttpStatus.INTERNAL).json(err.message);
  res.status(Number(err.stack)).json(err.message);
  next(err);
}

export default errorMiddleware;
