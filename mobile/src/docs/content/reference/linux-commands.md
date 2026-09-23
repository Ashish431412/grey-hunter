# Essential Linux Commands

## File Operations
- `ls -la`: List all files, including hidden (`.`), in long format.
- `cd /path`: Change directory.
- `cp source dest`: Copy file.
- `mv source dest`: Move or rename file.
- `rm -rf dir`: Force remove a directory and contents (Dangerous!).
- `find / -name flag.txt`: Search entire file system for a file.
- `cat file.txt`: Output file contents.
- `head -n 10 file`: View first 10 lines.
- `tail -n 10 file`: View last 10 lines.
- `grep "password" file`: Search for text within a file.

## Networking
- `ip a` or `ifconfig`: View network interfaces and IP addresses.
- `netstat -antp` or `ss -antp`: Show active TCP connections, listening ports, and PIDs.
- `arp -a`: View the ARP cache (MAC to IP mappings).
- `dig example.com`: DNS lookup.
- `curl -I http://example.com`: Fetch HTTP headers.
- `wget http://example.com/file`: Download a file.

## Process Management
- `ps aux`: Display all running processes.
- `top` or `htop`: Interactive process viewer.
- `kill -9 1234`: Force kill process with PID 1234.
- `bg` / `fg`: Send process to background / bring to foreground.
- `nohup command &`: Run command detached from terminal.

## User Management
- `whoami`: Print current user.
- `id`: Print user and group IDs.
- `passwd`: Change password.
- `su user`: Switch user.
- `sudo cmd`: Execute command as root.
- `cat /etc/passwd`: List system users.

## Text Processing
- `awk '{print $1}' file`: Print the first column of a file.
- `sed 's/old/new/g' file`: Replace 'old' with 'new' globally.
- `cut -d ':' -f 1 /etc/passwd`: Extract first field (username) separated by colons.
- `sort file | uniq`: Sort lines and remove duplicates.
- `wc -l file`: Count lines in a file.

## Permissions
- `chmod 755 script.sh`: Make file executable (rwxr-xr-x).
- `chmod +x script.sh`: Add execute permission.
- `chown user:group file`: Change file owner and group.

## Archives
- `tar -czvf archive.tar.gz /folder`: Compress folder.
- `tar -xzvf archive.tar.gz`: Extract folder.
- `unzip file.zip`: Extract zip file.

## System Info
- `uname -a`: Print kernel and system info.
- `hostname`: Print system name.
- `df -h`: Disk space usage.
- `free -m`: RAM usage.
- `lscpu`: CPU architecture information.
