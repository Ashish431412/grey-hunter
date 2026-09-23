# Burp Suite Comprehensive Guide

## Overview and Editions
Burp Suite is a leading integrated platform for performing security testing of web applications.
- **Community Edition:** Free, includes core manual tools (Proxy, Repeater, Intruder with rate limits).
- **Professional Edition:** Paid, includes automated vulnerability Scanner, unrestricted Intruder, and full BApp Store.

## Proxy Setup and Browser Configuration
1. Start Burp Suite and ensure the Proxy listener is running on `127.0.0.1:8080`.
2. Configure your browser to use `127.0.0.1:8080` as an HTTP/HTTPS proxy.
3. Install Burp's CA certificate (`http://burp`) into your browser's trusted root store to intercept HTTPS traffic.

## Intercepting and Modifying Requests
- Go to **Proxy -> Intercept**.
- Toggle **Intercept is on/off**.
- While on, requests are paused. You can edit parameters, headers, or body before forwarding them to the server.

## Target Scope Configuration
- In the **Target -> Site map** tab, right-click the target domain and select **Add to scope**.
- Go to **Proxy -> Options** and set "Intercept Client Requests" to "And URL Is in target scope" to avoid intercepting junk traffic.

## Spider / Crawler
(In newer versions, this is part of the automated Discover/Crawl tools). Maps the application by following links and submitting forms.

## Scanner (Professional Only)
- **Active Scanning:** Sends payloads (e.g., SQLi, XSS) to the application to find vulnerabilities.
- **Passive Scanning:** Analyzes intercepted traffic for issues like missing security headers or exposed sensitive data without sending extra requests.

## Intruder
Automated customized attacks.
- **Sniper:** One payload set, iterates through positions one by one.
- **Battering Ram:** One payload set, places the same payload in all positions simultaneously.
- **Pitchfork:** Multiple payload sets, iterates through them simultaneously (e.g., matching username1 with password1).
- **Cluster Bomb:** Multiple payload sets, tries all possible combinations (Cartesian product).

## Repeater
For manual testing. Send an interesting request from Proxy to Repeater (`Ctrl+R`). Modify it and click "Send" to analyze the response.

## Decoder and Comparer
- **Decoder:** URL, HTML, Base64 encode/decode tools.
- **Comparer:** Visual diff tool to see differences between two requests or responses (e.g., successful vs. failed login).

## Sequencer
Analyzes the degree of randomness in session tokens or other unpredictable items.

## Extender and BApp Store
Allows extending Burp's functionality using extensions written in Java, Python, or Ruby.
Popular BApps: Autorize, Active Scan++, Logger++.

## Common Workflows
- **XSS Testing:** Send request to Repeater, inject `<script>alert(1)</script>`, observe reflection in response.
- **SQL Injection:** Intercept login, save request, send to SQLMap or use Intruder with a SQLi payload list.
- **Authentication Bypass:** Use Intruder to brute-force directories or parameters.
