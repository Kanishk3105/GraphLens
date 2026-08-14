import neo4j, { Driver, Session, ServerInfo } from 'neo4j-driver';

let driver: Driver | null = null;

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Please configure it in .env.local`
    );
  }
  return value;
}

export function getDriver(): Driver {
  if (!driver) {
    const uri = getEnvVar('COGNODB_URI');
    const username = getEnvVar('COGNODB_USERNAME');
    const password = getEnvVar('COGNODB_PASSWORD');

    driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 10000,
        connectionTimeout: 30000,
        logging: neo4j.logging.console(
          process.env.NODE_ENV === 'development' ? 'warn' : 'error'
        ),
      }
    );
  }
  return driver;
}

export function getSession(): Session {
  return getDriver().session();
}

export async function verifyConnection(): Promise<ServerInfo> {
  const d = getDriver();
  try {
    const serverInfo = await d.getServerInfo();
    console.log(`[CognoDB] Connected to ${serverInfo.address}`);
    return serverInfo;
  } catch (error) {
    console.error('[CognoDB] Connection failed:', (error as Error).message);
    throw error;
  }
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof (value as { toNumber?: () => number }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

export function extractNodeProperties(node: {
  properties: Record<string, unknown>;
  labels?: string[];
  identity?: unknown;
}): Record<string, unknown> & { _labels?: string[]; _id?: number } {
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node.properties)) {
    props[key] = typeof (value as { toNumber?: unknown }).toNumber === 'function'
      ? (value as { toNumber: () => number }).toNumber()
      : value;
  }
  if (node.labels) {
    props._labels = node.labels;
  }
  if (node.identity !== undefined) {
    props._id = toNumber(node.identity);
  }
  return props as Record<string, unknown> & { _labels?: string[]; _id?: number };
}
