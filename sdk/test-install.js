#!/usr/bin/env node

/**
 * Test script to verify SDK installation and functionality
 * Usage: node test-install.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Trivium SDK Installation...\n');

// Test 1: Check if core module exists
try {
  const coreModule = require('./standalone-core');
  console.log('✅ Core module loaded successfully');
  console.log('Available exports:', Object.keys(coreModule));
} catch (error) {
  console.log('❌ Core module failed to load:', error.message);
}

// Test 2: Test TriviumCore instantiation
try {
  const { TriviumCore, LensPatterns, LensType } = require('./standalone-core');
  const trivium = new TriviumCore();
  console.log('✅ TriviumCore instantiated successfully');
  console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(trivium)));
} catch (error) {
  console.log('❌ TriviumCore instantiation failed:', error.message);
}

// Test 3: Test lens processing
async function testLensProcessing() {
  try {
    const { TriviumCore, LensPatterns, LensType } = require('./standalone-core');
    const trivium = new TriviumCore();
    
    const testText = "function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }";
    
    console.log('\n🧪 Testing lens processing...');
    const result = await trivium.processWithPattern(testText, LensPatterns.CODE_REVIEW);
    
    console.log('✅ Lens processing completed');
    console.log('Output keys:', Object.keys(result.outputs));
    console.log('Sample output:', result.outputs[Object.keys(result.outputs)[0]]?.substring(0, 100) + '...');
    
  } catch (error) {
    console.log('❌ Lens processing failed:', error.message);
  }
}

// Test 4: Test pattern availability
try {
  const { LensPatterns } = require('./standalone-core');
  console.log('\n📋 Available patterns:');
  Object.keys(LensPatterns).forEach(pattern => {
    console.log(`  - ${pattern}: ${LensPatterns[pattern].description}`);
  });
  console.log('✅ All patterns loaded successfully');
} catch (error) {
  console.log('❌ Pattern loading failed:', error.message);
}

// Run async tests
testLensProcessing().then(() => {
  console.log('\n🎉 SDK test completed!');
}).catch(error => {
  console.log('\n💥 SDK test failed:', error.message);
});