#!/usr/bin/env node

/**
 * Database Provider Switching Tool
 * Switches between PostgreSQL and SQL Server
 *
 * Usage:
 *   npm run db:switch postgres     # Switch to PostgreSQL
 *   npm run db:switch sqlserver    # Switch to SQL Server
 *   npm run db:switch              # Interactive mode
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import * as readline from 'readline';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function updateEnvFile(provider: 'postgresql' | 'sqlserver') {
  const envPath = resolve(process.cwd(), '.env.local');

  try {
    let envContent = readFileSync(envPath, 'utf-8');

    // Update DATABASE_PROVIDER
    envContent = envContent.replace(
      /DATABASE_PROVIDER=".+"/,
      `DATABASE_PROVIDER="${provider}"`
    );

    // Update DATABASE_URL
    if (provider === 'postgresql') {
      envContent = envContent.replace(
        /DATABASE_URL="\$\{.+\}"/,
        'DATABASE_URL="${POSTGRES_URL}"'
      );
    } else {
      envContent = envContent.replace(
        /DATABASE_URL="\$\{.+\}"/,
        'DATABASE_URL="${SQLSERVER_URL}"'
      );
    }

    writeFileSync(envPath, envContent);
    log(`✓ Updated .env.local`, 'green');
  } catch (error) {
    log(`✗ Failed to update .env.local: ${error}`, 'red');
    throw error;
  }
}

function updatePrismaSchema(provider: 'postgresql' | 'sqlserver') {
  const schemaPath = resolve(process.cwd(), 'prisma/schema.prisma');

  try {
    let schemaContent = readFileSync(schemaPath, 'utf-8');

    // Update provider in datasource db block
    schemaContent = schemaContent.replace(
      /provider = ".+"/,
      `provider = "${provider}"`
    );

    writeFileSync(schemaPath, schemaContent);
    log(`✓ Updated prisma/schema.prisma`, 'green');
  } catch (error) {
    log(`✗ Failed to update schema.prisma: ${error}`, 'red');
    throw error;
  }
}

function runPrismaGenerate() {
  try {
    log('\nRegenerating Prisma Client...', 'yellow');
    execSync('npm run prisma:generate', { stdio: 'inherit' });
    log('✓ Prisma Client regenerated', 'green');
  } catch (error) {
    log('✗ Failed to regenerate Prisma Client', 'red');
    throw error;
  }
}

async function promptUser(): Promise<'postgresql' | 'sqlserver'> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    log('\n' + '='.repeat(60), 'blue');
    log('  Database Provider Selection', 'blue');
    log('='.repeat(60) + '\n', 'blue');

    log('Available providers:', 'cyan');
    log('  1. PostgreSQL (recommended for Vercel)', 'cyan');
    log('  2. SQL Server (for Azure or on-premise)', 'cyan');

    rl.question('\nSelect provider (1 or 2): ', (answer) => {
      rl.close();

      if (answer === '1') {
        resolve('postgresql');
      } else if (answer === '2') {
        resolve('sqlserver');
      } else {
        log('\nInvalid selection. Defaulting to PostgreSQL.', 'yellow');
        resolve('postgresql');
      }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  let provider: 'postgresql' | 'sqlserver';

  log('\n' + '='.repeat(60), 'magenta');
  log('  Database Provider Switching Tool', 'magenta');
  log('='.repeat(60), 'magenta');

  // Determine provider
  if (args[0] === 'postgres' || args[0] === 'postgresql') {
    provider = 'postgresql';
  } else if (args[0] === 'sqlserver' || args[0] === 'mssql') {
    provider = 'sqlserver';
  } else {
    provider = await promptUser();
  }

  log(`\nSwitching to ${provider.toUpperCase()}...\n`, 'yellow');

  try {
    // Step 1: Update .env.local
    log('Step 1: Updating environment variables...', 'cyan');
    updateEnvFile(provider);

    // Step 2: Update Prisma schema
    log('\nStep 2: Updating Prisma schema...', 'cyan');
    updatePrismaSchema(provider);

    // Step 3: Regenerate Prisma Client
    log('\nStep 3: Regenerating Prisma Client...', 'cyan');
    runPrismaGenerate();

    // Success message
    log('\n' + '='.repeat(60), 'green');
    log('  ✓ Database Provider Switched Successfully!', 'green');
    log('='.repeat(60), 'green');

    log(`\nCurrent provider: ${provider}`, 'cyan');
    log('\nNext steps:', 'yellow');
    log('  1. Ensure your database is running:', 'cyan');
    log(`     npm run db:start`, 'cyan');
    log('  2. Test the connection:', 'cyan');
    log(`     npm run db:test`, 'cyan');
    log('  3. Push schema to database:', 'cyan');
    log('     npm run prisma:push', 'cyan');
    log('     or: npm run prisma:migrate\n', 'cyan');

  } catch (error) {
    log('\n✗ Failed to switch database provider', 'red');
    log(`Error: ${error instanceof Error ? error.message : String(error)}`, 'red');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\nUnexpected error: ${error}`, 'red');
  process.exit(1);
});
