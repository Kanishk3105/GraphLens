import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { searchNodes } from '../lib/queries/graph';
import { getSession } from '../lib/db/cognodb';

async function testSearch() {
  const terms = ['Python', 'CognoDB', 'React', 'Node.js', 'Docker', 'Elena'];

  console.log('--- Testing searchNodes directly ---');
  for (const term of terms) {
    try {
      console.log(`\nSearching for "${term}"...`);
      const results = await searchNodes(term, 10);
      console.log(`Found ${results.length} results:`, JSON.stringify(results, null, 2));
    } catch (err) {
      console.error(`Error searching for "${term}":`, (err as Error).message);
    }
  }

  console.log('\n--- Inspecting all Language and Technology node names in database ---');
  const session = getSession();
  try {
    const res = await session.run(`
      MATCH (n)
      RETURN DISTINCT head(labels(n)) AS label, n.name AS name
      ORDER BY label, name
    `);
    console.log(`Total nodes retrieved: ${res.records.length}`);
    const nodeNames = res.records.map(r => `[${r.get('label')}] ${r.get('name')}`);
    console.log('Sample node names:', nodeNames.slice(0, 30));
  } catch (err) {
    console.error('Error fetching sample nodes:', (err as Error).message);
  } finally {
    await session.close();
  }
}

testSearch();
