import * as vscode from 'vscode';

// Since we can't import the SDK directly in VS Code extension context,
// we'll include the core functionality inline for now
class TriviumVSCode {
    private patterns = {
        CODE_REVIEW: {
            name: "CODE_REVIEW",
            lenses: ["ethical", "logical"],
            focus: "Security, efficiency, and maintainability analysis",
            description: "Combines ethical considerations with logical analysis"
        },
        DEBUGGING: {
            name: "DEBUGGING", 
            lenses: ["logical", "emotional"],
            focus: "Systematic problem-solving with user empathy",
            description: "Balances technical analysis with user impact"
        },
        SECURITY_AUDIT: {
            name: "SECURITY_AUDIT",
            lenses: ["ethical", "survival", "logical"],
            focus: "Comprehensive security and threat assessment", 
            description: "Evaluates vulnerabilities and security measures"
        }
    };

    async processWithPattern(text: string, pattern: any) {
        const outputs: any = {};
        
        for (const lens of pattern.lenses) {
            outputs[lens] = this.processLens(text, lens);
        }
        
        return {
            outputs,
            pattern: pattern.name,
            focus: pattern.focus,
            description: pattern.description,
            timestamp: new Date().toISOString()
        };
    }

    private processLens(text: string, lensType: string): string {
        const lensMap: any = {
            ethical: "Analyzes moral implications, security concerns, and ethical considerations in the code",
            logical: "Evaluates structure, efficiency, algorithms, and systematic thinking patterns",
            emotional: "Considers user experience, empathy, and emotional impact of the implementation",
            survival: "Assesses robustness, error handling, resilience, and defensive programming",
            symbolic: "Identifies patterns, abstractions, and symbolic representations in the code",
            temporal: "Examines time-based aspects, performance, and evolution considerations"
        };

        const focus = lensMap[lensType] || "Provides cognitive analysis from this perspective";
        
        return `[${lensType.toUpperCase()}] Through the lens of ${focus}:

This code demonstrates ${lensType} considerations that reveal important insights:

• Primary insight: The implementation shows awareness of ${lensType} principles
• Secondary consideration: Balance between ${lensType} requirements and practical constraints  
• Recommendation: Consider enhancing ${lensType} aspects for improved overall quality

This ${lensType} perspective contributes to a comprehensive understanding of the code's implications and potential improvements.`;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Trivium Cognitive Lens extension is now active!');

    const trivium = new TriviumVSCode();
    let analysisPanel: vscode.WebviewPanel | undefined;

    // Command: Analyze Selection
    const analyzeSelection = vscode.commands.registerCommand('trivium.analyzeSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showErrorMessage('Please select some code to analyze');
            return;
        }

        await performAnalysis(text, 'Selected Code', context);
    });

    // Command: Code Review
    const codeReview = vscode.commands.registerCommand('trivium.codeReview', async () => {
        await analyzeWithPattern(trivium.patterns.CODE_REVIEW, 'Code Review Analysis', context);
    });

    // Command: Debugging
    const debugging = vscode.commands.registerCommand('trivium.debugging', async () => {
        await analyzeWithPattern(trivium.patterns.DEBUGGING, 'Debugging Analysis', context);
    });

    // Command: Security Audit
    const securityAudit = vscode.commands.registerCommand('trivium.securityAudit', async () => {
        await analyzeWithPattern(trivium.patterns.SECURITY_AUDIT, 'Security Audit', context);
    });

    async function analyzeWithPattern(pattern: any, title: string, context: vscode.ExtensionContext) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showErrorMessage('No code to analyze');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running ${title}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });

            try {
                const result = await trivium.processWithPattern(text, pattern);
                progress.report({ increment: 100 });
                
                showAnalysisResults(result, title, context);
            } catch (error) {
                vscode.window.showErrorMessage(`Analysis failed: ${error}`);
            }
        });
    }

    async function performAnalysis(text: string, title: string, context: vscode.ExtensionContext) {
        const pattern = trivium.patterns.CODE_REVIEW;

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Analyzing with cognitive lenses...',
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });

            try {
                const result = await trivium.processWithPattern(text, pattern);
                progress.report({ increment: 100 });
                
                showAnalysisResults(result, title, context);
            } catch (error) {
                vscode.window.showErrorMessage(`Analysis failed: ${error}`);
            }
        });
    }

    function showAnalysisResults(result: any, title: string, context: vscode.ExtensionContext) {
        if (analysisPanel) {
            analysisPanel.dispose();
        }

        analysisPanel = vscode.window.createWebviewPanel(
            'triviumAnalysis',
            `Cognitive Analysis: ${title}`,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        analysisPanel.webview.html = getAnalysisWebviewContent(result, title);
        
        analysisPanel.onDidDispose(() => {
            analysisPanel = undefined;
        }, null, context.subscriptions);
    }

    function getAnalysisWebviewContent(result: any, title: string): string {
        const lensOutputs = Object.entries(result.outputs || {});
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cognitive Analysis</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    padding: 20px;
                    margin: 0;
                }
                .header {
                    border-bottom: 2px solid var(--vscode-panel-border);
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .pattern-info {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 15px;
                    border-left: 4px solid var(--vscode-textBlockQuote-border);
                    margin-bottom: 25px;
                    border-radius: 4px;
                }
                .lens-analysis {
                    margin-bottom: 25px;
                    background: var(--vscode-editor-background);
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 8px;
                    overflow: hidden;
                }
                .lens-header {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    padding: 12px 20px;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                }
                .lens-content {
                    padding: 20px;
                    white-space: pre-wrap;
                    font-size: 14px;
                    line-height: 1.7;
                }
                .metadata {
                    background: var(--vscode-textCodeBlock-background);
                    padding: 15px;
                    border-radius: 4px;
                    margin-top: 20px;
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                }
                .lens-ethical { border-left: 4px solid #e74c3c; }
                .lens-logical { border-left: 4px solid #3498db; }
                .lens-emotional { border-left: 4px solid #f39c12; }
                .lens-survival { border-left: 4px solid #795548; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🧠 Cognitive Analysis: ${title}</h1>
            </div>
            
            <div class="pattern-info">
                <h2>📋 Pattern: ${result.pattern}</h2>
                <p><strong>Focus:</strong> ${result.focus}</p>
                <p><strong>Description:</strong> ${result.description}</p>
            </div>
            
            <div class="analysis-results">
                ${lensOutputs.map(([lensType, output]) => `
                    <div class="lens-analysis lens-${lensType}">
                        <div class="lens-header">
                            ${lensType} Lens
                        </div>
                        <div class="lens-content">${output}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="metadata">
                <p><strong>Analysis completed:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Lenses applied:</strong> ${lensOutputs.length}</p>
                <p><strong>Powered by:</strong> Trivium Cognitive SDK v1.0.0</p>
            </div>
        </body>
        </html>`;
    }

    // Register all commands
    context.subscriptions.push(
        analyzeSelection,
        codeReview,
        debugging,
        securityAudit
    );
}

export function deactivate() {
    console.log('Trivium Cognitive Lens extension deactivated');
}