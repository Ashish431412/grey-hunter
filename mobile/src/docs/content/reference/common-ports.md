# Network Ports Reference

## Well-Known Ports (0-1023)
- **20 / TCP**: FTP (Data Transfer)
- **21 / TCP**: FTP (Control) - *Cleartext credentials.*
- **22 / TCP**: SSH (Secure Shell) - *Secure remote login.*
- **23 / TCP**: Telnet - *Insecure remote login.*
- **25 / TCP**: SMTP (Simple Mail Transfer Protocol) - *Mail routing.*
- **53 / TCP & UDP**: DNS (Domain Name System)
- **67 / UDP**: DHCP (Server)
- **68 / UDP**: DHCP (Client)
- **69 / UDP**: TFTP (Trivial File Transfer Protocol) - *No authentication.*
- **80 / TCP**: HTTP (Hypertext Transfer Protocol) - *Web traffic.*
- **110 / TCP**: POP3 (Post Office Protocol v3)
- **111 / TCP & UDP**: RPCBind / Portmapper - *Enumeration target.*
- **135 / TCP**: MSRPC (Microsoft RPC)
- **139 / TCP**: NetBIOS-ssn (SMB over NetBIOS)
- **143 / TCP**: IMAP (Internet Message Access Protocol)
- **161 / UDP**: SNMP (Simple Network Management Protocol) - *Often leaks sysinfo.*
- **389 / TCP**: LDAP (Lightweight Directory Access Protocol)
- **443 / TCP**: HTTPS (HTTP Secure)
- **445 / TCP**: SMB (Server Message Block) - *Target for MS17-010 (EternalBlue).*
- **636 / TCP**: LDAPS (LDAP Secure)

## Registered Ports (1024-49151)
- **1433 / TCP**: Microsoft SQL Server (MSSQL)
- **1521 / TCP**: Oracle Database
- **2049 / TCP**: NFS (Network File System)
- **3306 / TCP**: MySQL / MariaDB
- **3389 / TCP**: RDP (Remote Desktop Protocol) - *Windows remote management.*
- **5432 / TCP**: PostgreSQL
- **5900 / TCP**: VNC (Virtual Network Computing) - *Often lacks encryption.*
- **5985 / TCP**: WinRM (Windows Remote Management) HTTP
- **6379 / TCP**: Redis - *Often found without authentication.*
- **8080 / TCP**: HTTP Proxy / Alternative Web Server (e.g., Tomcat)
- **8443 / TCP**: HTTPS Alternative
- **27017 / TCP**: MongoDB

## Security Notes
- **FTP (21), Telnet (23), HTTP (80):** Transmit data in cleartext. Vulnerable to packet sniffing (Wireshark).
- **SMB (445):** A massive attack surface on Windows networks. Always check for null sessions and known exploits.
- **RDP (3389):** Highly targeted by ransomware gangs for brute-forcing. Should never be exposed directly to the internet.
- **Databases (3306, 1433, 5432):** Frequently targeted for credential brute-forcing or accessed via SQL Injection on web apps.
