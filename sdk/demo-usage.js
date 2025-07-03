#!/usr/bin/env node

/**
 * Trivium SDK Demo - Real-world usage examples
 * This demonstrates how developers would use the SDK in practice
 */

const { TriviumCore, LensPatterns, LensType } = require('./standalone-core');

async function runDemo() {
  console.log('🎯 Trivium SDK Demo - Real-world Usage Examples\n');

  const trivium = new TriviumCore();

  // Demo 1: Code Review
  console.log('🔍 Demo 1: Cognitive Code Review');
  console.log('===============================');
  
  const codeSnippet = `
function processUserData(userData) {
  const result = userData.map(user => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferences: JSON.parse(user.preferences || '{}')
    };
  });
  return result;
}`;

  const codeReview = await trivium.processWithPattern(codeSnippet, LensPatterns.CODE_REVIEW);
  console.log('Pattern:', codeReview.pattern);
  console.log('Focus:', codeReview.focus);
  console.log('\nEthical perspective:');
  console.log(codeReview.outputs.ethical.substring(0, 200) + '...\n');

  // Demo 2: Security Audit
  console.log('🔒 Demo 2: Security Audit Analysis');
  console.log('==================================');
  
  const securityCode = `
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});`;

  const securityAudit = await trivium.processWithPattern(securityCode, LensPatterns.SECURITY_AUDIT);
  console.log('Security insights:');
  console.log('- Ethical lens:', securityAudit.outputs.ethical.substring(0, 150) + '...');
  console.log('- Survival lens:', securityAudit.outputs.survival.substring(0, 150) + '...\n');

  // Demo 3: Custom lens combination
  console.log('🎨 Demo 3: Custom Lens Combination');
  console.log('==================================');
  
  const customAnalysis = await trivium.processText(
    "Building a user-friendly dashboard for data visualization",
    [LensType.AESTHETIC, LensType.EMOTIONAL, LensType.LOGICAL]
  );
  
  console.log('Custom analysis with 3 lenses:');
  Object.keys(customAnalysis.outputs).forEach(lens => {
    console.log(`- ${lens.toUpperCase()}:`, customAnalysis.outputs[lens].substring(0, 100) + '...');
  });

  // Demo 4: Complete archetypal analysis
  console.log('\n🌟 Demo 4: Complete Archetypal Analysis');
  console.log('=======================================');
  
  const completeAnalysis = await trivium.processWithPattern(
    "Implementing AI-powered customer service chatbot",
    LensPatterns.COMPLETE_ANALYSIS
  );
  
  console.log('All 10 archetypal lenses applied:');
  console.log('Lens count:', completeAnalysis.lensCount);
  console.log('Processing timestamp:', completeAnalysis.timestamp);
  console.log('Sample outputs:');
  Object.keys(completeAnalysis.outputs).slice(0, 3).forEach(lens => {
    console.log(`- ${lens}:`, completeAnalysis.outputs[lens].substring(0, 80) + '...');
  });

  // Demo 5: Synthesis
  console.log('\n🧠 Demo 5: Multi-perspective Synthesis');
  console.log('=====================================');
  
  const synthesis = await trivium.processAndSynthesize(
    "Migrating legacy system to microservices architecture",
    [LensType.LOGICAL, LensType.TEMPORAL, LensType.SURVIVAL],
    0.8
  );
  
  console.log('Synthesis result:');
  console.log(synthesis.synthesis);
  console.log('Blend factor:', synthesis.synthesisBlend);

  // Demo 6: Pattern suggestion
  console.log('\n💡 Demo 6: Intelligent Pattern Suggestion');
  console.log('=========================================');
  
  const contexts = [
    "debugging authentication error",
    "code review pull request",
    "security vulnerability assessment",
    "user experience redesign"
  ];
  
  contexts.forEach(context => {
    const suggested = trivium.getSuggestedPattern(context);
    console.log(`Context: "${context}"`);
    console.log(`Suggested pattern: ${suggested.name} - ${suggested.focus}\n`);
  });

  console.log('✨ Demo completed! The SDK is ready for integration into your workflow.');
}

runDemo().catch(console.error);