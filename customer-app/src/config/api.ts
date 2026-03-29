import Constants from 'expo-constants';

const API_PATH = '/api/v1';
const HEALTH_PATH = '/health';
const DEFAULT_PORT = 3000;
const REQUEST_TIMEOUT_MS = 1500;

let cachedApiBaseUrl: string | null = null;
let resolveInFlight: Promise<string> | null = null;

const normalizeApiBaseUrl = (rawUrl: string) => {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return null;
  }

  if (trimmed.endsWith(API_PATH)) {
    return trimmed;
  }

  return `${trimmed}${API_PATH}`;
};

const readApiBaseUrlFromConfig = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) {
    return normalizeApiBaseUrl(envUrl);
  }

  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  const extraUrl = extra?.apiBaseUrl;
  if (extraUrl) {
    return normalizeApiBaseUrl(extraUrl);
  }

  return null;
};

const readApiBaseUrlFromDevHost = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  if (!host) {
    return null;
  }

  return `http://${host}:${DEFAULT_PORT}${API_PATH}`;
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), timeoutMs);
    }),
  ]);
};

const isReachable = async (apiBaseUrl: string) => {
  try {
    const response = await withTimeout(fetch(`${apiBaseUrl}${HEALTH_PATH}`), REQUEST_TIMEOUT_MS);
    return response.ok;
  } catch {
    return false;
  }
};

const buildCandidates = () => {
  const candidates = [
    readApiBaseUrlFromConfig(),
    readApiBaseUrlFromDevHost(),
    `http://localhost:${DEFAULT_PORT}${API_PATH}`,
    `http://10.0.2.2:${DEFAULT_PORT}${API_PATH}`,
  ].filter((value): value is string => Boolean(value));

  return [...new Set(candidates)];
};

const resolveFromCandidates = async () => {
  const candidates = buildCandidates();

  for (const candidate of candidates) {
    if (await isReachable(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'Backend is unreachable. Set EXPO_PUBLIC_API_BASE_URL to a stable URL (recommended: a tunnel URL).'
  );
};

export const resolveApiBaseUrl = async (forceRefresh = false) => {
  if (!forceRefresh && cachedApiBaseUrl) {
    return cachedApiBaseUrl;
  }

  if (!forceRefresh && resolveInFlight) {
    return resolveInFlight;
  }

  resolveInFlight = resolveFromCandidates()
    .then((resolved) => {
      cachedApiBaseUrl = resolved;
      return resolved;
    })
    .finally(() => {
      resolveInFlight = null;
    });

  return resolveInFlight;
};

export const getCachedApiBaseUrl = () => cachedApiBaseUrl;
