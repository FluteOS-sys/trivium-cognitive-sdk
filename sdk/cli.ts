#!/usr/bin/env node

import { Command } from 'commander';
import { TriviumCore, LensPatterns, LensType } from './core';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('trivium')
  .description('Cognitive lens processing for developers')
  .version('1.0.0');

// Analyze command
program
  .command('analyze')
  .description('Analyze file or text through cognitive lenses')
  .option('-f, --file <path>', 'file to analyze')
  .option('-t, --text <content>', 'text content to analyze')
  .option('-l, --lenses <lenses>', 'comma-separated lens types (ethical,emotional,logical,symbolic)')
  .option('-p, --pattern <pattern>', 'predefined pattern (code-review, debugging, documentation, etc.)')
  .option('-o, --output <path>', 'output file path')
  .action(async (options) => {
    try {
      const trivium = new TriviumCore();
      
      let content = '';
      if (options.file) {
        content = fs.readFileSync(options.file, 'utf8');
      } else if (options.text) {
        content = options.text;
      } else {
        console.error('Error: Must provide either --file or --text');
        process.exit(1);
      }

      let result;
      if (options.pattern) {
        const pattern = getPatternByName(options.pattern);
        if (!pattern) {
          console.error(`Error: Unknown pattern "${options.pattern}"`);
          console.log('Available patterns:', Object.keys(LensPatterns).map(k => k.toLowerCase().replace('_', '-')).join(', '));
          process.exit(1);
        }
        result = await trivium.processWithPattern(content, pattern);
      } else if (options.lenses) {
        const lenses = options.lenses.split(',').map((l: string) => l.trim() as LensType);
        result = await trivium.processText(content, lenses);
      } else {
        // Default to architecture pattern
        result = await trivium.processWithPattern(content, LensPatterns.ARCHITECTURE);
      }

      const output = {
        timestamp: new Date().toISOString(),
        pattern: result.pattern?.name || 'custom',
        content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        analysis: result.outputs
      };

      if (options.output) {
        fs.writeFileSync(options.output, JSON.stringify(output, null, 2));
        console.log(`Analysis saved to: ${options.output}`);
      } else {
        console.log(JSON.stringify(output, null, 2));
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// Focus command
program
  .command('focus')
  .description('Start a focused development session with cognitive lens guidance')
  .option('-p, --pattern <pattern>', 'lens pattern for the session')
  .option('-d, --duration <minutes>', 'session duration in minutes', '25')
  .action(async (options) => {
    const duration = parseInt(options.duration);
    const pattern = options.pattern ? getPatternByName(options.pattern) : LensPatterns.DEBUGGING;
    
    if (!pattern) {
      console.error(`Error: Unknown pattern "${options.pattern}"`);
      process.exit(1);
    }

    console.log(`🧠 Starting ${duration}-minute focus session with ${pattern.name} pattern`);
    console.log(`Focus: ${pattern.focus}`);
    console.log(`Lenses: ${pattern.lenses.join(', ')}`);
    console.log('---');
    
    // Simple timer implementation
    const startTime = Date.now();
    const endTime = startTime + (duration * 60 * 1000);
    
    console.log(`Session started at ${new Date(startTime).toLocaleTimeString()}`);
    console.log(`Session will end at ${new Date(endTime).toLocaleTimeString()}`);
    
    // Reminder at halfway point
    setTimeout(() => {
      console.log(`\n⏰ Halfway reminder: Stay focused on ${pattern.focus}`);
    }, (duration * 60 * 1000) / 2);
    
    // End session
    setTimeout(() => {
      console.log(`\n✅ Focus session complete! Time for a break.`);
      process.exit(0);
    }, duration * 60 * 1000);
    
    // Keep process alive
    console.log('Press Ctrl+C to end session early\n');
  });

// Batch command
program
  .command('batch')
  .description('Process multiple files with cognitive lens analysis')
  .option('-d, --dir <directory>', 'directory to process')
  .option('-e, --ext <extensions>', 'file extensions to include (comma-separated)', 'js,ts,py,md')
  .option('-p, --pattern <pattern>', 'pattern to apply', 'documentation')
  .option('-o, --output <directory>', 'output directory for results')
  .action(async (options) => {
    const trivium = new TriviumCore();
    const pattern = getPatternByName(options.pattern) || LensPatterns.DOCUMENTATION;
    const extensions = options.ext.split(',').map((e: string) => e.trim());
    
    const files = getFilesInDirectory(options.dir, extensions);
    console.log(`Processing ${files.length} files with ${pattern.name} pattern...`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const result = await trivium.processWithPattern(content, pattern);
        
        const outputPath = options.output 
          ? path.join(options.output, `${path.basename(file)}.analysis.json`)
          : `${file}.analysis.json`;
          
        const output = {
          file: file,
          timestamp: new Date().toISOString(),
          pattern: pattern.name,
          analysis: result.outputs
        };
        
        if (options.output) {
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        }
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        
        console.log(`✓ ${file} -> ${outputPath}`);
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  });

// List patterns command
program
  .command('patterns')
  .description('List available cognitive lens patterns')
  .action(() => {
    const trivium = new TriviumCore();
    const patterns = trivium.getAllPatterns();
    
    console.log('Available Cognitive Lens Patterns:\n');
    patterns.forEach(pattern => {
      console.log(`${pattern.name.toLowerCase().replace('_', '-')}`);
      console.log(`  Lenses: ${pattern.lenses.join(', ')}`);
      console.log(`  Focus: ${pattern.focus}`);
      console.log(`  Description: ${pattern.description}\n`);
    });
  });

// Helper functions
function getPatternByName(name: string) {
  const normalizedName = name.toUpperCase().replace('-', '_');
  return (LensPatterns as any)[normalizedName];
}

function getFilesInDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const entries = fs.readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(entry).slice(1);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

if (require.main === module) {
  program.parse();
}