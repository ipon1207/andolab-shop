import { hc } from 'hono/client';
import type { AppType } from '../../backend/src/index.ts';

const backendUrl = `http://${window.location.hostname}:3000`;
export const client = hc<AppType>(backendUrl);
