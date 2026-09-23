export class VpnConfig {
  static generateWireguardConfig(
    privateKey: string,
    address: string,
    serverPublicKey: string,
    serverEndpoint: string,
    dns: string = '1.1.1.1'
  ): string {
    return `[Interface]
PrivateKey = ${privateKey}
Address = ${address}
DNS = ${dns}

[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${serverEndpoint}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`;
  }

  static parseWireguardConfig(config: string): Record<string, any> {
    const lines = config.split('\n');
    const parsed: Record<string, any> = {
      interface: {},
      peer: {}
    };

    let currentSection = '';
    
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('[')) {
        currentSection = line.toLowerCase().replace(/\[|\]/g, '');
        continue;
      }

      const [key, ...valueParts] = line.split('=');
      if (key && currentSection) {
        const val = valueParts.join('=').trim();
        parsed[currentSection][key.trim()] = val;
      }
    }

    return parsed;
  }
}
