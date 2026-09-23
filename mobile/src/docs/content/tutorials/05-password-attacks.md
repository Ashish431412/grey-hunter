# Lab 05: Password Attacks

## Lab Objectives
- Understand password hashing mechanisms.
- Generate custom wordlists.
- Perform offline hash cracking.
- Perform online brute-force attacks.

## 1. Password Hashing Concepts
Systems don't store plain text passwords; they store hashes.
- **MD5/SHA1:** Fast, obsolete, easily cracked.
- **bcrypt/Argon2:** Slow, uses salt, secure against fast brute-force and rainbow tables.

## 2. Creating Custom Wordlists
**CeWL (Custom Word List generator):** Spiders a website and generates a wordlist based on its text.
```bash
cewl -d 2 -m 5 -w custom_words.txt http://target.com
```
**Crunch:** Generates permutations based on criteria.
```bash
crunch 6 8 0123456789 -o numbers.txt
```

## 3. Hash Cracking with John the Ripper
1. Create a file `hash.txt` with an MD5 hash (e.g., `5f4dcc3b5aa765d61d8327deb882cf99` which is 'password').
2. Run John:
```bash
john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```
3. View results: `john --show hash.txt`.

## 4. Hash Cracking with Hashcat
1. Identify the hash mode (MD5 is 0).
2. Run Hashcat:
```bash
hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt
```

## 5. Online Brute-force with Hydra
Targeting an SSH server (Metasploitable).
```bash
hydra -l msfadmin -P rockyou.txt 192.168.1.5 ssh
```
*Wait for Hydra to find the valid `msfadmin:msfadmin` credentials.*

## 6. Password Spraying vs Brute-force
- **Brute-force:** One username, many passwords. (High risk of account lockout).
- **Password Spraying:** Many usernames, one (or few) common passwords like 'Welcome2024!'. (Bypasses lockouts).

## Exercises
1. Create a dictionary of 100 common passwords.
2. Extract the `/etc/shadow` file from an old Linux VM and crack the passwords using John.
3. Perform a password spray attack against a web login form using Burp Suite Intruder (Pitchfork mode).
