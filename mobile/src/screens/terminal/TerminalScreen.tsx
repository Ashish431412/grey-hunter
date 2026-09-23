import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

// Terminal Theme: RED and WHITE according to prompt (root or root kali)
const THEME = {
  background: '#070203',  // Obsidian shadow with crimson undertone
  primary: '#ffffff',     // Crisp White for text and commands
  promptRed: '#ff2247',   // Fiery Crimson Red for root/kali prompts
  accentWhite: '#f0f4f8', // Soft white
  border: '#3a0c14',      // Dark crimson border
  toolbarBg: '#120508',   // Crimson slate bar
  inputBg: '#0a0204',
};

export const TerminalScreen = () => {
  const [promptMode, setPromptMode] = useState<'kali' | 'root'>('kali');
  const activePrompt = promptMode === 'kali' ? 'root@kali:~# ' : 'root:~# ';

  const [history, setHistory] = useState<Array<{ type: 'output' | 'cmd'; prompt?: string; text: string }>>([
    { type: 'output', text: 'Kali GNU/Linux Rolling 2026.1 (arm64)' },
    { type: 'output', text: 'Dragon Security Environment Initialized.' },
    { type: 'output', text: 'Type "help" for commands or "prompt root" / "prompt kali" to switch prompt.' },
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const togglePrompt = () => {
    setPromptMode(prev => (prev === 'kali' ? 'root' : 'kali'));
  };

  const handleCommand = (overrideCmd?: string) => {
    const raw = typeof overrideCmd === 'string' ? overrideCmd : input;
    const trimmed = raw.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    const newHistory: Array<{ type: 'output' | 'cmd'; prompt?: string; text: string }> = [
      ...history,
      { type: 'cmd', prompt: activePrompt, text: trimmed },
    ];

    const pushOutput = (text: string) => {
      newHistory.push({ type: 'output', text });
    };

    switch (cmd) {
      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'prompt':
        if (arg.toLowerCase().includes('kali')) {
          setPromptMode('kali');
          pushOutput('[+] Terminal prompt set to root@kali:~#');
        } else if (arg.toLowerCase().includes('root')) {
          setPromptMode('root');
          pushOutput('[+] Terminal prompt set to root:~#');
        } else {
          pushOutput('Usage: prompt [kali | root]');
        }
        break;

      case 'help':
        pushOutput(
          'KALI DRAGON TERMINAL [ROOT ENVIRONMENT]\n' +
          'AVAILABLE COMMANDS:\n' +
          '  help                  - Display this help manual\n' +
          '  prompt <kali|root>    - Switch prompt between root@kali & root\n' +
          '  netdiscover [range]   - ARP network discovery for IP/MAC scanning\n' +
          '  arp-scan [-l]         - Fast ARP request scanner for local subnet\n' +
          '  netscan <subnet>      - Quick ICMP/TCP live IP address locator\n' +
          '  nmap <target>         - Network exploration tool & port scanner\n' +
          '  msfconsole            - Metasploit Framework console\n' +
          '  sqlmap -u <url>       - Automated SQL injection auditing tool\n' +
          '  hydra <options>       - Network login brute-force testing engine\n' +
          '  nikto -h <host>       - Web server vulnerability assessment\n' +
          '  gobuster dir <opts>   - Directory and URI brute-forcing\n' +
          '  aircrack-ng <cap>     - 802.11 wireless security suite\n' +
          '  bettercap / ettercap  - MITM & network inspection framework\n' +
          '  whoami                - Display current session user (root)\n' +
          '  uname -a              - Print system and kernel specifications\n' +
          '  ifconfig / ip a       - Network interface configuration\n' +
          '  ping <host>           - Send ICMP ECHO_REQUEST packets\n' +
          '  tools                 - Enumerate all 40 registered tools\n' +
          '  vpn status            - Query WireGuard encrypted tunnel\n' +
          '  ls [dir]              - List directory contents\n' +
          '  cat <file>            - Display file contents\n' +
          '  clear                 - Clear terminal window'
        );
        break;

      case 'whoami':
        pushOutput('root');
        break;

      case 'uname':
        pushOutput('Linux kali-dragon 5.4.0-arm64 #1 SMP PREEMPT Kali GNU/Linux Rolling 2026.1');
        break;

      case 'ifconfig':
      case 'ip':
        pushOutput(
          'wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500\n' +
          '        inet 192.168.1.142  netmask 255.255.255.0  broadcast 192.168.1.255\n' +
          'tun0 (WireGuard): flags=4305<UP,POINTOPOINT,RUNNING,NOARP> mtu 1420\n' +
          '        inet 10.8.0.4  netmask 255.255.255.0  destination 10.8.0.4'
        );
        break;

      case 'netdiscover':
        const netRange = arg || '192.168.1.0/24';
        pushOutput(
          ` Currently scanning: ${netRange}   |   Screen View: Unique Hosts\n` +
          ' 4 Captured ARP req/rep packets, from 4 hosts. Total size: 240\n' +
          ' _____________________________________________________________________________\n' +
          '   IP            At MAC Address     Count     Len  MAC Vendor / Hostname\n' +
          ' -----------------------------------------------------------------------------\n' +
          ' 192.168.1.1     a4:91:b1:cd:20:11      1      60  TP-Link Technologies CO.\n' +
          ' 192.168.1.100   08:00:27:bc:31:0a      1      60  CAD/CAM Solution Host\n' +
          ' 192.168.1.105   dc:a6:32:89:44:fe      1      60  Raspberry Pi Foundation\n' +
          ' 192.168.1.142   b8:27:eb:12:34:56      1      60  Samsung Electronics (This Device)\n' +
          ' -- Scan complete. 4 live nodes discovered.'
        );
        break;

      case 'arp-scan':
        pushOutput(
          'Interface: wlan0, type: EN10MB, MAC: b8:27:eb:12:34:56, IPv4: 192.168.1.142\n' +
          'Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)\n' +
          '192.168.1.1\ta4:91:b1:cd:20:11\tTP-Link Technologies\n' +
          '192.168.1.100\t08:00:27:bc:31:0a\tPCS Systemtechnik GmbH\n' +
          '192.168.1.105\tdc:a6:32:89:44:fe\tRaspberry Pi Trading Ltd\n' +
          '192.168.1.254\t00:50:56:fd:aa:12\tVMware, Inc.\n' +
          '4 packets received by filter, 0 packets dropped by kernel\n' +
          'Ending arp-scan: 256 hosts scanned in 1.412 seconds (181.30 hosts/sec). 4 responded'
        );
        break;

      case 'netscan':
      case 'scan':
        const subnet = arg || '192.168.1.0/24';
        pushOutput(
          `[+] Initializing Fast NetScanner across ${subnet}...\n` +
          '[+] Sending ARP probes & ICMP echo requests:\n' +
          '  [UP]  192.168.1.1     [Gateway / Router]        Latency: 1.2ms\n' +
          '  [UP]  192.168.1.100   [Workstation - Port 445]  Latency: 3.4ms\n' +
          '  [UP]  192.168.1.105   [IoT Device - SSH]        Latency: 2.1ms\n' +
          '  [UP]  192.168.1.142   [Local Host (Android)]    Latency: 0.1ms\n' +
          '  [UP]  192.168.1.254   [Virtual Switch]          Latency: 1.8ms\n' +
          `[✓] Scan finished: 5 active IP addresses found in 0.89s`
        );
        break;

      case 'nmap':
        const target = arg || '192.168.1.1';
        pushOutput(
          `Starting Nmap 7.93 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}\n` +
          `Nmap scan report for ${target}\n` +
          'Host is up (0.0018s latency).\n' +
          'PORT     STATE SERVICE     VERSION\n' +
          '22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu\n' +
          '80/tcp   open  http        Apache httpd 2.4.52\n' +
          '443/tcp  open  ssl/https   Apache httpd 2.4.52\n' +
          '8080/tcp open  http-proxy  Node.js Express\n' +
          `Nmap done: 1 IP address (1 host up) scanned in 1.28 seconds`
        );
        break;

      case 'msfconsole':
      case 'metasploit':
        pushOutput(
          '  [ Metasploit Framework v6.3.4-dev ]\n' +
          '  + -- --=[ 2315 exploits - 1210 auxiliary - 410 post       ]=\n' +
          '  + -- --=[ 1385 payloads - 46 encoders - 11 nops           ]=\n' +
          'msf6 > Ready for exploit selection. Use Tool Runner screen for visual configuration.'
        );
        break;

      case 'sqlmap':
        const sqlTarget = arg || 'http://target.lab/vuln.php?id=1';
        pushOutput(
          '        ___ \n' +
          '       __H__\n' +
          ' ___ ___["]_____ ___ ___  {1.7.12#stable}\n' +
          '|_ -| . [)]     | .\'| . |\n' +
          '|___|_  ["]_|_|_|__,|  _|\n' +
          '      |_|V...       |_|   https://sqlmap.org\n\n' +
          `[*] testing connection to the target URL: ${sqlTarget}\n` +
          '[*] heuristic test shows that GET parameter \'id\' is injectable (DBMS: MySQL)\n' +
          'sqlmap identified the following injection point(s):\n' +
          'Parameter: id (GET) -> boolean-based blind\n' +
          '[*] back-end DBMS: MySQL >= 5.0.12\n' +
          'available databases [2]: [*] information_schema, [*] greyhunter_lab'
        );
        break;

      case 'hydra':
        const hydraTarget = arg || 'ssh://192.168.1.100';
        pushOutput(
          'Hydra v9.5 (c) 2023 by van Hauser / THC - Legal disclaimer: Ethical testing only\n' +
          `[*] Hydra starting logon assault on ${hydraTarget} with 16 parallel tasks\n` +
          '[ATTEMPT] user: "admin", pass: "password" -> failed\n' +
          '[ATTEMPT] user: "admin", pass: "123456"   -> failed\n' +
          `[22][ssh] host: 192.168.1.100   login: admin   password: shadowhunter\n` +
          '1 of 1 target completed, 1 valid password found in 2.3 seconds.'
        );
        break;

      case 'nikto':
        const niktoHost = arg || 'http://192.168.1.1';
        pushOutput(
          `- Nikto v2.5.0\n` +
          `+ Target IP:          ${niktoHost.replace('http://', '')}\n` +
          `+ Target Port:        80\n` +
          `+ Server: Apache/2.4.52 (Unix) OpenSSL/1.1.1m\n` +
          `+ /admin/: Admin directory found with directory indexing enabled.\n` +
          `+ /robots.txt: Contains 2 disallowed entries that should be reviewed.\n` +
          `+ 1 host(s) tested. Scan completed with 3 informational findings.`
        );
        break;

      case 'gobuster':
        pushOutput(
          '===============================================================\n' +
          'Gobuster v3.6 - Written by OJ Reeves (@TheColonial)\n' +
          '===============================================================\n' +
          '[+] Url:                     http://192.168.1.100\n' +
          '/admin                (Status: 301) [Size: 312]\n' +
          '/api                  (Status: 200) [Size: 1442]\n' +
          '/login                (Status: 200) [Size: 2841]\n' +
          '===============================================================\n' +
          'Finished scanning 4614 paths in 3.12s'
        );
        break;

      case 'aircrack-ng':
      case 'aircrack':
        pushOutput(
          '                               Aircrack-ng 1.7 \n\n' +
          '                 [00:00:04] 15423 keys tested (3855.75 k/s)\n\n' +
          '   KEY FOUND! [ hunter99 ]\n' +
          '      Master Key     : 4B 8A C1 20 89 31 E4 5A 89 22 10 44 FF 98 AB 12'
        );
        break;

      case 'bettercap':
      case 'ettercap':
        pushOutput(
          'bettercap v2.32.0 (built for linux/arm64 with go1.21)\n' +
          '[sys.log] [inf] wlan0: starting network discovery & ARP monitor\n' +
          '[endpoint.new] 192.168.1.1 : a4:91:b1:cd:20:11 (TP-Link Technologies)\n' +
          '[net.sniff] packet sniffer active on wlan0 (promiscuous mode enabled)'
        );
        break;

      case 'ping':
        const host = arg || '8.8.8.8';
        pushOutput(
          `PING ${host} (${host}) 56(84) bytes of data.\n` +
          `64 bytes from ${host}: icmp_seq=1 ttl=117 time=14.2 ms\n` +
          `64 bytes from ${host}: icmp_seq=2 ttl=117 time=13.8 ms\n` +
          `--- ${host} ping statistics ---\n` +
          `2 packets transmitted, 2 received, 0% packet loss, rtt avg 14.0 ms`
        );
        break;

      case 'tools':
        pushOutput(
          'GREY HUNTER ARSENAL (40 TOOLS REGISTERED):\n' +
          ' [RECON]          Nmap, Masscan, Amass, Sublist3r, DNSenum, TheHarvester\n' +
          ' [NETWORK]        Netdiscover, ARP-Scan, Angry IP, Masscan\n' +
          ' [VULN SCAN]      Nikto, OpenVAS, Nuclei, Wapiti, OWASP ZAP\n' +
          ' [ATTACK/EXPLOIT] Metasploit, SQLMap, Hydra, Commix, BeEF, SET\n' +
          ' [WIRELESS]       Aircrack-ng, Wifite, Kismet, Reaver\n' +
          ' [SNIFFING]       Wireshark, Tcpdump, Ettercap, Bettercap, MITMproxy\n' +
          ' [PASSWORD]       Hydra, John the Ripper, Hashcat, Medusa, Crunch\n' +
          ' [WEB APP]        Burp Suite, Gobuster, Dirb, Wfuzz\n' +
          ' [FORENSICS]      Volatility, Autopsy, Binwalk, LinPEAS, Mimikatz'
        );
        break;

      case 'vpn':
        pushOutput(
          'WIREGUARD VPN PROTOCOL [ACTIVE]\n' +
          '  Endpoint:   vpn.greyhunter.lab:51820\n' +
          '  Assigned IP: 10.8.0.4/24\n' +
          '  Encryption:  ChaCha20-Poly1305 with Curve25519 ECDH\n' +
          '  DNS:         10.8.0.1 (Zero-Leak Mode)'
        );
        break;

      case 'ls':
        pushOutput(
          'drwx------ 2 root root 4096 /root\n' +
          'drwxr-xr-x 8 root root 4096 /opt/tools\n' +
          'drwxr-xr-x 2 root root 4096 /etc/wireguard\n' +
          'drwxr-xr-x 4 root root 4096 /labs/exercises\n' +
          '-rw-r--r-- 1 root root 1024 rules_of_engagement.txt\n' +
          '-rw-r--r-- 1 root root  256 vault_key.enc'
        );
        break;

      case 'cat':
        if (arg.includes('rules')) {
          pushOutput(
            'RULES OF ENGAGEMENT:\n' +
            '1. Only authorized targets in lab environments.\n' +
            '2. Adhere strictly to ethical hacking guidelines.\n' +
            '3. All operations logged to local encrypted audit trail.'
          );
        } else {
          pushOutput(`[FILE: ${arg || 'file'}]\nStatus: Encrypted with AES-256-GCM. Biometric gate required.`);
        }
        break;

      default:
        pushOutput(`zsh: command not found: ${cmd}. Type 'help' for available commands.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Red & White Terminal Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.promptToggleBtn} onPress={togglePrompt}>
          <Text style={styles.promptToggleBadge}>PROMPT:</Text>
          <Text style={styles.promptToggleText}>[{promptMode === 'kali' ? 'root@kali' : 'root'}]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => setHistory([])}>
          <Text style={styles.toolBtnText}>CLEAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => handleCommand('help')}>
          <Text style={styles.toolBtnText}>HELP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolBtn, styles.execBtn]} onPress={() => handleCommand()}>
          <Text style={styles.execBtnText}>EXEC ↵</Text>
        </TouchableOpacity>
      </View>

      {/* Terminal Output Area with Red Prompts & White Text */}
      <ScrollView 
        style={styles.terminalArea}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
      >
        {history.map((item, index) => {
          if (item.type === 'cmd') {
            return (
              <View key={index} style={styles.cmdRow}>
                <Text style={styles.promptRed}>{item.prompt}</Text>
                <Text style={styles.cmdWhite}>{item.text}</Text>
              </View>
            );
          }
          return (
            <Text key={index} style={styles.outputLine}>
              {item.text}
            </Text>
          );
        })}
      </ScrollView>

      {/* Input Area: Red Prompt + Pure White Input */}
      <View style={styles.inputArea}>
        <Text style={styles.activePromptText}>{activePrompt}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleCommand()}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          cursorColor={THEME.promptRed}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: THEME.toolbarBg,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    alignItems: 'center',
  },
  promptToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: THEME.promptRed,
    backgroundColor: 'rgba(255, 34, 71, 0.12)',
    marginRight: 8,
  },
  promptToggleBadge: {
    color: THEME.promptRed,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 4,
  },
  promptToggleText: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  toolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#331018',
    marginRight: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  execBtn: {
    borderColor: THEME.promptRed,
    backgroundColor: 'rgba(255, 34, 71, 0.16)',
  },
  toolBtnText: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 11,
  },
  execBtnText: {
    color: THEME.promptRed,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  terminalArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: THEME.background,
  },
  cmdRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 2,
  },
  promptRed: {
    color: THEME.promptRed,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cmdWhite: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
  outputLine: {
    color: THEME.primary, // Pure White
    fontFamily: 'monospace',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 3,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: THEME.inputBg,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  activePromptText: {
    color: THEME.promptRed,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 13,
    padding: 0,
  },
});
