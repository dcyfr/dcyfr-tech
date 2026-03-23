import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@dcyfr/design-system'],
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG ?? 'dcyfr-labs',
  project: process.env.SENTRY_PROJECT ?? 'dcyfr-tech',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { disable: false, deleteSourcemapsAfterUpload: true },
  disableLogger: true,
  tunnelRoute: '/monitoring',
  automaticVercelMonitors: true,
});
