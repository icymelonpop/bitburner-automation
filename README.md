# Bitburner Automation System

> Complete end-to-end automation framework for Bitburner  
> Covers distributed hacking, server infrastructure, intelligent stock trading (4S-aware), faction automation, and BitNode endgame reset.

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
> ⚙️ Applies BitNode-specific budget config  
> 📂 Initializes full system: hacking, stock, factions, endgame, etc.

---

## 📁 Folder Structure

```
src/
├── actions/             # Basic operations (hack/grow/weaken)
├── batch/               # Batch HWGW scheduler system (optional)
├── config/              # Budget, feature toggles, faction priority
├── core/                # Network scan, root access, target selection
├── endgame/             # Daedalus detection, BitNode reset
├── factions/            # Faction join, management, and work automation
├── infra/               # Server purchase, upgrade, script deployers
├── stock/               # Stock bots (4S-aware and fallback)
├── strategies/          # Self-hack / smart-hack strategies
├── tools/               # BitNode budget config, feature toggles
├── utils/               # Utility tools: money manager
main.js                  # Central automation launcher
auto-runner.js           # Background infra + stock loop
setup.js                 # GitHub installer (wget this)
```

---

## 🔁 System Automation Flow

```
[setup.js]
  ├─ Downloads all required scripts
  ├─ Applies BitNode-specific budget config
  └─ Launches main.js

[main.js]
  ├─ core/network-mapper.js
  ├─ core/root-access.js
  ├─ core/target-selector.js
  ├─ infra/deploy-self-hack.js         ← Distributed default
  ├─ batch/schedule-distributor.js     ← Optional batch mode
  ├─ factions/faction-manager.js
  ├─ stock/stock-bot.js
  │   ├─ stock-full.js ← if 4S API is unlocked
  │   └─ stock-lite.js ← fallback strategy
  ├─ infra/home-upgrader.js
  └─ auto-runner.js
      ├─ infra/server-purchase.js
      ├─ infra/deploy-hack-to-slaves.js
      └─ infra/server-upgrader.js

[endgame]
  ├─ endgame/daedalus-detector.js
  └─ endgame/bitnode-reset.js
```

---

## 🧠 BitNode Adaptive Budget

When `setup.js` runs, it automatically executes:

```bash
run src/tools/apply-bitnode-config.js
```

Which generates:

```json
config/budget-config.txt
```

Example:

```json
{
  "reserve": 3000000000,
  "stock": 0.3,
  "infra": 0.6,
  "other": 0.1
}
```

> Budget logic adapts automatically to the BitNode (e.g. disables stock in BitNode-2)

---

## ⚔️ Default Hacking Strategy

### Distributed Self-Hack System

- All rooted servers run `src/strategies/self-hack.js`
- Each server uses its own RAM
- Minimal memory: ~1.75 GB
- No need for home/pserv resources

```js
if (security too high) → weaken
else if (money low) → grow
else → hack
```

> 📄 Deployed by: `infra/deploy-self-hack.js`

---

## ✨ Features

- ✅ Distributed self-hack on every rooted server
- ✅ Optional HWGW batch support for high-RAM servers
- ✅ Stock trading with automatic 4S detection
- ✅ Auto faction joining + reputation farming
- ✅ Smart hack strategy for pserv deployment
- ✅ Dynamic BitNode-aware budget system
- ✅ Daedalus detection and auto-reset

---

## 📎 Maintainer

Maintained by [@icymelonpop](https://github.com/icymelonpop)

---

## 🔒 License

MIT License
