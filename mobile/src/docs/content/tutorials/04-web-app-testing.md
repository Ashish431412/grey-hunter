# Lab 04: Web Application Security Testing

## Lab Objectives
- Understand and configure web proxies.
- Identify and exploit Cross-Site Scripting (XSS).
- Exploit SQL Injection vulnerabilities.
- Bypass authentication mechanisms.

## Prerequisites & Environment
- **Kali Linux VM** (Attacker)
- **Metasploitable 2 VM** or local Docker containers running DVWA (Damn Vulnerable Web App) or OWASP Juice Shop.
- **Burp Suite Community Edition** installed.

## 1. Configuring Burp Suite Proxy
1. Open Burp Suite. Go to **Proxy -> Options**. Ensure listener is on `127.0.0.1:8080`.
2. Open Firefox. Install FoxyProxy extension, configure it to point to `127.0.0.1:8080`.
3. Enable FoxyProxy. Browse to your target app (e.g., `http://dvwa.local`).
4. In Burp, check the **Proxy -> Intercept** tab to see the captured request. Forward it.

## 2. Cross-Site Scripting (XSS)
- **Reflected XSS:** Find a search box or input field. Enter `<script>alert('XSS')</script>`. If a pop-up appears, it's vulnerable.
- **Stored XSS:** Go to a Guestbook or Comment section. Enter `<script>alert(document.cookie)</script>`. Submit. The script executes every time the page is viewed.
- **DOM-based XSS:** Manipulate the URL fragment (`#`) or parameters if JavaScript processes them insecurely.

## 3. SQL Injection (SQLi)
Navigate to the DVWA SQL Injection tab (set security to Low).
1. Enter `1` and click Submit. You see a user.
2. Enter `1'` (single quote). If you see a syntax error, it's vulnerable.
3. Enter `1' OR '1'='1`. This forces the query to be true, dumping the entire database table.
4. **Union Injection:** Try `1' UNION SELECT user, password FROM users #` to extract credentials.

## 4. Directory Traversal (LFI)
Look for URLs like `page.php?file=about.txt`.
Change the parameter to `page.php?file=../../../../etc/passwd`.
If you see the Linux password file, Local File Inclusion is successful.

## 5. Authentication Bypass
- Go to a login page.
- Try username: `admin' #` or `admin' OR '1'='1' #`
- Password: `anything`
- The SQL query becomes `SELECT * FROM users WHERE user='admin' #' AND pass='anything'`, ignoring the password check.

## Exercises
1. Intercept a login request in Burp Suite and send it to Repeater.
2. Use Burp Intruder to brute-force a login page using a small wordlist.
3. Find a Stored XSS vulnerability in Juice Shop.
