import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';
import rawToolDefinitions from '../../features/tools/configs/toolDefinitions.json';

const THEME = {
  background: '#070f1e', // Mythic Dragon Abyss
  primary: '#00ff66',    // Dragon Emerald Green
  accent: '#00d4ff',     // Dragon Cyan Blue
  surface: '#0d1b2e',    // Dragon Scale Slate
  card: '#11223a',       // Dragon Blue Card
  text: '#ffffff',       // Pure Crisp White
  textMuted: '#8ba8cc',  // Ice Blue Silver
  border: '#163252',
  error: '#ff2247',
};

// Tool database with full details
const TOOL_DB: Record<string, {
  name: string; version: string; category: string; icon: string;
  overview: string; requirements: string[];
  usage: string; flags: { flag: string; desc: string }[];
  examples: { title: string; cmd: string }[];
}> = {
  '1': {
    name: 'NMAP', version: 'v7.93', category: 'NETWORK_SCANNER', icon: 'N',
    overview: 'Nmap (Network Mapper) is a free and open-source utility for network discovery and security auditing. Identifies hosts, services, OS versions and firewalls on a network.',
    requirements: ['Network Access: Required', 'Root: Optional (for SYN stealth scans)'],
    usage: "nmap [Scan Type(s)] [Options] <target>",
    flags: [
      { flag: '-sS', desc: 'TCP SYN scan (stealth)' }, { flag: '-sV', desc: 'Service version detection' },
      { flag: '-p-', desc: 'Scan all 65535 ports' }, { flag: '-A', desc: 'Aggressive (OS + version + script + traceroute)' },
      { flag: '-T4', desc: 'Faster execution timing' }, { flag: '-O', desc: 'OS detection' },
    ],
    examples: [
      { title: 'Ping Sweep', cmd: 'nmap -sn 192.168.1.0/24' },
      { title: 'Full Port + Version', cmd: 'nmap -p- -sV 10.10.10.1' },
      { title: 'Aggressive Scan', cmd: 'nmap -A -T4 target.com' },
    ],
  },
  '2': {
    name: 'NETDISCOVER', version: 'v0.10', category: 'ARP_SCANNER', icon: 'ND',
    overview: 'Netdiscover is an active/passive ARP reconnaissance tool. Used to find live hosts on a local network segment by sending ARP requests. Ideal for DHCP environments and pen-test engagements.',
    requirements: ['Root: Required', 'Network: LAN access required', 'Interface: wlan0 / eth0'],
    usage: 'netdiscover [-i interface] [-r range] [-p]',
    flags: [
      { flag: '-i', desc: 'Network interface (e.g. wlan0, eth0)' }, { flag: '-r', desc: 'IP range to scan (CIDR)' },
      { flag: '-p', desc: 'Passive mode (listen only, no ARP requests)' }, { flag: '-l', desc: 'Read ranges from file' },
      { flag: '-f', desc: 'Fast mode' }, { flag: '-s', desc: 'Sleep time between ARP requests (ms)' },
    ],
    examples: [
      { title: 'Scan Local Subnet', cmd: 'netdiscover -r 192.168.1.0/24' },
      { title: 'Passive Discovery', cmd: 'netdiscover -p -i wlan0' },
      { title: 'Fast Scan on eth0', cmd: 'netdiscover -i eth0 -r 10.0.0.0/16 -f' },
    ],
  },
  '3': {
    name: 'ARP-SCAN', version: 'v1.10.0', category: 'ARP_SCANNER', icon: 'AS',
    overview: 'ARP-Scan sends ARP requests to hosts on the local network and displays responses. It is used for host discovery on local network segments. Faster than Nmap ping sweep for LAN.',
    requirements: ['Root: Required', 'Network: LAN access', 'libpcap: Required'],
    usage: 'arp-scan [options] [target]',
    flags: [
      { flag: '-l', desc: 'Scan local network (auto-detect range)' }, { flag: '-I', desc: 'Set network interface' },
      { flag: '-r', desc: 'Set retry count' }, { flag: '--destaddr', desc: 'Set destination MAC' },
    ],
    examples: [
      { title: 'Local Network Scan', cmd: 'arp-scan -l' },
      { title: 'Specific Interface', cmd: 'arp-scan -I wlan0 -l' },
      { title: 'Target Range', cmd: 'arp-scan 192.168.1.0/24' },
    ],
  },
  '4': {
    name: 'MASSCAN', version: 'v1.3.2', category: 'PORT_SCANNER', icon: 'MS',
    overview: 'Masscan is the fastest Internet port scanner. It can scan the entire Internet in under 5 minutes using asynchronous SYN packets. Similar to Nmap but optimized for speed.',
    requirements: ['Root: Required', 'Network: Required', 'Raw Sockets: Required'],
    usage: 'masscan <target> -p<ports> [options]',
    flags: [
      { flag: '-p', desc: 'Port range(s) to scan' }, { flag: '--rate', desc: 'Packets per second (e.g. 10000)' },
      { flag: '--banners', desc: 'Grab banners from services' }, { flag: '-oJ', desc: 'Output in JSON' },
    ],
    examples: [
      { title: 'Fast Port Scan', cmd: 'masscan 192.168.1.0/24 -p80,443 --rate=10000' },
      { title: 'Full Range', cmd: 'masscan 10.0.0.0/8 -p0-65535 --rate=100000' },
    ],
  },
  '11': {
    name: 'METASPLOIT', version: 'v6.3.4', category: 'EXPLOITATION', icon: 'M',
    overview: 'The Metasploit Framework is the most advanced penetration testing tool. Contains 2315 exploits, 1210 auxiliary modules, 410 post-exploitation modules, and 1385 payloads.',
    requirements: ['Network Access: Required', 'PostgreSQL: Recommended', 'Root: Optional'],
    usage: 'msfconsole / use <module> / set <option> / exploit',
    flags: [
      { flag: 'search', desc: 'Search for exploits by keyword' }, { flag: 'use', desc: 'Select a module' },
      { flag: 'set RHOSTS', desc: 'Set target host' }, { flag: 'set LHOST', desc: 'Set listener IP' },
      { flag: 'exploit', desc: 'Launch the attack' }, { flag: 'sessions', desc: 'List active sessions' },
    ],
    examples: [
      { title: 'EternalBlue (MS17-010)', cmd: 'use exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 10.10.10.1\nexploit' },
      { title: 'Web Delivery', cmd: 'use exploit/multi/script/web_delivery\nset LHOST 10.8.0.4\nrun' },
    ],
  },
  '12': {
    name: 'SQLMAP', version: 'v1.7.12', category: 'SQL_INJECTION', icon: 'SQ',
    overview: 'SQLMap automates the detection and exploitation of SQL injection flaws. Supports MySQL, Oracle, PostgreSQL, MSSQL, SQLite, and more. Can dump entire databases, execute OS commands, and establish out-of-band connections.',
    requirements: ['Python 3: Required', 'Network: Required', 'Target URL with parameter'],
    usage: 'sqlmap -u <URL> [options]',
    flags: [
      { flag: '-u', desc: 'Target URL with injectable parameter' }, { flag: '--dbs', desc: 'Enumerate databases' },
      { flag: '--tables', desc: 'Enumerate tables' }, { flag: '--dump', desc: 'Dump table contents' },
      { flag: '--os-shell', desc: 'Get OS command shell' }, { flag: '--level', desc: 'Injection test level (1-5)' },
      { flag: '--risk', desc: 'Risk of tests (1-3)' }, { flag: '--batch', desc: 'Auto-confirm prompts' },
    ],
    examples: [
      { title: 'Basic Injection Test', cmd: "sqlmap -u 'http://target.com/page?id=1' --dbs" },
      { title: 'Dump Users Table', cmd: "sqlmap -u 'http://target.com/page?id=1' -D mydb -T users --dump" },
      { title: 'OS Shell via SQLi', cmd: "sqlmap -u 'http://target.com/page?id=1' --os-shell" },
    ],
  },
  '13': {
    name: 'HYDRA', version: 'v9.5', category: 'BRUTE_FORCE', icon: 'HY',
    overview: 'Hydra is the fastest network logon cracker. Supports 50+ protocols including SSH, FTP, HTTP, RDP, SMB, MySQL, PostgreSQL, VNC, and more. Can perform dictionary and brute-force attacks.',
    requirements: ['Network: Required', 'Wordlist: Recommended', 'Root: Not required'],
    usage: 'hydra -l <user> -P <wordlist> <target> <protocol>',
    flags: [
      { flag: '-l', desc: 'Login username' }, { flag: '-L', desc: 'Username list file' },
      { flag: '-p', desc: 'Password' }, { flag: '-P', desc: 'Password list file' },
      { flag: '-t', desc: 'Number of parallel tasks' }, { flag: '-s', desc: 'Port number' },
      { flag: '-vV', desc: 'Verbose output' }, { flag: '-f', desc: 'Stop on first valid pair' },
    ],
    examples: [
      { title: 'SSH Brute Force', cmd: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.100' },
      { title: 'HTTP POST Form', cmd: "hydra -l admin -P wordlist.txt 192.168.1.1 http-post-form '/login:user=^USER^&pass=^PASS^:F=incorrect'" },
      { title: 'FTP Attack', cmd: 'hydra -L users.txt -P pass.txt ftp://10.10.10.1 -t 16' },
    ],
  },
  '14': {
    name: 'NIKTO', version: 'v2.5.0', category: 'WEB_SCANNER', icon: 'NK',
    overview: 'Nikto is an open-source web server scanner that tests for 7000+ potentially dangerous files/programs, outdated server versions, and version-specific vulnerabilities. Checks for server configuration issues.',
    requirements: ['Perl: Required', 'Network: Required', 'Root: Not required'],
    usage: 'nikto -h <target> [options]',
    flags: [
      { flag: '-h', desc: 'Target host or URL' }, { flag: '-p', desc: 'Port to scan' },
      { flag: '-ssl', desc: 'Force SSL mode' }, { flag: '-Tuning', desc: 'Scan tuning (1-9)' },
      { flag: '-o', desc: 'Output file' }, { flag: '-Format', desc: 'Output format (csv/json/html)' },
    ],
    examples: [
      { title: 'Basic Web Scan', cmd: 'nikto -h http://192.168.1.100' },
      { title: 'SSL Scan on Port 8443', cmd: 'nikto -h 10.10.10.1 -p 8443 -ssl' },
      { title: 'Full Tuning Scan', cmd: 'nikto -h target.com -Tuning 123456789 -o report.html -Format html' },
    ],
  },
  '19': {
    name: 'GOBUSTER', version: 'v3.6', category: 'DIR_BRUTE', icon: 'GB',
    overview: 'Gobuster is a tool for brute-forcing URIs (directories/files), DNS subdomains, virtual host names, and S3 buckets. Written in Go for maximum concurrency and speed.',
    requirements: ['Go Runtime: Not required (binary)', 'Wordlist: Required', 'Network: Required'],
    usage: 'gobuster dir -u <URL> -w <wordlist> [options]',
    flags: [
      { flag: 'dir', desc: 'Directory/file brute-force mode' }, { flag: 'dns', desc: 'DNS subdomain brute-force' },
      { flag: '-u', desc: 'Target URL' }, { flag: '-w', desc: 'Wordlist path' },
      { flag: '-t', desc: 'Number of threads' }, { flag: '-x', desc: 'File extensions (e.g. php,html,txt)' },
    ],
    examples: [
      { title: 'Directory Scan', cmd: 'gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt' },
      { title: 'With Extensions', cmd: 'gobuster dir -u http://10.10.10.1 -w common.txt -x php,html,txt -t 50' },
    ],
  },
  '23': {
    name: 'AIRCRACK-NG', version: 'v1.7', category: 'WIRELESS', icon: 'AC',
    overview: 'Aircrack-ng is a complete suite of tools for 802.11 wireless network security assessment. Includes monitoring, attacking, testing, and cracking WiFi networks.',
    requirements: ['Root: Required', 'WiFi Adapter: Monitor mode support', 'Wordlist: For WPA/WPA2'],
    usage: 'aircrack-ng [options] <capture_file>',
    flags: [
      { flag: '-w', desc: 'Path to wordlist' }, { flag: '-b', desc: 'Target BSSID (MAC)' },
      { flag: '-a2', desc: 'WPA/WPA2 cracking mode' }, { flag: '-e', desc: 'Target ESSID (name)' },
    ],
    examples: [
      { title: 'Enable Monitor', cmd: 'airmon-ng start wlan0' },
      { title: 'Capture Handshake', cmd: 'airodump-ng wlan0mon -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture' },
      { title: 'Crack WPA2', cmd: 'aircrack-ng -w rockyou.txt -b AA:BB:CC:DD:EE:FF capture-01.cap' },
    ],
  },
  '32': {
    name: 'ETTERCAP', version: 'v0.8.3.1', category: 'MITM_ATTACK', icon: 'ET',
    overview: 'Ettercap is a comprehensive suite for Man-in-the-Middle attacks. Supports ARP spoofing, DNS spoofing, SSL stripping, and live traffic modification. Can intercept passwords on the fly.',
    requirements: ['Root: Required', 'Network: LAN access', 'libpcap: Required'],
    usage: 'ettercap -T -M arp:remote /<target1>// /<target2>//',
    flags: [
      { flag: '-T', desc: 'Text mode interface' }, { flag: '-G', desc: 'GTK graphical interface' },
      { flag: '-M arp', desc: 'ARP poisoning MITM' }, { flag: '-w', desc: 'Write captured data to pcap' },
    ],
    examples: [
      { title: 'ARP Spoof', cmd: 'ettercap -T -M arp:remote /192.168.1.1// /192.168.1.100//' },
      { title: 'DNS Spoof', cmd: 'ettercap -T -M arp -P dns_spoof /192.168.1.1// ///' },
    ],
  },
  '33': {
    name: 'BETTERCAP', version: 'v2.32.0', category: 'MITM_ATTACK', icon: 'BC',
    overview: 'Bettercap is the Swiss Army knife for WiFi, BLE, and Ethernet network recon and MITM attacks. Successor to Ettercap with modern architecture, built-in web UI, and scriptable modules.',
    requirements: ['Root: Required', 'Network: Required', 'Go Runtime: Not required (binary)'],
    usage: 'bettercap -iface <interface>',
    flags: [
      { flag: '-iface', desc: 'Network interface' }, { flag: '-caplet', desc: 'Load a caplet script' },
      { flag: 'net.probe on', desc: 'Start network probing' }, { flag: 'net.sniff on', desc: 'Start packet sniffer' },
      { flag: 'arp.spoof on', desc: 'Start ARP spoofing' }, { flag: 'http.proxy on', desc: 'Start HTTP proxy' },
    ],
    examples: [
      { title: 'Interactive MITM', cmd: 'bettercap -iface wlan0\n> net.probe on\n> arp.spoof on\n> net.sniff on' },
      { title: 'WiFi Deauth', cmd: 'bettercap -iface wlan0mon\n> wifi.recon on\n> wifi.deauth AA:BB:CC:DD:EE:FF' },
    ],
  },
};

// Name-to-ID alias mapping
const TOOL_ALIASES: Record<string, string> = {
  nmap: '1',
  netdiscover: '2',
  'arp-scan': '3',
  arpscan: '3',
  masscan: '4',
  msf: '11',
  metasploit: '11',
  sqlmap: '12',
  hydra: '13',
  nikto: '14',
  gobuster: '19',
  aircrack: '23',
  'aircrack-ng': '23',
  bettercap: '33',
  ettercap: '32',
};

// Fallback and dynamic lookup for all 62 tools
const getToolData = (toolId: string) => {
  const normalized = (toolId || '1').toLowerCase().trim();
  const resolvedId = TOOL_ALIASES[normalized] || normalized;

  if (TOOL_DB[resolvedId]) return { ...TOOL_DB[resolvedId], id: resolvedId };

  // Look up in comprehensive tool definitions
  const def = (rawToolDefinitions as any[]).find(
    (t: any) =>
      t.id.toLowerCase() === normalized ||
      t.id.toLowerCase() === resolvedId ||
      t.name.toLowerCase() === normalized ||
      (t.command && t.command.toLowerCase() === normalized)
  );

  if (def) {
    const flags = (def.parameters || []).map((p: any) => ({
      flag: p.options ? `--${p.name} [${p.options.join('|')}]` : `--${p.name} <${p.type}>`,
      desc: `${p.description}${p.default !== undefined ? ` (Default: ${p.default})` : ''}`,
    }));
    if (flags.length === 0) {
      flags.push({ flag: '-h / --help', desc: 'Display command usage and options' });
      flags.push({ flag: '-v / --verbose', desc: 'Enable detailed output logging' });
    }

    return {
      id: def.id,
      name: def.name.toUpperCase(),
      version: 'v2.4.0',
      category: `${def.category.toUpperCase()}_ENGINE`,
      icon: def.name.slice(0, 2).toUpperCase(),
      overview: def.description,
      requirements: [
        `Network: ${def.requiresNetwork ? 'Active Network Connection Required' : 'Local Host / Standalone'}`,
        `Privileges: ${def.requiresRoot ? 'Root Access Required (UID 0 / sudo)' : 'Standard User (Non-root)'}`,
        `Binary Command: ${def.command}`,
      ],
      usage: `${def.command} [options] <target>`,
      flags,
      examples: [
        { title: `Audit execution with ${def.name}`, cmd: `${def.command} ${def.parameters?.[0] ? `--${def.parameters[0].name} target` : '--help'}` },
        { title: 'Interactive verbosity scan', cmd: `${def.command} -v 192.168.1.1` },
      ],
    };
  }

  return {
    id: normalized,
    name: normalized.toUpperCase(),
    version: 'latest',
    category: 'SECURITY_MODULE',
    icon: normalized.slice(0, 2).toUpperCase() || 'GH',
    overview: `${normalized.toUpperCase()} is configured for penetration testing and vulnerability analysis.`,
    requirements: ['Network: Segment access required', 'Audit: Logged to session history'],
    usage: `${normalized} [flags] <target>`,
    flags: [
      { flag: '-h / --help', desc: 'Display module help and flags' },
      { flag: '-v', desc: 'Enable verbose telemetry output' },
    ],
    examples: [{ title: 'Standard Audit', cmd: `${normalized} --help` }],
  };
};

export const ToolDetailScreen = ({ navigation, route }: any) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const toolId = route?.params?.toolId || '1';
  const tool = getToolData(toolId);

  return (
    <DragonBackground overlayOpacity={0.88}>
      <View style={styles.container}>
        <View style={styles.header}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>{tool.icon}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.toolName}>{tool.name}</Text>
          <Text style={styles.version}>{tool.version}</Text>
          <Text style={styles.category}>{tool.category}</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {['OVERVIEW', 'USAGE', 'EXAMPLES'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'OVERVIEW' && (
          <View>
            <Text style={styles.bodyText}>{tool.overview}</Text>
            <Text style={styles.sectionTitle}>// REQUIREMENTS</Text>
            {tool.requirements.map((req: string, i: number) => (
              <Text key={i} style={styles.bodyText}>• {req}</Text>
            ))}
          </View>
        )}
        
        {activeTab === 'USAGE' && (
          <View>
            <Text style={styles.codeBlock}>{tool.usage}</Text>
            <Text style={styles.sectionTitle}>// FLAGS & OPTIONS</Text>
            {tool.flags.map((f: { flag: string; desc: string }, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cellKey}>{f.flag}</Text>
                <Text style={styles.cellValue}>{f.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'EXAMPLES' && (
          <View>
            {tool.examples.map((ex: { title: string; cmd: string }, i: number) => (
              <View key={i} style={styles.exampleCard}>
                <Text style={styles.exampleDesc}>{ex.title}</Text>
                <Text style={styles.codeBlock}>{ex.cmd}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.launchBtn}
          onPress={() => navigation.navigate('ToolRunner', { tool: tool.id || tool.name.toLowerCase(), autoRun: true })}
        >
          <Text style={styles.launchBtnText}>⚡ INITIALIZE & RUN TOOL</Text>
        </TouchableOpacity>
      </View>
    </View>
  </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: THEME.surface,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: 24,
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  version: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  category: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME.primary,
  },
  tabText: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  activeTabText: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bodyText: {
    color: THEME.text,
    fontFamily: 'monospace',
    lineHeight: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    marginTop: 20,
    marginBottom: 10,
  },
  codeBlock: {
    backgroundColor: '#000',
    color: THEME.primary,
    padding: 10,
    fontFamily: 'monospace',
    borderLeftWidth: 2,
    borderLeftColor: THEME.primary,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cellKey: {
    width: 100,
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  cellValue: {
    flex: 1,
    color: THEME.text,
    fontFamily: 'monospace',
  },
  exampleCard: {
    marginBottom: 20,
  },
  exampleDesc: {
    color: THEME.text,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  launchBtn: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
  },
  launchBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
