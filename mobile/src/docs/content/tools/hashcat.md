# Hashcat

## Overview
Hashcat is the world's fastest and most advanced password recovery utility, supporting five unique modes of attack for over 300 highly-optimized hashing algorithms. It relies heavily on GPU acceleration.

## Hash Modes
Use `-m` to specify the hash type. Find modes using `hashcat --help | grep -i [hash_type]`.
- **0:** MD5
- **100:** SHA1
- **1400:** SHA256
- **1000:** NTLM
- **3200:** bcrypt

## Attack Modes
Use `-a` to specify the attack mode.
- **0:** Straight (Dictionary / Wordlist)
- **1:** Combination (Combines words from two dictionaries)
- **3:** Brute-force / Mask attack
- **6:** Hybrid Wordlist + Mask
- **7:** Hybrid Mask + Wordlist

## Mask Attack Syntax (-a 3)
Masks define the character set for each position.
- `?l`: Lowercase letters (a-z)
- `?u`: Uppercase letters (A-Z)
- `?d`: Digits (0-9)
- `?s`: Special characters
- `?a`: All above

*Example:* Crack an MD5 hash of a 6-character password (lowercase + numbers):
```bash
hashcat -m 0 -a 3 hashes.txt ?l?l?l?l?d?d
```

## Rules Engine (-r)
Rules alter the wordlist (e.g., capitalizing the first letter, appending numbers).
```bash
hashcat -m 0 -a 0 hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

## GPU Optimization
- `-O`: Optimized kernel (faster but limits password length).
- `-w 3`: High workload profile (uses more GPU resources, making the desktop laggy).
- `--opencl-device-types`: Select specific devices (1=CPU, 2=GPU).

## Potfile Management
Hashcat saves cracked hashes in `hashcat.potfile`. If a hash is already in the potfile, Hashcat will skip it.
To view cracked passwords:
```bash
hashcat -m 0 hashes.txt --show
```

## Benchmark Mode
Test your hardware performance against a specific algorithm.
```bash
hashcat -b -m 1000
```
