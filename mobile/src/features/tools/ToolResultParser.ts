import { NmapWrapper } from './wrappers/NmapWrapper';

export class ToolResultParser {
  static parseNmapXml(xmlContent: string): any {
    // In a real implementation we would use an XML parser library
    // This is a stubbed parser for nmap output
    const hosts = [];
    const hostRegex = /<host.*?>(.*?)<\/host>/gs;
    let match;
    
    while ((match = hostRegex.exec(xmlContent)) !== null) {
      hosts.push({ raw: match[1] });
    }
    
    return { hosts };
  }

  static parseJson(jsonStr: string): any {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return { error: 'Invalid JSON', raw: jsonStr };
    }
  }

  static parseCsv(csvStr: string): any[] {
    const lines = csvStr.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      return obj;
    });
  }
}
