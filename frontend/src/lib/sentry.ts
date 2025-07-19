import * as Sentry from '@sentry/nextjs';

if (!process.env.SENTRY_DSN) {
  throw new Error('SENTRY_DSN is not defined');
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma(),
  ],
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  }
});

export function captureException(error: Error | string, context?: Record<string, any>) {
  if (error instanceof Error) {
    Sentry.captureException(error, {
      extra: context
    });
  } else {
    Sentry.captureMessage(error, {
      level: 'error',
      extra: context
    });
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  Sentry.captureMessage(message, {
    level,
    extra: context
  });
}

export function setUser(id: string, email?: string, username?: string) {
  Sentry.setUser({
    id,
    email,
    username
  });
}

export function clearUser() {
  Sentry.setUser(null);
}

export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op
  });
}

export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

export function setExtra(key: string, value: any) {
  Sentry.setExtra(key, value);
}

export default Sentry; 