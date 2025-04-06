# Bitburner Automation System

> Complete end-to-end automation framework for Bitburner  
> Covers hacking, server infrastructure, intelligent stock trading (with 4S support), faction automation, and BitNode endgame reset.

---

## 🚀 Quick Start

### 1. Download the setup script:

```bash
wget https://raw.githubusercontent.com/Icymelonpop/bitburner-automation/main/setup.js setup.js
```

### 2. Run the installer:

```bash
run setup.js
```

> ✅ Automatically downloads all scripts and launches `main.js`  
> ⚙️ Applies BitNode-specific config  
> 📂 Initializes full system: hacking, stock, factions, endgame, etc.

---

## 📁 Folder Structure

```
src/
├── actions/            # Basic one-shot scripts: hack/grow/weaken
├── batch/              # Batch HWGW scheduler per target
├── core/               # Network scan, root access, target selection
├── endgame/            # Daedalus detection, BitNode reset logic
├── factions/           # Faction management & rep farming
├── infra/              # Purchased server management (buy/upgrade/deploy)
├── stock/              # Stock bots (4S and fallback)
├── strategies/         # Adaptive scripts (e.g., smart-hack)
├── tools/              # BitNode budget config, feature toggles
├── utils/              # Utilities: money manager, etc.
config/
├── feature-toggle.json # Enables/disables modules (optional)
├── budget-config.txt   # BitNode-specific fund allocation
├── factions.txt        # Optional faction priority list
main.js                 # Central automation launcher
auto-runner.js          # Background automation loop
setup.js                # GitHub installer (wget this)
```

---

## 🔁 System Automation Flow

```
[setup.js]
  ├─ Downloads all required scripts
  ├─ Applies BitNode-specific budget config
  └─ Launches main.js

[main.js]
  ├─ core/network-mapper.js       ← Scan network
  ├─ core/root-access.js          ← Gain root access
  ├─ core/target-selector.js      ← Select best hacking targets
  ├─ tools/early-hack.js          ← Early game loop (RAM-safe)
  ├─ batch/schedule-distributor.js
  ├─ factions/faction-manager.js  ← Join & monitor factions
  ├─ stock/stock-bot.js
  │   ├─ stock-full.js ← if 4S API unlocked
  │   └─ stock-lite.js ← fallback strategy
  ├─ infra/home-upgrader.js
  └─ auto-runner.js
      ├─ infra/server-purchase.js
      ├─ infra/deploy-hack-to-slaves.js
      └─ infra/server-upgrade.js

[endgame]
  ├─ daedalus-detector.js
  └─ bitnode-reset.js
```

---

## 🧠 BitNode Adaptive Budget

When `setup.js` runs, it automatically executes:

```bash
run src/tools/apply-bitnode-config.js
```

This generates `config/budget-config.txt`, for example:

```json
{
  "reserve": 3000000000,
  "stock": 0.3,
  "infra": 0.6,
  "other": 0.1
}
```

> Budgets adjust dynamically depending on BitNode.  
> (e.g. BitNode-2 disables stock module automatically)

---

## ✨ Features

- ✅ Full HWGW batch scheduling
- ✅ Intelligent target selection
- ✅ Root access automation
- ✅ Smart hack loop (RAM-safe early strategy)
- ✅ Stock bot that adapts to 4S access
- ✅ Auto faction join + rep farming
- ✅ Auto home/server upgrades
- ✅ Daedalus detection and auto-reset

---

## 📎 Maintainer

Maintained by [@icymelonpop](https://github.com/icymelonpop)

---

## 🔒 License

MIT License
