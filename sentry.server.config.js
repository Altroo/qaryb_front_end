// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
// import { BrowserTracing } from '@sentry/tracing';
// import { ProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  // environment: "production",
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.2,
  // integrations: [
  //   new BrowserTracing({
  //     tracePropagationTargets: [`${process.env.API_ROOT_URL}`],
  //   }),
  //   // new ProfilingIntegration(),
  // ],
  // profilesSampleRate: 1.0,
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});