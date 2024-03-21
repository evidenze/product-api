import { Request, Response, NextFunction } from 'express';


// Universal success response function
export const sendSuccessResponse = (
  res: Response,
  message: any,
  data?: any,
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    status: true,
    message,
    data,
  })
}

// Universal error response function
export const sendErrorResponse = (
  res: Response,
  errorMessage: string,
  error?: any,
  statusCode = 500,
) => {
  return res.status(statusCode).json({
    status: false,
    message: errorMessage,
    error: error,
  })
}

export const sendUnauthorizedResponse = (
  res: Response,
  message = 'Unauthorized',
) => {
  return res.status(401).json({ status: false, message })
}

export const handleInvalidEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorResponse = {
    status: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  };

  // Check if the endpoint is not found (404 status code)
  if (!res.headersSent) {
    res.status(404).json(errorResponse);
  } else {
    next();
  }
};

