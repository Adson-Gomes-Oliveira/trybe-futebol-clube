import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../helper/httpStatus.helper';

function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (!Object.values(HttpStatus).includes(Number(err.stack))) {
    return res.status(HttpStatus.INTERNAL).json({
      error: err.name,
      message: err.message,
    });
  }

  res.status(Number(err.stack)).json({
    error: err.name,
    message: err.message,
    code: err.stack,
  });
}

export default errorMiddleware;
