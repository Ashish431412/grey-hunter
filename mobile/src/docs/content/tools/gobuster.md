# Gobuster

## Overview
Gobuster is a tool used to brute-force URIs (directories and files) in web sites, DNS subdomains (with wildcard support), and Virtual Host names. Written in Go, it is extremely fast.

## Modes
- **dir:** Classic directory brute-forcing.
- **dns:** DNS subdomain brute-forcing.
- **vhost:** Virtual host brute-forcing (useful for IP addresses hosting multiple domains).

## Common Options
- `-u URL`: The target URL.
- `-w Wordlist`: Path to the wordlist.
- `-t Threads`: Number of concurrent threads (default is 10).
- `-o File`: Output results to a file.

## Dir Mode: Directory and File Discovery
```bash
gobuster dir -u http://example.com -w /usr/share/wordlists/dirb/common.txt -t 50
```
**Adding Extensions:** Search for specific file types (e.g., PHP, TXT, BAK)
```bash
gobuster dir -u http://example.com -w common.txt -x php,txt,bak
```

## DNS Mode: Subdomain Enumeration
```bash
gobuster dns -d example.com -w subdomains-top1mil-5000.txt
```

## Vhost Mode: Virtual Host Discovery
```bash
gobuster vhost -u http://example.com -w vhosts.txt
```

## Status Code Filtering
By default, Gobuster hides 404s. You can explicitly allow/deny status codes.
- `-s`: Positive status codes to show (e.g., `200,204,301,302,307,401,403`).
- `-b`: Status codes to blacklist/hide.

## Comparison
- **Dirb:** Older, recursive, but slower.
- **Dirbuster:** GUI-based, Java, recursive.
- **ffuf:** Another very fast Go-based fuzzer, more flexible than Gobuster but slightly steeper learning curve.
- **Gobuster:** Very fast, no recursion by default, excellent for rapid wide scans.
