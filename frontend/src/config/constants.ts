interface Config {
  apiUrl: string;
}

export const config: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
} as const;

Object.entries(config).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Configuration error: ${key} is undefined`);
  }
});