# 🐉 Grey Hunter — Ethical Hacking & Security Companion Platform

> **Grey Hunter** is an advanced cybersecurity companion platform featuring an Android/iOS mobile application with a cybernetic **Dragon Theme**, an interactive **Kali Red & White Terminal**, visual tool runners, and an offline **Security Knowledge Base Handbook**, powered by a robust microservices backend.

---

## 📥 Downloadable PDF Documentation & Field Manuals

Instant access to publication-grade, offline-ready PDF documentation directly from this repository:

| Document | Format | Description | Direct Download |
| :--- | :--- | :--- | :--- |
| **System Architecture & Implementation Plan** | PDF (Vector) | 6-Phase technical architecture, cryptographic identity, sandboxing, and compliance roadmap. | [📥 **Download Implementation Plan PDF**](./GREY_HUNTER_IMPLEMENTATION_PLAN.pdf) |
| **Complete Cybersecurity Tool Manuals Handbook** | PDF (Vector) | Exhaustive field manual covering 22+ security tools with commands, flags, packet mechanics, and defense playbooks. | [📥 **Download Field Manuals PDF**](./GREY_HUNTER_COMPLETE_TOOL_MANUALS.pdf) |
| **Executive Security Audit & Vulnerability Report** | PDF (Vector) | Sample executive security assessment report featuring CVSS 3.1 threat scoring, attack surface, and remediations. | [📥 **Download Security Audit Report PDF**](./GREY_HUNTER_SECURITY_AUDIT_REPORT.pdf) |

---

## 🌟 Key Features

### 📱 1. Mobile Application (`/mobile`)
- **Cyber Dragon Theme**: High-contrast, futuristic neon styling featuring Dragon Emerald Green (`#00ff66`), Cyan Blue (`#00d4ff`), and Crisp Pure White (`#ffffff`) over ambient cyber dragon artwork.
- **Red & White Kali Terminal**:
  - Fiery red prompts (`root@kali:~# ` / `root:~# `) switchable dynamically via one-tap toolbar toggle or CLI (`prompt root` / `prompt kali`).
  - High-contrast pure white monospace command output.
  - Built-in command simulators: `nmap`, `netdiscover`, `arp-scan`, `netscan`, `sqlmap`, `hydra`, `nikto`, `gobuster`, `aircrack-ng`, `bettercap`, `msfconsole`, `wireshark`, `ifconfig`, `ping`, and `tools`.
  - Quick-action toolbar with direct `[ HELP ]` output and `[ EXEC ↵ ]` triggers.
- **Arsenal & Execution Control (Tool Runner)**:
  - Catalog of 40+ security and penetration testing tools.
  - Interactive parameter inputs with live command preview and execution simulation.
  - Real-time stdout terminal streaming with abort controls.
- **Offline Knowledge Base Handbook (16+ Manuals)**:
  - Deep, beginner-friendly yet technically rigorous documentation for Nmap, Netdiscover, ARP-Scan, NetScanner, SQLMap, Hydra, Nikto, Gobuster, Aircrack-ng, Bettercap, Metasploit, Wireshark, Netcat, Common Ports, Linux Commands, and Networking Basics.
  - Each manual includes: Overview, Why Ethical Hackers Use It, How It Works (Protocols & Packets), Essential Flags, Hands-On Commands with Realistic Outputs, and Defensive Mitigation.
  - Integrated quick actions: `[ A / A+ ]` font scaling, offline bookmarks `[ ☆ SAVE ]`, `⚡ LAUNCH RUNNER`, and `>_ OPEN TERMINAL`.
- **Operations Board**:
  - Real-time Kanban board (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`) with priority badges for security operations.
- **System Configuration**:
  - Account profiles, security policies, VPN network controls, storage manager, and sync protocols.

---

### 🖥️ 2. Backend Infrastructure (`/backend`)
- **Microservice Architecture**: Built on Node.js and TypeScript with Express.
- **Real-Time Synchronization**: WebSocket communication via Socket.io for collaborative operations boards.
- **Database & ORM**: PostgreSQL managed through Prisma ORM.
- **Caching & Pub/Sub**: Redis for session caching and inter-service messaging.
- **Encrypted Object Storage**: MinIO (S3-compatible) for encrypted blobs and log archives.
- **Containerized Deployment**: One-command orchestration using Docker Compose.

---

## 🏗️ Architecture & Project Structure

```text
grey-hunter/
├── mobile/                   # React Native mobile application
│   ├── android/              # Native Android Gradle configuration
│   ├── ios/                  # Native iOS Xcode workspace
│   ├── src/
│   │   ├── app/              # App entry & navigation (Stacks & MainTabs)
│   │   ├── assets/           # Icons, cyber dragon backgrounds, and media
│   │   ├── components/       # Common reusable UI components (DragonBackground, CodeBlock, etc.)
│   │   ├── docs/data/        # Complete offline tool manuals (toolDocsData.ts)
│   │   ├── screens/          # Application screens (Auth, Dashboard, Tools, Terminal, Docs, Projects, Settings)
│   │   └── utils/            # Helper utilities and type definitions
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # Node.js TypeScript API server
│   ├── prisma/               # Database schema & migrations
│   ├── src/                  # Controllers, middleware, routes, services
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Orchestration for Postgres, Redis, MinIO
├── .env.example              # Sample environment variables configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or later
- **npm** or **yarn**
- **Android SDK** (for mobile development) & Android 10+ device or emulator
- **Docker & Docker Compose** (for backend infrastructure)

---

### 📲 Running the Mobile App

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Metro bundler**:
   ```bash
   npm start
   ```

4. **Run on Android**:
   ```bash
   npm run android
   ```
   *(Or build the debug APK via `cd android && ./gradlew assembleDebug`)*

---

### 🖥️ Running the Backend Server

1. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

2. **Start Infrastructure Services**:
   ```bash
   docker-compose up -d
   ```

3. **Install and Run Server**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```

---

## 🔒 Security & Ethical Disclaimer

> **DISCLAIMER**: **Grey Hunter** is developed strictly for **educational, academic, and authorized defensive security auditing purposes**. All security assessments and tool executions must only be performed on networks, applications, and devices that you own or have explicit written permission to evaluate. Unauthorized access, scanning, or penetration testing against external systems is illegal.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
