# Nikto Web Scanner

## Overview
Nikto is an Open Source web server scanner which performs comprehensive tests against web servers for multiple items, including over 6700 potentially dangerous files/programs, outdated server versions, and version-specific problems.

## Basic Usage
```bash
nikto -h http://example.com
```

## Tuning Options
You can tune the scan to focus on specific vulnerabilities using `-Tuning`:
- `1` : Interesting File / Server Info
- `2` : Misconfigurations / Default Files
- `3` : Information Disclosure
- `4` : Injection (XSS/Script/HTML)
- `8` : Command Execution / Remote Shell
- `9` : SQL Injection
- `x` : Reverse Tuning Options (i.e., include all except specified)

Example: Scan only for SQLi and XSS:
```bash
nikto -h http://example.com -Tuning 49
```

## SSL Scanning
To scan HTTPS sites:
```bash
nikto -h https://example.com -ssl
```

## Output Formats
Save the report in different formats for later analysis:
```bash
nikto -h http://example.com -o result.html -Format html
```
Formats include: `txt`, `html`, `csv`, `xml`.

## Using with Proxies
Route Nikto traffic through Burp Suite or Tor:
```bash
nikto -h http://example.com -useproxy http://127.0.0.1:8080
```

## Evasion Techniques
To bypass basic IDS/IPS systems (-evasion):
- `1` : Random URI encoding
- `2` : Directory self-reference (/./)
- `3` : Premature URL ending
- `4` : Prepend long random string

## Plugin System
Nikto uses plugins for scanning. List them using:
```bash
nikto -list-plugins
```

## Interpreting Results
Nikto is known for false positives. Always manually verify findings. If Nikto says an admin panel exists, try accessing it in your browser before reporting it.
