# Networking Fundamentals

## OSI Model (7 Layers)
A conceptual framework to understand network interactions.
1. **Physical:** Cables, switches, electrical signals (e.g., Ethernet cable).
2. **Data Link:** MAC addressing, switches, frames (e.g., ARP, Ethernet).
3. **Network:** IP addressing, routers, packets (e.g., IPv4, ICMP).
4. **Transport:** End-to-end connections, reliability, segments (e.g., TCP, UDP).
5. **Session:** Managing sessions between applications.
6. **Presentation:** Data formatting, encryption (e.g., SSL/TLS, JPEG).
7. **Application:** Network applications interacting with users (e.g., HTTP, FTP, SSH).

## IP Addressing
- **IPv4:** 32-bit address (e.g., 192.168.1.1).
- **Subnetting & CIDR:** Defines network vs. host portions. `/24` means the first 24 bits are the network (255.255.255.0).
- **Private IP Ranges (RFC 1918):** Not routable on the internet.
  - 10.0.0.0 to 10.255.255.255
  - 172.16.0.0 to 172.31.255.255
  - 192.168.0.0 to 192.168.255.255

## TCP vs UDP
- **TCP (Transmission Control Protocol):** Connection-oriented, reliable, guarantees delivery.
  - *Three-Way Handshake:* SYN -> SYN-ACK -> ACK.
  - *Flags:* SYN (Synchronize), ACK (Acknowledge), FIN (Finish), RST (Reset), PSH (Push), URG (Urgent).
- **UDP (User Datagram Protocol):** Connectionless, fast, "fire and forget". No delivery guarantee. Used for streaming, DNS.

## DNS (Domain Name System)
Translates human-readable names (example.com) to IP addresses.
- **A Record:** Maps name to IPv4.
- **AAAA Record:** Maps name to IPv6.
- **CNAME:** Alias mapping one name to another.
- **MX Record:** Mail server records.
- **TXT Record:** Text data, often used for verification or security (SPF, DKIM).

## DHCP (Dynamic Host Configuration Protocol)
Assigns IP addresses automatically.
- **DORA Process:** Discover, Offer, Request, Acknowledge.

## ARP (Address Resolution Protocol)
Maps IP addresses (Layer 3) to MAC addresses (Layer 2) on a local network.
- *ARP Spoofing:* An attacker sends fake ARP messages to associate their MAC address with the IP address of the default gateway, enabling Man-in-the-Middle (MITM) attacks.

## NAT and Port Forwarding
- **NAT (Network Address Translation):** Allows multiple devices on a private network to share a single public IP address.
- **Port Forwarding:** Instructs the router to forward traffic on a specific external port to a specific internal IP and port.

## Common Protocols
- **HTTP/HTTPS:** Web browsing (Cleartext / Encrypted).
- **SSH:** Secure remote administration.
- **FTP/SMB:** File sharing.
- **SMTP/IMAP/POP3:** Email delivery and retrieval.
