# Bitburner Automation System

> Complete end-to-end automation system for Bitburner  
> Includes hacking, server management, and dynamic stock trading with 4S detection.

---

## 📁 Folder Structure

```
src/
├── actions/           # Primitive single-operations (hack/grow/weaken)
├── batch/             # HWGW scheduling logic
├── core/              # Network scan, root access, target selection
├── infra/             # Server purchase, deploy, upgrade, and clean
├── strategies/        # Intelligent, reactive hacking strategies
├── stock/             # Stock trading bots with 4S fallback
├── auto-runner.js     # Automation loop for all systems
├── main.js            # Initial launch + network setup
└── setup.js           # GitHub bootstrap installer
```

---

## 🔁 System Automation Flow

```
[GitHub Repo]
     │
     ▼
[setup.js]
  └─ Downloads all scripts from GitHub
  └─ Launches main.js

[main.js]
  ├─ core/network-mapper.js      ← Scan entire network
  ├─ core/root-access.js         ← Gain root access
  ├─ core/target-selector.js     ← Select best hacking targets
  ├─ batch/schedule-distributor.js
  │   └─ For each target:
  │       └─ batch/hwgw-scheduler.js
  │           ├─ actions/weaken.js
  │           ├─ actions/hack.js
  │           ├─ actions/grow.js
  │           └─ actions/weaken.js
  └─ auto-runner.js
      ├─ infra/server-purchase.js
      ├─ infra/deploy-hack-to-slaves.js
      └─ stock/stock-bot.js
            ├─ stock-full.js      ← if 4S owned or purchased
            └─ stock-lite.js      ← fallback if no 4S or low funds
```

---

## 🚀 Getting Started

```js
// Step 1: Download and install
run setup.js

// Step 2: Let main.js configure targets, access, and automation
// Step 3: System will run hacking and stock bots intelligently
```

---

## 📈 Features

- Full HWGW batch scheduling per target
- Root access automation
- Dynamic target selection based on money/sec
- 4S-aware stock bot: upgrades automatically
- Fallback stock-lite strategy if 4S is unavailable
- GitHub-ready folder and file naming

---

## 📎 Author

Maintained by [icymelonpop](https://github.com/icymelonpop)
