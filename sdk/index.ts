// Export main SDK components
export * from './core';
export * from './types';

// Export specific interfaces for easier imports
export { 
  TriviumCore, 
  createTriviumCore,
  LensPatterns,
  LensType,
  type ProcessResult,
  type LensPattern,
  type Sovereignty 
} from './core';

// Version and metadata
export const SDK_VERSION = '1.0.0';
export const SDK_NAME = 'trivium-cognitive-sdk';