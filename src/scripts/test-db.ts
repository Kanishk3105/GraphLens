import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import neo4j from 'neo4j-driver';

async function testConnection() {
  const uri = process.env.COGNODB_URI;
  const username = process.env.COGNODB_USERNAME;
  const password = process.env.COGNODB_PASSWORD;

  console.log('Testing CognoDB connection...');
  console.log(`URI: ${uri}`);
  console.log(`Username: ${username}`);
  console.log(`Password configured: ${Boolean(password)}`);

  if (!uri || !username || !password) {
    console.error('ERROR: Missing CognoDB environment variables in .env.local');
    process.exit(1);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    connectionTimeout: 15000,
    maxConnectionPoolSize: 10,
  });

  try {
    const serverInfo = await driver.getServerInfo();
    console.log(`\n✅ Connected successfully to CognoDB!`);
    console.log(`Server Address: ${serverInfo.address}`);
    console.log(`Agent/Version: ${serverInfo.agent}`);
    console.log(`Protocol Version: ${serverInfo.protocolVersion}`);

    const session = driver.session();
    try {
      const result = await session.run('MATCH (n) RETURN count(n) AS nodeCount');
      const count = result.records[0].get('nodeCount').toNumber();
      console.log(`Current Node Count in Database: ${count}`);
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error(`\n❌ Failed to connect to CognoDB:`, (error as Error).message);
    process.exit(1);
  } finally {
    await driver.close();
  }
}

testConnection();
