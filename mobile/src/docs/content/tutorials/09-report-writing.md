# Lab 09: Penetration Test Report Writing

## Overview
A penetration test is only as good as its report. The report translates technical findings into business risks that management can understand and technical teams can fix.

## Report Structure
1. **Executive Summary:** High-level overview for management. No technical jargon. Summarizes risk posture and key findings.
2. **Methodology:** Framework used (e.g., OWASP, PTES), tools, and scope.
3. **Findings / Technical Details:** The core of the report.
4. **Remediation / Recommendations:** How to fix the issues.

## Severity Scoring (CVSS)
Use the Common Vulnerability Scoring System (CVSS v3.1) to assign objective scores (0.0 to 10.0).
- **Critical (9.0-10.0):** Immediate remote code execution, full database compromise.
- **High (7.0-8.9):** High impact but requires authentication or complex steps.
- **Medium (4.0-6.9):** XSS, CSRF, partial data disclosure.
- **Low (0.1-3.9):** Information disclosure (version numbers), missing headers.

## Anatomy of a Good Finding
Every finding must include:
- **Title:** Clear and concise (e.g., "Reflected Cross-Site Scripting in Search Parameter").
- **Severity & CVSS Score.**
- **Description:** What is the vulnerability and how does it occur here?
- **Proof of Concept (PoC):** Step-by-step instructions (with screenshots and raw HTTP requests/responses) showing exactly how to replicate it.
- **Impact:** What happens if an attacker exploits this? (e.g., "An attacker could steal user session cookies").
- **Remediation:** Specific code-level or configuration-level fixes.

## Report Writing Tips
- **Sanitize Data:** Censor sensitive data in screenshots (passwords, PII).
- **Avoid "Tool Output" Dumps:** Don't just paste Nmap or Nessus output. Validate the finding and write it in your own words.
- **Be Actionable:** Instead of "Fix SQL Injection", say "Implement parameterized queries using PreparedStatement in Java".

## Exercise
1. Take a vulnerability you found in previous labs (e.g., SQLi in DVWA).
2. Write a professional 1-page finding report for it including Title, Description, PoC (with hypothetical screenshot placeholders), Impact, and Remediation.
