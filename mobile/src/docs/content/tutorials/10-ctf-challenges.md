# Lab 10: Capture The Flag (CTF) Challenges

## What are CTFs?
Capture The Flag (CTF) competitions are gamified cybersecurity challenges. Participants solve puzzles, exploit vulnerabilities, or decrypt ciphers to find a hidden string of text called a "flag".
Format: `GREYHUNTER{s0m3_r4nd0m_t3xt}`

## CTF Categories
1. **Web Exploitation:** Finding vulnerabilities in web apps (SQLi, XSS, Command Injection).
2. **Cryptography:** Decrypting ciphertexts, cracking hashes, breaking weak RSA.
3. **Reverse Engineering:** Decompiling binaries (C, Java, .NET) to understand logic or find hardcoded passwords.
4. **Forensics:** Analyzing memory dumps, network PCAPs, or finding hidden data in images (Steganography).
5. **Pwn / Binary Exploitation:** Buffer overflows, format string vulnerabilities.
6. **OSINT:** Open Source Intelligence. Finding flags using public info (Google dorks, social media).

## Practice Platforms
- **HackTheBox (HTB):** Professional-grade realistic labs.
- **TryHackMe:** Great for beginners, heavily guided walkthroughs.
- **PicoCTF:** Created by CMU, excellent for high school/college beginners.

## Beginner Challenge Examples & Tips
### Crypto: Base64
- **Challenge:** You find `R1JFWUhVTlRFUntiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259`
- **Hint:** Look at the character set (A-Z, a-z, 0-9) and padding (=).
- **Tool:** CyberChef.

### Forensics: Magic Bytes
- **Challenge:** A file has no extension. What is it?
- **Hint:** Use the `file` command in Linux or check the Hex header (e.g., `89 50 4E 47` is a PNG).

### Web: Inspect Element
- **Challenge:** Login page, but the submit button is disabled.
- **Hint:** Right-click -> Inspect Element. Remove the `disabled` attribute from the HTML tag.

### Steganography: Hidden in Plain Sight
- **Challenge:** Find the flag in an image.
- **Hint:** Use tools like `steghide`, `exiftool`, or `zsteg`. Sometimes strings are just embedded in the file: `strings image.jpg | grep GREYHUNTER`.

## Essential CTF Toolset
- **CyberChef:** The ultimate web app for encoding/decoding.
- **Wireshark:** PCAP analysis.
- **Ghidra:** Reverse engineering.
- **Python:** Scripting repetitive tasks or custom crypto solvers.
