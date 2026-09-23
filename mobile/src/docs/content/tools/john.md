# John the Ripper

## Overview
John the Ripper (JtR) is a fast, versatile offline password cracker. It excels at cracking local system hashes and document passwords.

## Supported Hash Formats
MD5, SHA-1, SHA-256, SHA-512, bcrypt, NTLM, LM, DES, crypt, and many more.

## Identifying Hash Types
Use tools like `hash-identifier` or `hashid` to determine the hashing algorithm before cracking.

## Wordlist Mode
The most common mode; uses a dictionary file.
```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
```

## Rules for Word Mangling
Rules modify the wordlist on-the-fly (e.g., changing 'password' to 'Password123!').
```bash
john --wordlist=words.txt --rules hashes.txt
```

## Incremental (Brute-Force) Mode
Tries all possible character combinations. Takes a very long time for complex passwords.
```bash
john --incremental hashes.txt
```

## Mask Mode
Tests specific patterns. For example, if you know the password starts with 'Admin' and ends with two digits:
```bash
john --mask=Admin?d?d hashes.txt
```

## Cracking /etc/shadow
First, combine `/etc/passwd` and `/etc/shadow` into a format John understands using `unshadow`:
```bash
unshadow passwd.txt shadow.txt > unshadowed.txt
john --wordlist=rockyou.txt unshadowed.txt
```

## Cracking ZIP, RAR, PDF, Office Documents
You must first extract the hash using John's utility scripts:
- `zip2john file.zip > hash.txt`
- `rar2john file.rar > hash.txt`
- `pdf2john file.pdf > hash.txt`
Then run `john hash.txt`.

## Viewing Cracked Passwords
To see successfully cracked passwords:
```bash
john --show hashes.txt
```

## Performance Tips
John supports OpenMP for multi-core CPU cracking. For GPU acceleration, use `john --format=xyz-opencl` (if compiled with GPU support), though Hashcat is often preferred for GPU tasks.
