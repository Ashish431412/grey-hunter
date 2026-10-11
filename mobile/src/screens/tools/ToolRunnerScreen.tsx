import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';
import rawToolDefinitions from '../../features/tools/configs/toolDefinitions.json';

const THEME = {
  background: '#070f1e', // Mythic Dragon Abyss
  primary: '#00ff66',    // Dragon Emerald Green
  accent: '#00d4ff',     // Dragon Cyan Blue
  surface: '#0d1b2e',    // Dragon Scale Slate
  card: '#11223a',       // Dragon Blue Card
  text: '#ffffff',       // Pure Crisp White
  error: '#ff2247',
};

interface ToolConfig {
  name: string;
  defaultTarget: string;
  defaultFlags: string;
  targetPlaceholder: string;
  cmdPrefix: string;
  generateOutput: (target: string, flags: string) => string[];
}

const TOOL_CONFIGS: Record<string, ToolConfig> = {
  netdiscover: {
    name: 'NETDISCOVER // ARP RECON',
    defaultTarget: '192.168.1.0/24',
    defaultFlags: '-i wlan0 -f',
    targetPlaceholder: '[ SUBNET / RANGE: e.g. 192.168.1.0/24 ]',
    cmdPrefix: 'netdiscover',
    generateOutput: (target, flags) => [
      `[*] Initializing Netdiscover v0.10 ARP scanner...`,
      `[*] Interface: wlan0 | Range: ${target || '192.168.1.0/24'} | Flags: ${flags}`,
      `[*] Sending ARP requests across local segment...`,
      ` _____________________________________________________________________________`,
      `   IP            At MAC Address     Count     Len  MAC Vendor / Hostname`,
      ` -----------------------------------------------------------------------------`,
      ` 192.168.1.1     a4:91:b1:cd:20:11      1      60  TP-Link Technologies`,
      ` 192.168.1.100   08:00:27:bc:31:0a      2      60  CAD/Workstation Node`,
      ` 192.168.1.105   dc:a6:32:89:44:fe      1      60  Raspberry Pi Foundation`,
      ` 192.168.1.142   b8:27:eb:12:34:56      1      60  Samsung Electronics (This Device)`,
      ` 192.168.1.254   00:50:56:fd:aa:12      1      60  VMware Gateway Bridge`,
      `[✓] Netdiscover complete: 5 live hosts identified on local segment.`,
    ],
  },
  'arp-scan': {
    name: 'ARP-SCAN // LOCAL IP DISCOVERY',
    defaultTarget: '192.168.1.0/24',
    defaultFlags: '-l -I wlan0',
    targetPlaceholder: '[ TARGET RANGE: e.g. 192.168.1.0/24 ]',
    cmdPrefix: 'arp-scan',
    generateOutput: (target, flags) => [
      `Interface: wlan0, IPv4: 192.168.1.142, MAC: b8:27:eb:12:34:56`,
      `Starting arp-scan 1.10.0 with 256 hosts...`,
      `192.168.1.1\ta4:91:b1:cd:20:11\tTP-Link Technologies`,
      `192.168.1.100\t08:00:27:bc:31:0a\tPCS Systemtechnik GmbH`,
      `192.168.1.105\tdc:a6:32:89:44:fe\tRaspberry Pi Trading Ltd`,
      `192.168.1.254\t00:50:56:fd:aa:12\tVMware, Inc.`,
      `Ending arp-scan: 256 hosts scanned in 1.12 seconds (228.57 hosts/sec). 4 responded.`,
    ],
  },
  sqlmap: {
    name: 'SQLMAP // DATABASE EXPLOITATION',
    defaultTarget: 'http://192.168.1.100/product.php?id=1',
    defaultFlags: '--dbs --batch --random-agent',
    targetPlaceholder: '[ VULNERABLE TARGET URL ]',
    cmdPrefix: 'sqlmap',
    generateOutput: (target, flags) => [
      `[*] testing connection to the target URL: ${target}`,
      `[*] testing if GET parameter 'id' is dynamic`,
      `[+] GET parameter 'id' appears to be dynamic`,
      `[*] heuristic (basic) test shows that GET parameter 'id' might be injectable`,
      `[+] heuristic test found SQL injection syntax error (DBMS: MySQL)`,
      `sqlmap identified the following injection points:`,
      `---`,
      `Parameter: id (GET)`,
      `    Type: boolean-based blind`,
      `    Title: AND boolean-based blind - WHERE or HAVING clause`,
      `    Payload: id=1 AND 8821=8821`,
      `---`,
      `[*] back-end DBMS: MySQL >= 5.7`,
      `[*] fetching database names...`,
      `available databases [3]:`,
      `[*] information_schema`,
      `[*] shop_database`,
      `[*] users_vault`,
      `[✓] Database extraction completed successfully.`,
    ],
  },
  hydra: {
    name: 'HYDRA // NETWORK BRUTE FORCE',
    defaultTarget: '192.168.1.100',
    defaultFlags: '-l root -P /usr/share/wordlists/rockyou.txt ssh -t 16',
    targetPlaceholder: '[ TARGET IP / SERVICE URL ]',
    cmdPrefix: 'hydra',
    generateOutput: (target, flags) => [
      `Hydra v9.5 (c) 2023 by van Hauser / THC - Ethical use only`,
      `[*] Targeting: ${target} | Flags: ${flags}`,
      `[*] Starting login audit on service [ssh] with 16 workers`,
      `[ATTEMPT] user "root" pass "123456" -> FAILED`,
      `[ATTEMPT] user "root" pass "password" -> FAILED`,
      `[ATTEMPT] user "root" pass "admin" -> FAILED`,
      `[22][ssh] host: ${target}   login: root   password: hunterlab2026`,
      `1 of 1 target completed, 1 valid credential found.`,
      `[✓] Session exploit credentials verified.`,
    ],
  },
  nikto: {
    name: 'NIKTO // WEB SERVER VULNERABILITY SCANNER',
    defaultTarget: 'http://192.168.1.1',
    defaultFlags: '-Tuning 123b -ssl',
    targetPlaceholder: '[ TARGET WEB HOST / IP ]',
    cmdPrefix: 'nikto',
    generateOutput: (target, flags) => [
      `- Nikto v2.5.0`,
      `+ Target IP:          ${target}`,
      `+ Target Port:        80 / 443`,
      `---------------------------------------------------------------------------`,
      `+ Server: Apache/2.4.52 (Unix) OpenSSL/1.1.1m`,
      `+ /admin/: Directory indexing enabled.`,
      `+ /phpmyadmin/: Sensitive administrative portal exposed.`,
      `+ /robots.txt: Contains sensitive path disclosures.`,
      `+ OSVDB-3233: /icons/README: Apache default file found.`,
      `+ 1 host tested: 4 actionable configuration vulnerabilities identified.`,
    ],
  },
  nmap: {
    name: 'NMAP // NETWORK MAPPER',
    defaultTarget: '192.168.1.100',
    defaultFlags: '-sV -sC -T4 -p 21,22,80,443,3306,8080',
    targetPlaceholder: '[ TARGET IP / DOMAIN ]',
    cmdPrefix: 'nmap',
    generateOutput: (target, flags) => [
      `Starting Nmap 7.93 ( https://nmap.org )`,
      `Nmap scan report for ${target}`,
      `Host is up (0.0018s latency).`,
      `PORT     STATE SERVICE     VERSION`,
      `21/tcp   open  ftp         vsftpd 3.0.3`,
      `22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu`,
      `80/tcp   open  http        Apache httpd 2.4.52`,
      `443/tcp  open  ssl/https   Apache httpd 2.4.52`,
      `3306/tcp open  mysql       MySQL 8.0.32`,
      `8080/tcp open  http-proxy  Node.js Express Framework`,
      `Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
      `Nmap done: 1 IP address (1 host up) scanned in 1.42 seconds.`,
    ],
  },
};

const createDynamicToolConfig = (toolName: string): ToolConfig => {
  const cleanName = (toolName || 'tool').toUpperCase();
  const lowerName = (toolName || 'tool').toLowerCase();

  const def = (rawToolDefinitions as any[]).find(
    (t: any) =>
      t.id.toLowerCase() === lowerName ||
      t.name.toLowerCase() === lowerName ||
      (t.command && t.command.toLowerCase() === lowerName)
  );

  const displayName = def?.name || cleanName;
  const commandPrefix = def?.command || lowerName;
  const category = (def?.category || 'SECURITY').toUpperCase();

  // Smart defaults based on category
  let defaultTarget = '192.168.1.100';
  let defaultFlags = '-v';
  let targetPlaceholder = `[ TARGET IP / RANGE FOR ${displayName} ]`;

  if (category === 'WEB') {
    defaultTarget = 'http://192.168.1.100';
    defaultFlags = '-u --depth 2 -v';
    targetPlaceholder = `[ TARGET URL: e.g. http://192.168.1.100 ]`;
  } else if (category === 'WIRELESS') {
    defaultTarget = 'wlan0mon';
    defaultFlags = '--channel 1-11 --write capture_dump';
    targetPlaceholder = `[ WIRELESS INTERFACE: e.g. wlan0mon ]`;
  } else if (category === 'PASSWORD') {
    defaultTarget = '/usr/share/wordlists/rockyou.txt';
    defaultFlags = '-m 1000 -a 0';
    targetPlaceholder = `[ HASH FILE / WORDLIST PATH ]`;
  } else if (category === 'SNIFFING') {
    defaultTarget = 'eth0';
    defaultFlags = '-i eth0 -nn -s 0 -vv';
    targetPlaceholder = `[ CAPTURE INTERFACE: e.g. eth0 ]`;
  } else if (category === 'FORENSICS') {
    defaultTarget = '/mnt/evidence/image.raw';
    defaultFlags = '--profile=Win10x64_19041 pslist';
    targetPlaceholder = `[ MEMORY DUMP / FILE PATH ]`;
  } else if (category === 'RECON') {
    defaultTarget = 'target.internal';
    defaultFlags = '-d -active -v';
    targetPlaceholder = `[ DOMAIN / TARGET HOST ]`;
  } else if (category === 'EXPLOITATION' || category === 'ATTACK') {
    defaultTarget = '192.168.1.100';
    defaultFlags = '-RHOSTS 192.168.1.100 -LHOST 10.8.0.4';
    targetPlaceholder = `[ REMOTE TARGET HOST ]`;
  }

  return {
    name: `${displayName.toUpperCase()} // ${category} ENGINE`,
    defaultTarget,
    defaultFlags,
    targetPlaceholder,
    cmdPrefix: commandPrefix,
    generateOutput: (target, flags) => [
      `[*] Initializing ${displayName} (Dragon Terminal Engine)...`,
      `[*] Binary: ${commandPrefix} | Flags: ${flags}`,
      `[*] Target Parameter: ${target}`,
      `[*] Establishing execution telemetry channel...`,
      `[+] Loading modules and vulnerability databases...`,
      `-------------------------------------------------------------------`,
      `[+] Target response acknowledged: Host reachable`,
      `[+] Initiating audit phase on ${target}...`,
      `[+] Probing communication channels & service endpoints...`,
      `[+] Module [active]: analyzing payload responses...`,
      `[+] Service banner captured: Service listening on endpoint`,
      `[+] Auditing security configurations and posture...`,
      `[+] Telemetry integrity verified. 0 anomalies detected.`,
      `-------------------------------------------------------------------`,
      `[✓] ${displayName} execution successfully completed.`,
      `[i] Audit telemetry archived to local operation vault.`,
    ],
  };
};

export const ToolRunnerScreen = ({ navigation, route }: any) => {
  const rawParam = route?.params?.tool;
  const autoRunParam = route?.params?.autoRun;
  const toolKey = (typeof rawParam === 'string' ? rawParam : rawParam?.name || rawParam?.id || 'nmap').toLowerCase();
  const config = TOOL_CONFIGS[toolKey] || createDynamicToolConfig(toolKey);

  const [target, setTarget] = useState(config.defaultTarget);
  const [flags, setFlags] = useState(config.defaultFlags);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const timerRef = useRef<any>(null);

  const executeScan = (targetVal: string, flagsVal: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(true);
    const resolvedTarget = targetVal.trim() || config.defaultTarget;
    setOutput(`[+] Launching ${config.cmdPrefix} ${flagsVal} ${resolvedTarget}\n\n`);

    const lines = config.generateOutput(resolvedTarget, flagsVal);
    let index = 0;

    timerRef.current = setInterval(() => {
      if (index < lines.length) {
        setOutput(prev => prev + lines[index] + '\n');
        index++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
      }
    }, 350);
  };

  const handleExecute = () => {
    executeScan(target, flags);
  };

  const handleAbort = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setOutput(prev => prev + '\n[!] PROCESS ABORTED BY USER (SIGINT / CTRL+C)\n');
  };

  useEffect(() => {
    setTarget(config.defaultTarget);
    setFlags(config.defaultFlags);
    setOutput('');
    setIsRunning(false);

    if (autoRunParam) {
      const timer = setTimeout(() => {
        executeScan(config.defaultTarget, config.defaultFlags);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [toolKey, autoRunParam]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <DragonBackground overlayOpacity={0.88}>
      <View style={styles.container}>
        <View style={styles.formPanel}>
        <Text style={styles.header}>{config.name}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={config.targetPlaceholder}
          placeholderTextColor="#555"
          value={target}
          onChangeText={setTarget}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="[ FLAGS / OPTIONS ]"
          placeholderTextColor="#555"
          value={flags}
          onChangeText={setFlags}
          autoCapitalize="none"
        />

        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>GENERATED_COMMAND:</Text>
          <Text style={styles.previewCommand}>
            {config.cmdPrefix} {flags} {target || '<target>'}
          </Text>
        </View>

        {!isRunning ? (
          <TouchableOpacity style={styles.executeBtn} onPress={handleExecute}>
            <Text style={styles.executeText}>EXECUTE_PAYLOAD()</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={handleAbort}>
            <Text style={styles.stopText}>ABORT_PROCESS [SIGINT]</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.consolePanel}>
        <View style={styles.consoleHeader}>
          <Text style={styles.consoleTitle}>STDOUT // LIVE OUTPUT TERMINAL</Text>
        </View>
        <ScrollView style={styles.consoleOutput}>
          <Text style={styles.outputText}>{output || '// Ready to execute. Configure target and press EXECUTE_PAYLOAD().'}</Text>
        </ScrollView>
        {!isRunning && output.length > 0 && (
          <TouchableOpacity 
            style={styles.saveBtn}
            onPress={() => navigation.navigate('ScanResults')}
          >
            <Text style={styles.saveBtnText}>SAVE_RESULTS_TO_AUDIT_LOG</Text>
          </TouchableOpacity>
        )}
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
  formPanel: {
    padding: 16,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  header: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: '#333',
    color: THEME.text,
    padding: 10,
    fontFamily: 'monospace',
    marginBottom: 8,
    fontSize: 13,
  },
  previewBox: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 6,
    marginBottom: 14,
    borderLeftWidth: 2,
    borderLeftColor: THEME.accent,
  },
  previewLabel: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 4,
  },
  previewCommand: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  executeBtn: {
    backgroundColor: THEME.primary,
    padding: 14,
    alignItems: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  executeText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  stopBtn: {
    backgroundColor: THEME.error,
    padding: 14,
    alignItems: 'center',
  },
  stopText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
  },
  consolePanel: {
    flex: 1,
    padding: 12,
  },
  consoleHeader: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  consoleTitle: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 1,
  },
  consoleOutput: {
    flex: 1,
    backgroundColor: '#05070a',
    padding: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  outputText: {
    color: '#ffffff', // Crisp White output
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  saveBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: THEME.primary,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 65, 0.08)',
  },
  saveBtnText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
