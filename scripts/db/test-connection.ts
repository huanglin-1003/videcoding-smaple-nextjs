#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connectivity to both PostgreSQL and SQL Server databases
 *
 * Usage:
 *   npm run db:test              # Test current DATABASE_URL
 *   npm run db:test postgres     # Test PostgreSQL
 *   npm run db:test sqlserver    # Test SQL Server
 *   npm run db:test all          # Test both databases
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const args = process.argv.slice(2);
const testTarget = args[0] || 'current';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testPostgres(connectionString: string): Promise<boolean> {
  try {
    const { Client } = await import('pg');
    const client = new Client({ connectionString });

    await client.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    await client.end();

    log('\n✓ PostgreSQL Connection Successful', 'green');
    log(`  Time: ${result.rows[0].current_time}`, 'cyan');
    log(`  Version: ${result.rows[0].version.split(',')[0]}`, 'cyan');
    return true;
  } catch (error) {
    log('\n✗ PostgreSQL Connection Failed', 'red');
    log(`  Error: ${error instanceof Error ? error.message : String(error)}`, 'red');
    return false;
  }
}

async function testSqlServer(connectionString: string): Promise<boolean> {
  try {
    const { Connection } = await import('tedious');
    const { Request } = await import('tedious');

    // Parse SQL Server connection string
    const url = new URL(connectionString.replace('sqlserver://', 'http://'));
    const params = new URLSearchParams(url.search.substring(1));

    const config = {
      server: url.hostname,
      authentication: {
        type: 'default' as const,
        options: {
          userName: params.get('user') || 'sa',
          password: params.get('password') || '',
        },
      },
      options: {
        database: params.get('database') || 'breakfast_delivery',
        encrypt: params.get('encrypt') === 'true',
        trustServerCertificate: params.get('trustServerCertificate') === 'true',
        port: parseInt(url.port) || 1433,
      },
    };

    return new Promise((resolve) => {
      const connection = new Connection(config);

      connection.on('connect', (err) => {
        if (err) {
          log('\n✗ SQL Server Connection Failed', 'red');
          log(`  Error: ${err.message}`, 'red');
          resolve(false);
          return;
        }

        const request = new Request(
          'SELECT GETDATE() as current_time, @@VERSION as version',
          (err) => {
            if (err) {
              log('\n✗ SQL Server Query Failed', 'red');
              log(`  Error: ${err.message}`, 'red');
              resolve(false);
            } else {
              log('\n✓ SQL Server Connection Successful', 'green');
            }
            connection.close();
          }
        );

        request.on('row', (columns) => {
          log(`  Time: ${columns[0].value}`, 'cyan');
          const version = columns[1].value.split('\n')[0];
          log(`  Version: ${version}`, 'cyan');
          resolve(true);
        });

        connection.execSql(request);
      });

      connection.connect();
    });
  } catch (error) {
    log('\n✗ SQL Server Connection Failed', 'red');
    log(`  Error: ${error instanceof Error ? error.message : String(error)}`, 'red');
    return false;
  }
}

async function main() {
  log('='.repeat(60), 'blue');
  log('  Database Connection Test', 'blue');
  log('='.repeat(60), 'blue');

  const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  const sqlserverUrl = process.env.SQLSERVER_URL;
  const currentUrl = process.env.DATABASE_URL;

  if (testTarget === 'current') {
    if (!currentUrl) {
      log('\n✗ DATABASE_URL not found in .env.local', 'red');
      process.exit(1);
    }

    log('\nTesting current DATABASE_URL...', 'yellow');
    log(`Connection: ${currentUrl.replace(/:[^:@]+@/, ':****@')}`, 'cyan');

    const isPostgres = currentUrl.startsWith('postgresql://');
    const result = isPostgres
      ? await testPostgres(currentUrl)
      : await testSqlServer(currentUrl);

    process.exit(result ? 0 : 1);
  }

  if (testTarget === 'postgres' || testTarget === 'all') {
    if (!postgresUrl) {
      log('\n✗ POSTGRES_URL not found in .env.local', 'red');
      if (testTarget === 'postgres') process.exit(1);
    } else {
      log('\nTesting PostgreSQL...', 'yellow');
      log(`Connection: ${postgresUrl.replace(/:[^:@]+@/, ':****@')}`, 'cyan');
      await testPostgres(postgresUrl);
    }
  }

  if (testTarget === 'sqlserver' || testTarget === 'all') {
    if (!sqlserverUrl) {
      log('\n✗ SQLSERVER_URL not found in .env.local', 'red');
      if (testTarget === 'sqlserver') process.exit(1);
    } else {
      log('\nTesting SQL Server...', 'yellow');
      log(`Connection: ${sqlserverUrl.replace(/password=[^;]+/, 'password=****')}`, 'cyan');
      await testSqlServer(sqlserverUrl);
    }
  }

  log('\n' + '='.repeat(60), 'blue');
  log('  Test Complete', 'blue');
  log('='.repeat(60) + '\n', 'blue');
}

main().catch((error) => {
  log(`\nUnexpected error: ${error}`, 'red');
  process.exit(1);
});
