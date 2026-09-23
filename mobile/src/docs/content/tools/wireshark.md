# Wireshark & tshark Reference

## Overview
Wireshark is the world's foremost and widely-used network protocol analyzer. It lets you see what's happening on your network at a microscopic level. It uses pcap to capture packets and provides a GUI for analyzing them. `tshark` is its command-line counterpart.

## Capture Interfaces and Filters
Capture filters limit the captured traffic. They use BPF (Berkeley Packet Filter) syntax.

- **Host:** `host 192.168.1.1` (Capture traffic to/from a host)
- **Port:** `port 80` (Capture traffic on port 80)
- **Network:** `net 192.168.1.0/24` (Capture traffic for a subnet)
- **Protocol:** `tcp`, `udp`, `icmp` (Capture specific protocols)

*Examples:*
- `tcp port 80 or tcp port 443` (HTTP and HTTPS)
- `host 10.0.0.5 and not arp` (Exclude ARP traffic for a host)

## Display Filters
Display filters hide captured packets from the view.

- **IP Address:** `ip.addr == 192.168.1.1`
- **TCP Port:** `tcp.port == 80`
- **HTTP Request:** `http.request`
- **DNS Query Name:** `dns.qry.name == "example.com"`

*Examples:*
- **HTTP traffic:** `http` or `tcp.port == 80`
- **DNS queries:** `dns`
- **Specific host:** `ip.addr == 10.0.0.1`
- **TCP handshake:** `tcp.flags.syn==1`

## Following TCP/UDP Streams
Right-click a packet -> **Follow** -> **TCP Stream**. This allows you to view the entire application-level data exchange between two endpoints, reassembled.

## Protocol Analysis
- **HTTP:** Look for `http.request.method == "GET"` or `http.response.code == 200`.
- **DNS:** Filter by `dns`. Look for A records, CNAME, etc.
- **TLS:** Filter by `tls`. Analyze the Client Hello and Server Hello.
- **ARP:** Filter by `arp`. Look for `arp.opcode == 1` (request) or `arp.opcode == 2` (reply).
- **ICMP:** Filter by `icmp`. Look for Echo Request (type 8) and Echo Reply (type 0).

## tshark CLI Usage
Run captures headlessly.
- `tshark -i eth0 -w capture.pcap` (Capture on eth0 to a file)
- `tshark -r capture.pcap -Y "http.request"` (Read file and apply display filter)

## Statistics and IO Graphs
- **Statistics -> Protocol Hierarchy:** View traffic distribution.
- **Statistics -> Conversations:** View active connections.
- **Statistics -> I/O Graphs:** Visualize traffic over time.

## Exporting Objects
Extract downloaded files from HTTP, SMB, etc.
- **File -> Export Objects -> HTTP**

## Tips for Mobile/Remote Packet Analysis
- Use `tcpdump` on a remote server, save to a `.pcap` file, and analyze locally in Wireshark.
- For Android devices, use `adb shell tcpdump` (requires root) to capture mobile app traffic.
