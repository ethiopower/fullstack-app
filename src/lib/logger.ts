import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'fafresh-fashion' },
  transports: [
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// If we're not in production, also log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export interface LogContext {
  userId?: string;
  orderId?: string;
  path?: string;
  method?: string;
  [key: string]: any;
}

export function logInfo(message: string, context?: LogContext) {
  logger.info(message, context);
}

export function logError(error: Error | string, context?: LogContext) {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error(errorMessage, {
    ...context,
    stack: errorStack
  });
}

export function logWarning(message: string, context?: LogContext) {
  logger.warn(message, context);
}

export function logDebug(message: string, context?: LogContext) {
  logger.debug(message, context);
}

export function logRequest(req: Request, context?: LogContext) {
  const url = new URL(req.url);
  logger.info('Incoming request', {
    ...context,
    path: url.pathname,
    method: req.method,
    query: Object.fromEntries(url.searchParams)
  });
}

export function logResponse(req: Request, status: number, context?: LogContext) {
  const url = new URL(req.url);
  logger.info('Outgoing response', {
    ...context,
    path: url.pathname,
    method: req.method,
    status
  });
}

export default logger; 