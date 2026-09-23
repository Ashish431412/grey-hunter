# Nmap (Network Mapper)

Nmap is a free and open-source utility for network discovery and security auditing.

## Overview
Nmap uses raw IP packets to determine what hosts are available on the network, what services those hosts are offering, what operating systems they are running, what type of packet filters/firewalls are in use, and dozens of other characteristics.

## Scan Types
* **-sS (TCP SYN scan):** The default and most popular scan. Fast and relatively stealthy.
* **-sT (TCP connect scan):** Used when SYN scan is not an option (e.g., non-root user).
* **-sU (UDP scan):** Used to find open UDP ports (e.g., DNS, SNMP, DHCP).
* **-sn (Ping scan):** Only determine which hosts are up.

## Common Flags
* `-p <port ranges>`: Only scan specified ports (e.g., `-p22,80,443` or `-p1-65535`).
* `-O`: Enable OS detection.
* `-sV`: Probe open ports to determine service/version info.
* `-A`: Enable OS detection, version detection, script scanning, and traceroute.
* `-T<0-5>`: Set timing template (higher is faster, `-T4` is recommended for general scanning).

## Examples
Basic scan of a single target:
\`\`\`bash
nmap 192.168.1.100
\`\`\`

Aggressive scan on a target:
\`\`\`bash
nmap -A -T4 192.168.1.100
\`\`\`

Scan a subnet for active hosts:
\`\`\`bash
nmap -sn 192.168.1.0/24
\`\`\`
