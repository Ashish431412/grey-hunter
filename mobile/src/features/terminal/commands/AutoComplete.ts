export class AutoComplete {
  private knownTools: string[] = [
    'nmap', 'masscan', 'netcat', 'hping3', 'nikto', 'sqlmap', 
    'wpscan', 'msfconsole', 'msfvenom', 'burp', 'zap', 'dirb', 
    'gobuster', 'wfuzz', 'ffuf', 'aircrack-ng', 'wifite'
  ];

  private knownPaths: string[] = [
    '/etc/passwd', '/etc/shadow', '/var/log/auth.log',
    '/usr/share/wordlists/rockyou.txt', '/tmp/', '/root/'
  ];

  complete(input: string): string[] {
    const parts = input.split(' ');
    const lastPart = parts[parts.length - 1];

    if (!lastPart) return [];

    // Complete commands/tools
    if (parts.length === 1) {
      return this.knownTools
        .filter(t => t.startsWith(lastPart))
        .map(t => t + ' ');
    }

    // Complete paths (naive implementation)
    if (lastPart.startsWith('/') || lastPart.startsWith('.')) {
      return this.knownPaths
        .filter(p => p.startsWith(lastPart))
        .map(p => {
          const rest = p.substring(lastPart.length);
          return parts.slice(0, -1).join(' ') + ' ' + p;
        });
    }

    return [];
  }
}
