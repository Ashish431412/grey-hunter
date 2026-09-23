import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';

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

const CATEGORIES = ['All', 'Network', 'Recon', 'Web', 'Exploitation', 'Attack', 'Wireless', 'Password', 'Sniffing', 'Forensics'];

const TOOLS = [
  // ── NETWORK DISCOVERY & SCANNING ──
  { id: '1',  name: 'Nmap',          category: 'Network',       desc: 'Network mapper & port scanner',             root: false },
  { id: '2',  name: 'Netdiscover',   category: 'Network',       desc: 'ARP reconnaissance tool for LAN discovery', root: true },
  { id: '3',  name: 'ARP-Scan',      category: 'Network',       desc: 'ARP request IP scanner for local network',  root: true },
  { id: '4',  name: 'Masscan',       category: 'Network',       desc: 'Fastest Internet port scanner (async)',      root: true },
  { id: '5',  name: 'Angry IP',      category: 'Network',       desc: 'Fast network IP address & port scanner',    root: false },
  // ── RECONNAISSANCE ──
  { id: '6',  name: 'Amass',         category: 'Recon',         desc: 'Attack surface mapping & asset discovery',   root: false },
  { id: '7',  name: 'TheHarvester',  category: 'Recon',         desc: 'E-mail, subdomain & name harvester',        root: false },
  { id: '8',  name: 'Sublist3r',     category: 'Recon',         desc: 'Fast subdomains enumeration tool',           root: false },
  { id: '9',  name: 'DNSenum',       category: 'Recon',         desc: 'DNS enumeration & zone transfer',            root: false },
  { id: '10', name: 'Shodan',        category: 'Recon',         desc: 'IoT & exposed device search engine CLI',     root: false },
  // ── EXPLOITATION & ATTACK ──
  { id: '11', name: 'Metasploit',    category: 'Exploitation',  desc: 'Penetration testing framework (2315 exploits)', root: false },
  { id: '12', name: 'SQLMap',        category: 'Attack',        desc: 'Automatic SQL injection & DB takeover tool', root: false },
  { id: '13', name: 'Hydra',         category: 'Attack',        desc: 'Network logon brute-force (SSH/FTP/HTTP)',   root: false },
  { id: '14', name: 'Nikto',         category: 'Attack',        desc: 'Web server vulnerability scanner',           root: false },
  { id: '15', name: 'Commix',        category: 'Attack',        desc: 'OS command injection exploiter',             root: false },
  { id: '16', name: 'BeEF',          category: 'Attack',        desc: 'Browser Exploitation Framework',             root: false },
  { id: '17', name: 'Social-Engineer Toolkit', category: 'Attack', desc: 'Social engineering attack platform (SET)', root: false },
  // ── WEB APPLICATION ──
  { id: '18', name: 'Burp Suite',    category: 'Web',           desc: 'Web vulnerability scanner & proxy',          root: false },
  { id: '19', name: 'Gobuster',      category: 'Web',           desc: 'Directory/DNS/VHost brute-force tool',       root: false },
  { id: '20', name: 'OWASP ZAP',     category: 'Web',           desc: 'Web app security scanner (proxy)',           root: false },
  { id: '21', name: 'Wfuzz',         category: 'Web',           desc: 'Web application fuzzer',                     root: false },
  { id: '22', name: 'Nuclei',        category: 'Web',           desc: 'Template-based vulnerability scanner',       root: false },
  // ── WIRELESS ──
  { id: '23', name: 'Aircrack-ng',   category: 'Wireless',      desc: 'WiFi security & WPA/WPA2 cracking suite',   root: true },
  { id: '24', name: 'Wifite',        category: 'Wireless',      desc: 'Automated wireless attack tool',             root: true },
  { id: '25', name: 'Kismet',        category: 'Wireless',      desc: 'Wireless network detector & sniffer',        root: true },
  { id: '26', name: 'Reaver',        category: 'Wireless',      desc: 'WPS PIN brute-force attack',                 root: true },
  // ── PASSWORD CRACKING ──
  { id: '27', name: 'Hashcat',       category: 'Password',      desc: 'GPU-accelerated password recovery',          root: false },
  { id: '28', name: 'John the Ripper', category: 'Password',    desc: 'Password hash cracker (CPU)',                root: false },
  { id: '29', name: 'Medusa',        category: 'Password',      desc: 'Speedy parallel network login auditor',      root: false },
  { id: '30', name: 'Crunch',        category: 'Password',      desc: 'Custom wordlist generator',                  root: false },
  // ── SNIFFING & MITM ──
  { id: '31', name: 'Wireshark',     category: 'Sniffing',      desc: 'Network protocol analyzer & packet capture', root: true },
  { id: '32', name: 'Ettercap',      category: 'Sniffing',      desc: 'MITM attack & ARP spoofing suite',           root: true },
  { id: '33', name: 'Bettercap',     category: 'Sniffing',      desc: 'Swiss Army knife for MITM attacks',          root: true },
  { id: '34', name: 'MITMproxy',     category: 'Sniffing',      desc: 'Interactive HTTPS proxy for MITM',           root: false },
  { id: '35', name: 'Tcpdump',       category: 'Sniffing',      desc: 'Command-line packet analyzer',               root: true },
  // ── FORENSICS & POST-EXPLOIT ──
  { id: '36', name: 'Volatility',    category: 'Forensics',     desc: 'Memory forensics framework',                 root: false },
  { id: '37', name: 'Autopsy',       category: 'Forensics',     desc: 'Digital forensics platform',                 root: false },
  { id: '38', name: 'Binwalk',       category: 'Forensics',     desc: 'Firmware analysis & extraction tool',        root: false },
  { id: '39', name: 'LinPEAS',       category: 'Forensics',     desc: 'Linux privilege escalation audit script',    root: false },
  { id: '40', name: 'Mimikatz',      category: 'Forensics',     desc: 'Windows credential extraction tool',         root: false },
];

export const ToolCatalogScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isGrid, setIsGrid] = useState(false);

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <DragonBackground overlayOpacity={0.88}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="[ SEARCH_TOOLS ]"
          placeholderTextColor="#555"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsGrid(!isGrid)}>
          <Text style={styles.toggleText}>{isGrid ? 'LIST' : 'GRID'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        key={isGrid ? 'G' : 'L'}
        data={filteredTools}
        numColumns={isGrid ? 2 : 1}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.toolCard, isGrid && styles.toolCardGrid]}
            onPress={() => navigation.navigate('ToolDetail', { toolId: item.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.toolName}>{item.name}</Text>
              {item.root && <Text style={styles.rootBadge}>ROOT</Text>}
            </View>
            <Text style={styles.categoryBadge}>{item.category}</Text>
            <Text style={styles.toolDesc} numberOfLines={2}>{item.desc}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    color: THEME.text,
    padding: 10,
    fontFamily: 'monospace',
    marginRight: 10,
  },
  toggleBtn: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleText: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  filterContainer: {
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
    borderRadius: 15,
  },
  chipActive: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  chipText: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  chipTextActive: {
    color: THEME.primary,
  },
  toolCard: {
    backgroundColor: THEME.card,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  toolCardGrid: {
    flex: 1,
    marginHorizontal: 7.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  toolName: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rootBadge: {
    backgroundColor: THEME.error,
    color: THEME.background,
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  categoryBadge: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 10,
  },
  toolDesc: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
