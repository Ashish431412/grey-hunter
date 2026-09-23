export class DocEngine {
  private static markdownCache: Map<string, string> = new Map();

  static parse(markdown: string): string {
    // A simplified markdown parser for illustration
    let parsed = markdown;
    
    // Headers
    parsed = parsed.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    parsed = parsed.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    
    // Code blocks
    parsed = parsed.replace(/```([\s\S]*?)```/gm, '<pre><code>$1</code></pre>');
    
    // Bold and Italic
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists
    parsed = parsed.replace(/^\* (.*$)/gim, '<li>$1</li>');
    
    return `<div class="markdown-body">${parsed}</div>`;
  }

  static async loadDoc(docId: string): Promise<string> {
    if (this.markdownCache.has(docId)) {
      return this.markdownCache.get(docId)!;
    }

    try {
      // In reality, this would fetch from a local SQLite DB or File System
      const content = `Mock content for ${docId}`;
      this.markdownCache.set(docId, content);
      return content;
    } catch (error) {
      console.error(`Failed to load doc: ${docId}`, error);
      throw error;
    }
  }

  static renderHtml(docId: string, content: string): string {
    const htmlContent = this.parse(content);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: monospace; background: #0B0C10; color: #C5C6C7; padding: 16px; }
          h1, h2, h3 { color: #66FCF1; }
          pre { background: #000; padding: 10px; border-left: 3px solid #00FF41; overflow-x: auto; }
          code { color: #00FF41; }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `;
  }
}
