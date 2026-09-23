export interface DocCommand {
  cmd: string;
  desc: string;
  exampleOutput?: string;
}

export interface DocFlag {
  flag: string;
  syntax: string;
  desc: string;
}

export interface ToolDoc {
  id: string;
  name: string;
  title: string;
  category: 'NETWORK' | 'WEB' | 'PASSWORD' | 'WIRELESS' | 'REFERENCE';
  badge: string;
  readTime: string;
  oneLiner: string;
  overview: string;
  whyUse: string;
  howItWorks: string;
  flags: DocFlag[];
  commands: DocCommand[];
  defenseTips: string;
  relatedToolId?: string;
}

export const TOOL_DOCS: ToolDoc[] = [
  {
    id: 'nmap',
    name: 'Nmap',
    title: 'Nmap // Network Mapper',
    category: 'NETWORK',
    badge: 'PORT_SCANNER',
    readTime: '4 min read',
    oneLiner: 'Discover live hosts, open ports, running services, and operating systems on any network.',
    overview:
      'Nmap (Network Mapper) is the global standard tool for network inventory and security auditing. It acts like a digital inspector that knocks on all doors (ports) of a computer or server to see which ones are open and what software is listening inside.',
    whyUse:
      'Security professionals use Nmap to audit their own networks, locate unauthorized servers or rogue devices, verify firewall rules, and identify outdated software versions before attackers can find them.',
    howItWorks:
      'Nmap sends customized network packets (like TCP SYN, UDP, or ICMP echo) to a target IP address. By analyzing the tiny differences in how the target responds (or drops the packet), Nmap accurately identifies the operating system, open ports, and service banners.',
    flags: [
      { flag: '-sS', syntax: 'nmap -sS <target>', desc: 'TCP SYN Stealth Scan. Sends SYN without completing the 3-way handshake; fast and quiet.' },
      { flag: '-sV', syntax: 'nmap -sV <target>', desc: 'Version Detection. Interrogates open ports to determine exact application versions.' },
      { flag: '-p', syntax: 'nmap -p 80,443 <target>', desc: 'Port Specification. Restricts scan to designated ports or ranges (-p 1-65535).' },
      { flag: '-A', syntax: 'nmap -A <target>', desc: 'Aggressive Mode. Enables OS detection, service versioning, traceroute, and default scripts.' },
      { flag: '-T4', syntax: 'nmap -T4 <target>', desc: 'Timing Template. Speeds up scan timing for reliable modern high-speed networks.' },
    ],
    commands: [
      {
        cmd: 'nmap -sS -T4 -p 22,80,443 192.168.1.1',
        desc: 'Scan essential web & remote management ports quickly on a router/gateway.',
        exampleOutput: 'PORT    STATE SERVICE\n22/tcp  open  ssh\n80/tcp  open  http\n443/tcp open  https',
      },
      {
        cmd: 'nmap -sV -p 80 192.168.1.100',
        desc: 'Identify the exact web server and version running on port 80.',
        exampleOutput: 'PORT   STATE SERVICE VERSION\n80/tcp open  http    Apache httpd 2.4.52 ((Ubuntu))',
      },
      {
        cmd: 'nmap -sn 192.168.1.0/24',
        desc: 'Ping sweep an entire subnet to find all online IP addresses without port scanning.',
        exampleOutput: 'Nmap scan report for 192.168.1.1 (Host is up)\nNmap scan report for 192.168.1.100 (Host is up)\n-- 2 hosts active.',
      },
    ],
    defenseTips:
      'To defend against unauthorized port scanning, configure host firewalls (like iptables or UFW) to drop unexpected SYN packets, close unused ports, and deploy an Intrusion Detection System (IDS like Suricata or Snort) to detect rapid port sweeps.',
    relatedToolId: '1',
  },
  {
    id: 'netdiscover',
    name: 'Netdiscover',
    title: 'Netdiscover // Live ARP Reconnaissance',
    category: 'NETWORK',
    badge: 'IP_DISCOVERY',
    readTime: '3 min read',
    oneLiner: 'Fast active and passive ARP scanner to discover all live IP addresses, MAC addresses, and hardware vendors on local Wi-Fi or LAN.',
    overview:
      'Netdiscover is a lightweight, high-speed network reconnaissance scanner designed specifically for wireless networks and local subnets without DHCP. It finds all connected devices even if they have firewalls configured to block standard ICMP ping requests.',
    whyUse:
      'When you connect to a new Wi-Fi network or switch during an authorized security assessment, your first step is discovering which IP addresses exist. Netdiscover answers "Who is on this network right now?" within seconds.',
    howItWorks:
      'Netdiscover uses the Address Resolution Protocol (ARP). Because all devices on a local subnet MUST respond to ARP queries in order to communicate over Ethernet or Wi-Fi, host firewalls cannot silence ARP replies. Netdiscover broadcasts "Who has IP X?" and catalogs every replying device along with its MAC vendor (e.g., Apple, TP-Link, Samsung).',
    flags: [
      { flag: '-r', syntax: 'netdiscover -r <range>', desc: 'Subnet Range. Specifies the IP range to scan (e.g., -r 192.168.1.0/24 or 10.0.0.0/16).' },
      { flag: '-i', syntax: 'netdiscover -i <iface>', desc: 'Interface. Designates the network interface to use (e.g., -i wlan0 or eth0).' },
      { flag: '-p', syntax: 'netdiscover -p', desc: 'Passive Mode. Sniffs traffic silently without transmitting any packets to stay stealthy.' },
      { flag: '-c', syntax: 'netdiscover -c <count>', desc: 'Count. Number of times to probe each IP before completing the scan.' },
    ],
    commands: [
      {
        cmd: 'netdiscover -i wlan0 -r 192.168.1.0/24',
        desc: 'Scan the local Wi-Fi subnet actively to find all connected phones, computers, and routers.',
        exampleOutput: 'IP            MAC Address       Count  MAC Vendor / Hostname\n192.168.1.1   a4:91:b1:cd:20:11     1  TP-Link Technologies\n192.168.1.100 08:00:27:bc:31:0a     1  CAD/CAM Solution Host\n192.168.1.142 b8:27:eb:12:34:56     1  Samsung Electronics',
      },
      {
        cmd: 'netdiscover -p',
        desc: 'Run in passive stealth mode without generating any outgoing packets.',
        exampleOutput: '[*] Listening passively on wlan0...\n[+] Captured broadcast from 192.168.1.1 (Gateway)',
      },
    ],
    defenseTips:
      'Implement Dynamic ARP Inspection (DAI) and 802.1X Network Access Control (NAC) on managed switches to prevent rogue machines from scanning or poisoning ARP tables.',
    relatedToolId: '2',
  },
  {
    id: 'arp-scan',
    name: 'ARP-Scan',
    title: 'ARP-Scan // Layer 2 LAN Scanner',
    category: 'NETWORK',
    badge: 'MAC_FINDER',
    readTime: '3 min read',
    oneLiner: 'Send custom raw ARP packets to discover all Ethernet and Wi-Fi hosts on your local subnet.',
    overview:
      'ARP-Scan is a command-line tool that uses raw Ethernet sockets to transmit ARP packets to every possible IP address on the local network. It is lightning-fast, highly scriptable, and provides instant MAC address vendor lookups.',
    whyUse:
      'Used during network troubleshooting, asset inventory, and security checks to quickly detect duplicate IP address conflicts and find hidden IoT or embedded hardware devices.',
    howItWorks:
      'It sends ARP request packets directly at the Data Link layer (OSI Layer 2). As soon as target machines respond, ARP-Scan displays the IP address, the 48-bit MAC address, and matches the Organizationally Unique Identifier (OUI) against its vendor database.',
    flags: [
      { flag: '-l', syntax: 'arp-scan -l', desc: 'Local Network. Automatically scans the subnet assigned to your current active interface.' },
      { flag: '-I', syntax: 'arp-scan -I <iface>', desc: 'Interface. Specifies which physical or wireless network card to use.' },
      { flag: '--retry', syntax: 'arp-scan --retry=3', desc: 'Retry Count. Sets how many times to re-send packets to uncooperative devices.' },
      { flag: '-q', syntax: 'arp-scan -q', desc: 'Quiet Mode. Only displays responding hosts without header or summary metadata.' },
    ],
    commands: [
      {
        cmd: 'arp-scan -l',
        desc: 'Instantly scan your current local network for all connected hosts.',
        exampleOutput: 'Interface: wlan0, IPv4: 192.168.1.142\n192.168.1.1     a4:91:b1:cd:20:11   TP-Link Technologies\n192.168.1.100   08:00:27:bc:31:0a   PCS Systemtechnik GmbH\n4 responded in 1.2s.',
      },
      {
        cmd: 'arp-scan 192.168.1.0/24 --retry=2',
        desc: 'Scan a specific CIDR range with 2 retries for improved reliability on busy Wi-Fi.',
        exampleOutput: 'Starting arp-scan with 256 hosts...\n4 packets received by filter.',
      },
    ],
    defenseTips:
      'Isolate untrusted client devices using client isolation (AP Isolation) on Wi-Fi access points so clients cannot broadcast ARP queries or sniff packets from peer devices.',
    relatedToolId: '2',
  },
  {
    id: 'netscan',
    name: 'NetScanner',
    title: 'NetScanner // Rapid IP Range Sweeper',
    category: 'NETWORK',
    badge: 'PING_SWEEP',
    readTime: '2 min read',
    oneLiner: 'Ultra-fast multi-threaded ICMP and TCP probe scanner to identify reachable IP addresses and latency.',
    overview:
      'NetScanner provides rapid live host verification across large IP ranges (such as /24 or /16 subnets). It tests multiple protocols simultaneously to determine which IP addresses are online, responsive, and their round-trip latency.',
    whyUse:
      'Ideal when you need to confirm whether an entire range of servers is up without waiting for slow, exhaustive port scans.',
    howItWorks:
      'It fires lightweight concurrent ICMP echo requests and TCP SYN probes to common ports (80, 443, 22) in parallel. When a target responds, NetScanner measures latency and logs the active IP.',
    flags: [
      { flag: '--subnet', syntax: 'netscan <subnet>', desc: 'Specifies the CIDR block to scan (e.g., 192.168.1.0/24).' },
      { flag: '--timeout', syntax: 'netscan -t 500', desc: 'Sets socket timeout in milliseconds per host probe.' },
      { flag: '--threads', syntax: 'netscan -j 50', desc: 'Sets concurrency level for high-speed network sweeps.' },
    ],
    commands: [
      {
        cmd: 'netscan 192.168.1.0/24',
        desc: 'Scan the entire Class C subnet and report all live nodes with round-trip latency.',
        exampleOutput: '[+] 192.168.1.1   [Gateway]  1.2ms\n[+] 192.168.1.100 [Server]   3.4ms\n[✓] 5 active IP addresses found in 0.89s.',
      },
    ],
    defenseTips:
      'Configure perimeter firewalls to rate-limit ICMP traffic and block unauthorized internal subnet routing.',
    relatedToolId: '1',
  },
  {
    id: 'sqlmap',
    name: 'SQLMap',
    title: 'SQLMap // Automatic SQL Injection Engine',
    category: 'WEB',
    badge: 'DB_AUDIT',
    readTime: '5 min read',
    oneLiner: 'Automate the detection and exploitation of SQL injection flaws and database management system enumeration.',
    overview:
      'SQLMap is the undisputed powerhouse for database security audits. It tests web application parameters, forms, and headers to discover SQL injection vulnerabilities and provides automated tools to inspect database contents.',
    whyUse:
      'Developers and penetration testers use SQLMap to verify that web applications properly sanitize all user input and that parameterized queries are strictly enforced.',
    howItWorks:
      'SQLMap sends carefully designed SQL payloads (Boolean-based blind, error-based, UNION query-based, stacked queries, and time-based blind) into HTTP GET/POST parameters. It evaluates how the application server responds to infer the database structure, tables, and columns.',
    flags: [
      { flag: '-u', syntax: 'sqlmap -u "<url>"', desc: 'Target URL. The web address and parameter to test (e.g. -u "http://site.com/item?id=1").' },
      { flag: '--dbs', syntax: 'sqlmap -u "<url>" --dbs', desc: 'Enumerate Databases. Lists all database schemas available to the current user.' },
      { flag: '--tables', syntax: 'sqlmap -u "<url>" -D <db> --tables', desc: 'Enumerate Tables. Lists all tables inside a specific database.' },
      { flag: '--batch', syntax: 'sqlmap -u "<url>" --batch', desc: 'Non-Interactive. Automatically chooses default answers for automated runs.' },
      { flag: '--level', syntax: 'sqlmap -u "<url>" --level=3', desc: 'Tests deeper inputs including HTTP cookies and User-Agent headers (1-5).' },
    ],
    commands: [
      {
        cmd: 'sqlmap -u "http://testphp.vulnweb.com/artists.php?artist=1" --dbs',
        desc: 'Check if the parameter "artist" is vulnerable and list accessible database schemas.',
        exampleOutput: '[*] testing connection to the target URL\n[+] GET parameter \'artist\' is vulnerable.\n[*] available databases [2]:\n[*] acuart\n[*] information_schema',
      },
      {
        cmd: 'sqlmap -u "http://testphp.vulnweb.com/artists.php?artist=1" -D acuart --tables',
        desc: 'Extract table names from the vulnerable "acuart" database.',
        exampleOutput: 'Database: acuart\n[8 tables]\n+-----------+\n| artists   |\n| carts     |\n| users     |\n+-----------+',
      },
    ],
    defenseTips:
      'ALWAYS use Parameterized Queries (Prepared Statements) or Object-Relational Mapping (ORM) frameworks with parameter binding. Never concatenate user input directly into SQL strings. Apply the Principle of Least Privilege to database connection accounts.',
    relatedToolId: '12',
  },
  {
    id: 'hydra',
    name: 'THC-Hydra',
    title: 'Hydra // High-Speed Network Login Auditor',
    category: 'PASSWORD',
    badge: 'BRUTE_FORCE',
    readTime: '4 min read',
    oneLiner: 'Fast multi-threaded network logon cracker supporting SSH, FTP, HTTP, RDP, MySQL, and 50+ protocols.',
    overview:
      'Hydra is a lightning-fast network login auditor designed to test whether user accounts have weak, default, or easily guessable passwords across remote network services.',
    whyUse:
      'Used by systems administrators and ethical hackers to verify password complexity policies and ensure default factory credentials (such as admin/admin) have been changed on production services.',
    howItWorks:
      'Hydra opens multiple parallel TCP connections to the target service (e.g. SSH on port 22 or FTP on port 21), attempting credential combinations from supplied username and password lists until valid credentials are discovered.',
    flags: [
      { flag: '-l / -L', syntax: 'hydra -l <user> OR -L <userlist>', desc: 'Username. Single username (-l admin) or list of usernames (-L users.txt).' },
      { flag: '-p / -P', syntax: 'hydra -p <pass> OR -P <passlist>', desc: 'Password. Single password (-p secret) or wordlist (-P rockyou.txt).' },
      { flag: '-t', syntax: 'hydra -t 4', desc: 'Tasks/Threads. Number of parallel connection threads (default 16; lower for SSH to prevent lockouts).' },
      { flag: '-V', syntax: 'hydra -V', desc: 'Verbose. Shows each login attempt in real time.' },
    ],
    commands: [
      {
        cmd: 'hydra -l admin -P wordlist.txt 192.168.1.100 ssh -t 4',
        desc: 'Audit the SSH server on 192.168.1.100 with a dictionary list of common passwords.',
        exampleOutput: '[DATA] max 4 tasks per target\n[ATTEMPT] target 192.168.1.100 - login "admin" - pass "123456"\n[22][ssh] host: 192.168.1.100   login: admin   password: Password123\n1 of 1 target successfully completed',
      },
      {
        cmd: 'hydra -L users.txt -P wordlist.txt 192.168.1.1 ftp',
        desc: 'Audit the router FTP service for default credentials across multiple user accounts.',
        exampleOutput: '[21][ftp] host: 192.168.1.1   login: root   password: toor',
      },
    ],
    defenseTips:
      'Enforce strong multi-factor authentication (MFA). Disable password authentication for SSH in favor of Ed25519 public keys. Implement account lockout policies and IP-based rate limiting using tools like Fail2ban.',
    relatedToolId: '13',
  },
  {
    id: 'nikto',
    name: 'Nikto',
    title: 'Nikto // Web Server Security Scanner',
    category: 'WEB',
    badge: 'WEB_VULN',
    readTime: '3 min read',
    oneLiner: 'Comprehensive web server scanner that detects dangerous files, outdated server software, and critical misconfigurations.',
    overview:
      'Nikto is an open-source web server scanner that tests web servers for over 7,000 potentially dangerous files and CGIs, checks for outdated server components, and inspects HTTP headers for security best practices.',
    whyUse:
      'Ideal for quickly finding forgotten backup files (like config.php.bak), default administration panels, exposed .git directories, and missing HTTP security headers.',
    howItWorks:
      'Nikto performs rapid HTTP requests against a comprehensive database of known dangerous files, default scripts, and configuration errors. It analyzes the HTTP status codes, server headers, and body content returned by the web server.',
    flags: [
      { flag: '-h', syntax: 'nikto -h <target>', desc: 'Host. Target web server IP, domain name, or URL.' },
      { flag: '-p', syntax: 'nikto -h <target> -p <port>', desc: 'Port. Custom port number (e.g. 8080, 8443).' },
      { flag: '-ssl', syntax: 'nikto -h <target> -ssl', desc: 'SSL Mode. Forces HTTPS communication.' },
      { flag: '-Tuning', syntax: 'nikto -h <target> -Tuning 1', desc: 'Scan Tuning. Restricts scan to specific vulnerability categories (e.g., interesting files).' },
    ],
    commands: [
      {
        cmd: 'nikto -h http://192.168.1.100',
        desc: 'Perform a comprehensive vulnerability scan on an internal web server.',
        exampleOutput: '+ Server: Apache/2.4.52 (Ubuntu)\n+ The anti-clickjacking X-Frame-Options header is not present.\n+ OSVDB-3233: /icons/README: Apache default file found.\n+ /admin/: Admin directory found.',
      },
      {
        cmd: 'nikto -h https://example.com -ssl',
        desc: 'Scan an HTTPS web application over encrypted transport.',
        exampleOutput: '+ Target IP: 93.184.216.34\n+ Target Port: 443 (HTTPS)\n+ No CGI Directories found.',
      },
    ],
    defenseTips:
      'Remove all default test scripts, sample configurations, and backup files (.bak, .old) from web roots. Implement modern HTTP security headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), and X-Content-Type-Options.',
    relatedToolId: '14',
  },
  {
    id: 'gobuster',
    name: 'Gobuster',
    title: 'Gobuster // Fast Directory & DNS Enumerator',
    category: 'WEB',
    badge: 'CONTENT_DISCOVERY',
    readTime: '3 min read',
    oneLiner: 'Ultra-fast directory, file, and DNS subdomain brute-forcing written in high-performance Go.',
    overview:
      'Gobuster is a multi-threaded command-line utility used to discover hidden files, directories, and virtual hosts on web servers by rapidly testing words from a dictionary list.',
    whyUse:
      'Developers frequently leave administrative paths (like /dashboard, /dev, /phpmyadmin, or /api/v1) unlinked from the main homepage. Gobuster locates these unlinked assets.',
    howItWorks:
      'Gobuster sends hundreds of concurrent HTTP GET or HEAD requests using words from a dictionary file (e.g., common.txt). By reading HTTP response codes (200 OK, 301 Redirect, 403 Forbidden), it pinpoints existing paths.',
    flags: [
      { flag: 'dir', syntax: 'gobuster dir -u <url> -w <wordlist>', desc: 'Directory Mode. Brute-forces web file paths and directories.' },
      { flag: '-u', syntax: 'gobuster dir -u <url>', desc: 'URL. Target website base URL.' },
      { flag: '-w', syntax: 'gobuster dir -w <wordlist>', desc: 'Wordlist. Path to dictionary list file.' },
      { flag: '-x', syntax: 'gobuster dir -x php,html,txt', desc: 'Extensions. Appends file extensions to wordlist entries.' },
      { flag: '-t', syntax: 'gobuster dir -t 50', desc: 'Threads. Concurrency thread count (default 10).' },
    ],
    commands: [
      {
        cmd: 'gobuster dir -u http://192.168.1.100 -w /usr/share/wordlists/dirb/common.txt -x php,txt',
        desc: 'Search for hidden directories and PHP/text files on target web server.',
        exampleOutput: '===================================================\n[+] Mode         : dir\n[+] Url/Domain   : http://192.168.1.100/\n===================================================\n/admin                (Status: 301) [Size: 312]\n/config.php           (Status: 200) [Size: 0]\n/login.php            (Status: 200) [Size: 1540]',
      },
    ],
    defenseTips:
      'Disable directory indexing in web server configurations. Protect administrative directories behind VPNs and strong IP access control lists (ACLs). Monitor for anomalous HTTP request spikes.',
    relatedToolId: '15',
  },
  {
    id: 'aircrack-ng',
    name: 'Aircrack-ng',
    title: 'Aircrack-ng // 802.11 Wireless Security Suite',
    category: 'WIRELESS',
    badge: 'WI-FI_AUDIT',
    readTime: '4 min read',
    oneLiner: 'Complete suite of tools to assess Wi-Fi network security, monitor packets, capture 4-way handshakes, and test WPA/WPA2 keys.',
    overview:
      'Aircrack-ng is the premier 802.11 wireless security suite. It focuses on four key areas: monitoring packets, testing Wi-Fi cards and drivers, attacking/capturing handshakes, and recovering WEP and WPA/WPA2 pre-shared keys.',
    whyUse:
      'Network engineers use Aircrack-ng to verify that corporate Wi-Fi encryption uses modern WPA3 or enterprise authentication, and to test that consumer pre-shared keys are resilient against dictionary attacks.',
    howItWorks:
      'The suite places a wireless network card into RF Monitor Mode (airmon-ng), captures 802.11 management and data frames (airodump-ng), captures the 4-way cryptographic handshake when a client connects, and uses a wordlist to mathematically test whether the Pre-Shared Key (PSK) matches.',
    flags: [
      { flag: '-w', syntax: 'aircrack-ng -w <wordlist> <capture.cap>', desc: 'Wordlist. Specifies the dictionary list to test against captured handshakes.' },
      { flag: '-b', syntax: 'aircrack-ng -b <BSSID> <capture.cap>', desc: 'Access Point BSSID. Filters the attack to the target router MAC address.' },
      { flag: '-e', syntax: 'aircrack-ng -e <ESSID> <capture.cap>', desc: 'Network Name. Specifies the Wi-Fi SSID.' },
    ],
    commands: [
      {
        cmd: 'aircrack-ng -w wordlist.txt -b 00:14:6C:7E:40:80 capture.cap',
        desc: 'Audit the captured WPA2 handshake from a target access point against a dictionary file.',
        exampleOutput: 'Reading packets, please wait...\n[00:00:04] 15421 keys tested (3855.2 k/s)\nKEY FOUND! [ dragon_pass_2026 ]\nMaster Key : 3D 81 21 ...\nTransient Key : 9E 45 61 ...',
      },
    ],
    defenseTips:
      'Migrate all wireless access points to WPA3-Personal or WPA2/WPA3-Enterprise with 802.1X EAP-TLS. If using WPA2-Personal, ensure pre-shared keys are at least 16+ randomized alphanumeric characters.',
    relatedToolId: '16',
  },
  {
    id: 'bettercap',
    name: 'Bettercap',
    title: 'Bettercap // Network & Protocol Attack Suite',
    category: 'WIRELESS',
    badge: 'MITM_FRAMEWORK',
    readTime: '4 min read',
    oneLiner: 'Modular, portable framework to perform network reconnaissance, ARP spoofing, DNS spoofing, and traffic inspection.',
    overview:
      'Bettercap is a state-of-the-art framework for monitoring, analyzing, and auditing local networks, BLE (Bluetooth Low Energy), and wireless communications.',
    whyUse:
      'Used in controlled laboratory environments to demonstrate the risks of unencrypted legacy protocols (HTTP, Telnet, FTP) and test network switches against ARP poisoning.',
    howItWorks:
      'It sends unsolicited ARP replies to redirect traffic between a gateway and a target device through the auditor machine (Man-in-the-Middle), enabling packet inspection and protocol analysis.',
    flags: [
      { flag: '-iface', syntax: 'bettercap -iface <interface>', desc: 'Interface. Network device to bind to (e.g. wlan0).' },
      { flag: '-eval', syntax: 'bettercap -eval "net.probe on"', desc: 'Evaluate. Executes interactive module commands on startup.' },
    ],
    commands: [
      {
        cmd: 'bettercap -iface wlan0',
        desc: 'Launch the interactive Bettercap shell on wireless interface wlan0.',
        exampleOutput: 'bettercap v2.32.0 (built for linux/arm64)\n[+] Device connected to 192.168.1.142 on wlan0\n>> net.probe on\n[+] Probing network hosts via ARP...',
      },
    ],
    defenseTips:
      'Enforce end-to-end encryption (TLS/HTTPS, SSH, IPsec) across all corporate communication so intercepted packets cannot be decrypted. Enable Dynamic ARP Inspection (DAI) on managed switches.',
    relatedToolId: '17',
  },
  {
    id: 'metasploit',
    name: 'Metasploit',
    title: 'Metasploit // Penetration Testing Framework',
    category: 'WEB',
    badge: 'EXPLOIT_SUITE',
    readTime: '5 min read',
    oneLiner: 'The world’s most widely used penetration testing framework, with thousands of exploits, payloads, and post-exploitation modules.',
    overview:
      'Metasploit Framework (MSF) is a comprehensive platform for validating system vulnerabilities, simulating cyber attacks, and executing controlled exploits against target systems in authorized security evaluations.',
    whyUse:
      'Penetration testers use Metasploit to prove whether a vulnerability discovered by an automated scanner is genuinely exploitable, ensuring remediation efforts are prioritized correctly.',
    howItWorks:
      'Metasploit pairs an exploit module (code designed to take advantage of a software flaw) with a payload (code executed on the target after successful exploitation, such as a reverse shell or Meterpreter agent).',
    flags: [
      { flag: 'use', syntax: 'use <module_name>', desc: 'Selects an exploit, auxiliary, or post module.' },
      { flag: 'set RHOSTS', syntax: 'set RHOSTS <target_ip>', desc: 'Configures the remote target host IP address.' },
      { flag: 'set LHOST', syntax: 'set LHOST <attacker_ip>', desc: 'Sets the local listening IP for reverse connections.' },
      { flag: 'exploit', syntax: 'exploit', desc: 'Fires the configured exploit payload against the target.' },
    ],
    commands: [
      {
        cmd: 'msfconsole -q',
        desc: 'Start the Metasploit console in quiet mode without the ASCII banner.',
        exampleOutput: 'msf6 > Ready. Loaded 2,315 exploits, 1,210 auxiliary modules.',
      },
      {
        cmd: 'use exploit/unix/ftp/vsftpd_234_backdoor\nset RHOSTS 192.168.1.100\nexploit',
        desc: 'Test for the classic VSFTPD 2.3.4 backdoor on a vulnerable lab server.',
        exampleOutput: '[*] 192.168.1.100:21 - Banner: 220 (vsFTPd 2.3.4)\n[+] 192.168.1.100:21 - Backdoor service spawned!\n[*] Command shell session 1 opened.',
      },
    ],
    defenseTips:
      'Keep all operating systems, server daemons, and libraries updated with vendor security patches. Implement robust endpoint detection and response (EDR) agents to detect in-memory code injection.',
    relatedToolId: '11',
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    title: 'Wireshark // Protocol Packet Analyzer',
    category: 'NETWORK',
    badge: 'PACKET_SNIFFER',
    readTime: '4 min read',
    oneLiner: 'Deep packet inspection tool to capture, dissect, and visualize raw network traffic in real time.',
    overview:
      'Wireshark is the gold standard network packet analyzer. It lets you inspect everything happening on your network at a microscopic level, translating binary streams into human-readable protocol breakdowns.',
    whyUse:
      'Invaluable for network troubleshooting, analyzing malware communications, investigating security incidents, and learning networking protocols interactively.',
    howItWorks:
      'Wireshark captures network frames via libpcap/Npcap in promiscuous mode, decodes protocols across all OSI layers (Ethernet, IP, TCP/UDP, DNS, HTTP), and provides powerful display filters to isolate specific conversations.',
    flags: [
      { flag: 'tshark -i', syntax: 'tshark -i <interface>', desc: 'Captures packets on specified interface from the command line.' },
      { flag: 'tshark -f', syntax: 'tshark -f "tcp port 80"', desc: 'Capture filter applied before saving packets.' },
      { flag: 'tshark -Y', syntax: 'tshark -Y "http.request"', desc: 'Display filter applied after packets are loaded.' },
    ],
    commands: [
      {
        cmd: 'tshark -i wlan0 -c 10',
        desc: 'Capture 10 live network packets on Wi-Fi interface and print summaries.',
        exampleOutput: '1 0.000000 192.168.1.142 -> 1.1.1.1 DNS Standard query A example.com\n2 0.024120 1.1.1.1 -> 192.168.1.142 DNS Standard response A 93.184.216.34',
      },
    ],
    defenseTips:
      'Enforce TLS 1.3 encryption across all communication so packet sniffers cannot read payload contents.',
    relatedToolId: '9',
  },
  {
    id: 'netcat',
    name: 'Netcat',
    title: 'Netcat // The TCP/IP Swiss Army Knife',
    category: 'NETWORK',
    badge: 'NETWORK_UTILITY',
    readTime: '3 min read',
    oneLiner: 'Versatile command-line tool for reading, writing, redirecting, and listening to network connections over TCP and UDP.',
    overview:
      'Netcat (nc) is a legendarily flexible utility that can establish inbound and outbound TCP or UDP connections, create port listeners, transfer files, and perform raw protocol debugging.',
    whyUse:
      'Used whenever you need to quickly test whether a port is reachable, simulate a simple network server, or transfer a file directly between two systems without installing heavy software.',
    howItWorks:
      'Netcat connects standard input and standard output directly to a network socket, allowing raw bidirectional text and binary transmission.',
    flags: [
      { flag: '-l', syntax: 'nc -l -p <port>', desc: 'Listen Mode. Binds a listening port to accept inbound connections.' },
      { flag: '-p', syntax: 'nc -p <port>', desc: 'Local Port. Sets the port number to bind or connect from.' },
      { flag: '-v', syntax: 'nc -v <target> <port>', desc: 'Verbose. Prints detailed connection status.' },
      { flag: '-z', syntax: 'nc -z <target> <port_range>', desc: 'Zero-I/O Scan. Port scanning mode that closes immediately upon connection.' },
    ],
    commands: [
      {
        cmd: 'nc -zv 192.168.1.100 20-25',
        desc: 'Quickly scan ports 20 through 25 on target machine.',
        exampleOutput: 'Connection to 192.168.1.100 22 port [tcp/ssh] succeeded!',
      },
      {
        cmd: 'nc -lvnp 4444',
        desc: 'Start a local listener on port 4444 to receive incoming test connections.',
        exampleOutput: 'Listening on 0.0.0.0 4444...',
      },
    ],
    defenseTips:
      'Restrict inbound and outbound ephemeral port access using strict firewall egress filtering rules.',
    relatedToolId: '10',
  },
  {
    id: 'common-ports',
    name: 'Common Ports',
    title: 'Common Ports // Essential Network Ports Cheatsheet',
    category: 'REFERENCE',
    badge: 'CHEATSHEET',
    readTime: '2 min read',
    oneLiner: 'Quick reference guide to standard TCP and UDP port numbers every security engineer must memorize.',
    overview:
      'Network ports are standardized 16-bit numbers (0–65535) that tell computers which service or application should handle incoming network traffic. Knowing the standard port numbers is essential for interpreting scan results.',
    whyUse:
      'Whenever you see an open port during an Nmap or Netscan audit, this reference helps you immediately identify what service is running.',
    howItWorks:
      'Port numbers 0–1023 are Well-Known System Ports, 1024–49151 are Registered User Ports, and 49152–65535 are Dynamic/Private Ports.',
    flags: [],
    commands: [
      { cmd: 'Port 21: FTP (File Transfer Protocol)', desc: 'Unencrypted file transfers. Frequently attacked with Hydra.' },
      { cmd: 'Port 22: SSH (Secure Shell)', desc: 'Encrypted remote administration terminal.' },
      { cmd: 'Port 23: Telnet', desc: 'Insecure, plaintext remote administration. Should always be replaced with SSH.' },
      { cmd: 'Port 25: SMTP (Simple Mail Transfer)', desc: 'Email server routing.' },
      { cmd: 'Port 53: DNS (Domain Name System)', desc: 'Translates human domain names to IP addresses (UDP & TCP).' },
      { cmd: 'Port 80: HTTP (Hypertext Transfer)', desc: 'Unencrypted web traffic. Audited with Nikto, Gobuster, SQLMap.' },
      { cmd: 'Port 443: HTTPS (HTTP over TLS/SSL)', desc: 'Encrypted modern web traffic.' },
      { cmd: 'Port 445: SMB (Server Message Block)', desc: 'Windows file sharing and printer services.' },
      { cmd: 'Port 3306: MySQL Database', desc: 'Default database management service port.' },
      { cmd: 'Port 3389: RDP (Remote Desktop Protocol)', desc: 'Windows graphical remote desktop access.' },
    ],
    defenseTips:
      'Never expose administrative database ports (3306, 5432) or SMB (445) directly to the public internet.',
  },
  {
    id: 'linux-commands',
    name: 'Linux Commands',
    title: 'Linux Commands // Essential Terminal Cheatsheet',
    category: 'REFERENCE',
    badge: 'CHEATSHEET',
    readTime: '3 min read',
    oneLiner: 'Core command-line tools for Kali Linux, Termux, and security terminal environments.',
    overview:
      'Proficiency with the Linux terminal is the single most important skill in cybersecurity. This guide lists the top commands used for file inspection, permissions, process management, and network troubleshooting.',
    whyUse:
      'Use this reference inside the Grey Hunter terminal whenever you need a refresher on command syntax or navigation.',
    howItWorks:
      'All security distributions (Kali, Parrot, Debian) execute commands through the shell environment (bash/zsh) interacting with the Linux kernel.',
    flags: [],
    commands: [
      { cmd: 'ifconfig / ip a', desc: 'Display all active network interfaces, local IP address, and MAC addresses.' },
      { cmd: 'ping -c 4 <ip>', desc: 'Test ICMP network reachability with exactly 4 packet echoes.' },
      { cmd: 'netstat -tuln / ss -tuln', desc: 'List all active listening TCP and UDP sockets on the system.' },
      { cmd: 'chmod +x <script.sh>', desc: 'Grant executable permissions to a shell script.' },
      { cmd: 'grep -rnw "target" /path', desc: 'Recursively search for a specific string within all files in a folder.' },
      { cmd: 'ps aux | grep <name>', desc: 'Find running processes matching a designated name.' },
      { cmd: 'kill -9 <PID>', desc: 'Forcefully terminate an unresponsive process by its process ID.' },
    ],
    defenseTips:
      'Never run untrusted shell scripts with root permissions (sudo). Always inspect script source code before execution.',
  },
  {
    id: 'networking-basics',
    name: 'Networking Basics',
    title: 'Networking Basics // IP, Subnets & 3-Way Handshake',
    category: 'REFERENCE',
    badge: 'GUIDE',
    readTime: '3 min read',
    oneLiner: 'Clear conceptual guide explaining IP addressing, CIDR subnet masks, and the TCP 3-Way Handshake.',
    overview:
      'To discover devices and audit networks effectively, you need a crystal-clear mental model of how computers locate and talk to each other.',
    whyUse:
      'Understanding subnets ensures you never accidentally scan the wrong network range, and knowing the TCP handshake explains why SYN stealth scans work.',
    howItWorks:
      'Computers use IP addresses (like 192.168.1.100) to route packets across subnets, and MAC addresses to deliver frames within the local Ethernet/Wi-Fi switch.',
    flags: [],
    commands: [
      { cmd: 'Class C Subnet (/24)', desc: '192.168.1.0/24 means the first 24 bits (192.168.1.) identify the network, and the last 8 bits allow 254 unique hosts (1 to 254).' },
      { cmd: 'TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK', desc: '1. Client sends SYN (Synchronize)\n2. Server responds SYN-ACK (Synchronize-Acknowledge)\n3. Client sends ACK (Acknowledge). Connection established!' },
      { cmd: 'SYN Stealth Scan (Half-Open)', desc: 'Nmap sends SYN. If server responds SYN-ACK, Nmap immediately sends RST (Reset) to tear down the connection before it logs an application-level login.' },
    ],
    defenseTips:
      'Segment internal corporate networks using Virtual LANs (VLANs) and internal firewalls so compromised devices cannot move laterally across subnets.',
  },
];

export const getDocById = (docId: string): ToolDoc | undefined => {
  const normalized = docId.toLowerCase().trim();
  return TOOL_DOCS.find(
    doc =>
      doc.id.toLowerCase() === normalized ||
      doc.name.toLowerCase() === normalized ||
      doc.relatedToolId === normalized
  );
};
