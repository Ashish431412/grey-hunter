# SQLMap Automation Tool

## What is SQL Injection?
SQL Injection (SQLi) is a vulnerability that occurs when attacker-controlled input is directly included in SQL queries, allowing manipulation of the database.

**Types of SQLi:**
- **Union-based:** Uses the `UNION` operator to combine results of the original query with results injected by the attacker.
- **Boolean-based (Blind):** Asks the database true/false questions and determines the answer based on the application's response.
- **Time-based (Blind):** Asks the database to pause for a specified time before responding, inferring data based on response time.
- **Error-based:** Forces the database to generate an error message containing the requested data.
- **Stacked Queries:** Executes multiple SQL statements in a single call.

## Basic Usage
Provide the target URL and let SQLMap determine the vulnerable parameter.
```bash
sqlmap -u "http://example.com/page.php?id=1"
```

## Detection Options
- `--level 1-5`: Specifies the level of tests to perform. Level 3 includes User-Agent and Referer headers. Level 5 includes Host header and cookies.
- `--risk 1-3`: Specifies the risk of tests to perform. Risk 3 adds OR-based SQLi (which might alter data).

## Enumeration
Once a vulnerability is found, extract data:
- `--dbs`: List all databases.
- `-D dbname --tables`: List tables in a specific database.
- `-D dbname -T tablename --columns`: List columns in a table.
- `-D dbname -T tablename --dump`: Dump the table data.

## OS Interaction
If the database user has high privileges (like `sa` or `root`):
- `--os-shell`: Prompts for an interactive OS shell.
- `--os-cmd="whoami"`: Executes a single OS command.

## Tamper Scripts
Used to bypass Web Application Firewalls (WAF) or IPS.
```bash
sqlmap -u "http://example.com/page.php?id=1" --tamper="space2comment,charencode"
```

## POST Data and Cookie Injection
- **POST Request:** `sqlmap -u "http://example.com/login.php" --data="user=admin&pass=123"`
- **Using Burp Request File:** Save a raw request from Burp Suite and use `sqlmap -r request.txt`.
- **Cookies:** `sqlmap -u "http://example.com/page" --cookie="sessionid=123"`

## Batch Mode and Output
- `--batch`: Never ask for user input, use default behavior.
- Results are saved in `~/.local/share/sqlmap/output/`.

## Ethical Usage
Always obtain explicit, written permission before scanning or exploiting a target. Unauthorized use of SQLMap is illegal.
