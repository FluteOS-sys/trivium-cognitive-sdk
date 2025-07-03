# Trivium SDK Modular Deployment Architecture

## Deployment Strategy: Multiple Distribution Channels

### 1. Standalone NPM Package (Core SDK)
```bash
npm install trivium-cognitive-sdk
```

**Contents:**
- Core cognitive lens engine (client-side processing)
- All 10 lens processors with local fallback
- Pattern library and archetypal foundations
- TypeScript definitions
- Zero external dependencies for basic functionality

**Usage:**
```javascript
import { TriviumCore, LensPatterns, LensType } from 'trivium-cognitive-sdk';

const trivium = new TriviumCore();
const result = await trivium.processWithPattern(code, LensPatterns.CODE_REVIEW);
```

### 2. Python Package (PyPI)
```bash
pip install trivium-sdk
```

**Contents:**
- Python native lens processors
- Jupyter notebook integration and magic commands
- Data science specific patterns (ML_VALIDATION, DATA_ANALYSIS)
- Local processing with optional API connection

**Usage:**
```python
from trivium_sdk import TriviumCore, LensPatterns

trivium = TriviumCore()
result = trivium.process_with_pattern(code, LensPatterns.CODE_REVIEW)
```

### 3. VS Code Extension
```bash
# Install from VS Code Marketplace
ext install trivium-cognitive-lens
```

**Features:**
- Right-click code analysis with cognitive lenses
- Sidebar panel showing multi-perspective insights
- Context-aware pattern suggestions
- Real-time cognitive feedback while coding

### 4. Self-Hosted Service (Docker)
```bash
docker pull trivium/cognitive-service
docker run -p 5000:5000 trivium/cognitive-service
```

**Contents:**
- Full Trivium application with database
- Krishna Observer system
- Custom lens management
- Team collaboration features

### 5. CLI Tool
```bash
npm install -g trivium-cli
# or
pip install trivium-cli
```

**Usage:**
```bash
trivium analyze --file code.js --pattern security-audit
trivium focus --pattern debugging --duration 25
trivium create-lens --interactive
```

## Architecture Separation

### Core Engine (Portable)
```
sdk/core/
├── lens-processors/          # All 10 cognitive lenses
├── pattern-library/          # Predefined lens combinations
├── archetypal-foundations/   # Base archetypal patterns
├── synthesis-engine/         # Output combination logic
└── validation/              # Lens validation and coverage
```

**Key Features:**
- Zero dependencies for basic functionality
- Works offline with local processing
- Consistent API across all platforms
- 100% archetypal coverage

### Server Components (Optional)
```
server/
├── api/                     # REST endpoints
├── database/               # PostgreSQL persistence
├── krishna-layer/          # Observer system
├── custom-lens-manager/    # User-created lenses
└── collaboration/          # Team features
```

### Platform Integrations
```
integrations/
├── vscode/                 # VS Code extension
├── jupyter/               # Notebook kernels and magics
├── cli/                   # Command line tools
├── github-actions/        # CI/CD workflows
└── webhooks/             # External service integrations
```

## Deployment Models

### 1. **Embedded SDK** (Most Common)
Developers integrate directly into their tools:
```javascript
// In VS Code extension
import { TriviumCore } from 'trivium-cognitive-sdk';
const trivium = new TriviumCore();

// In React app
import { useTriviumAnalysis } from 'trivium-react-hooks';
```

### 2. **Microservice Architecture**
Teams run Trivium as a shared service:
```yaml
# docker-compose.yml
services:
  trivium-api:
    image: trivium/cognitive-service
    ports: ["5000:5000"]
    environment:
      - DATABASE_URL=${DATABASE_URL}
```

### 3. **Serverless Functions**
Cloud deployment for scaled usage:
```javascript
// AWS Lambda / Vercel Function
export async function analyzeCognitive(request) {
  const trivium = new TriviumCore();
  return await trivium.processText(request.text, request.lenses);
}
```

### 4. **On-Premise Enterprise**
Full control for sensitive environments:
- Self-hosted database
- Custom lens libraries
- Team collaboration features
- Audit trails and compliance

## Distribution Strategy

### Phase 1: Core SDK Release
- **NPM Package**: `trivium-cognitive-sdk`
- **Python Package**: `trivium-sdk`
- **Documentation**: Usage guides and examples
- **GitHub**: Open source with examples

### Phase 2: Tool Integrations
- **VS Code Extension**: Marketplace release
- **CLI Tools**: Cross-platform distribution
- **Jupyter Integration**: Magic commands and kernels

### Phase 3: Enterprise Features
- **Self-hosted service**: Docker containers
- **Team collaboration**: Shared lens libraries
- **Enterprise security**: SSO, audit logs
- **Custom deployments**: On-premise support

## API Compatibility

All deployment models share the same core API:

```typescript
interface TriviumAPI {
  processText(text: string, lenses: LensType[]): Promise<ProcessResult>;
  processWithPattern(text: string, pattern: LensPattern): Promise<ProcessResult>;
  synthesizeOutputs(outputs: Record<LensType, string>, blend?: number): Promise<string>;
  createCustomLens(definition: CustomLensDefinition): Promise<CustomLens>;
  getSuggestedPattern(context: string): LensPattern;
}
```

## Key Benefits

### For Individual Developers
- **Easy Installation**: `npm install` or `pip install`
- **Zero Configuration**: Works out of the box
- **Offline Capable**: No external dependencies required
- **IDE Integration**: Natural workflow integration

### for Teams
- **Shared Service**: Central cognitive analysis
- **Custom Lenses**: Team-specific cognitive patterns
- **Collaboration**: Shared insights and patterns
- **Consistency**: Same cognitive framework across projects

### For Enterprises
- **Self-Hosted**: Complete control and security
- **Customizable**: Domain-specific lens development
- **Scalable**: Microservice architecture
- **Compliant**: Audit trails and governance

This modular architecture allows Trivium to serve everyone from individual developers using VS Code extensions to large enterprises running self-hosted cognitive analysis services, all while maintaining the same core 100% archetypal coverage and API consistency.