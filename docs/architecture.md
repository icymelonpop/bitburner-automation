# Bitburner Automation - Architecture Documentation

## 📌 Overview

This system is a full-featured Bitburner automation framework that supports:

- Smart hacking with HWGW batch logic
- Adaptive server management
- Stock trading with 4S detection and fallback
- Faction automation
- BitNode-aware budgeting
- Endgame reset logic

Everything is initialized and orchestrated through a central entry point, and each layer operates semi-independently for modular control and upgradeability.

---

## 🔁 Execution Pipeline

### 1. Initial Boot

Executed via:

```bash
wget https://raw.githubusercontent.com/Icymelonpop/bitburner-automation/main/setup.js setup.js
run setup.js
```

Which performs:

- 🧲 Downloads all scripts into proper folders
- ⚙️ Runs `tools/apply-bitnode-config.js`
- 🚀 Launches `main.js` → triggers all core modules

---

### 2. main.js

Core automation script that initializes the system.

**Responsibilities:**

- Network scan (`core/network-mapper.js`)
- Root access (`core/root-access.js`)
- Target list generation (`core/target-selector.js`)
- Early hack fallback (`tools/early-hack.js`)
- Batch hacking scheduler (`batch/schedule-distributor.js`)
- Stock bot decision (`stock/stock-bot.js`)
- Faction management (`factions/faction-manager.js`)
- Endgame reset logic
- Background loop (`auto-runner.js`)

---

## ⚙️ Core Modules (src/core)

| Script | Role |
|--------|------|
| `network-mapper.js` | Recursively scans all reachable servers and writes to `server-list.txt`  
| `root-access.js` | Attempts to nuke all reachable servers using available port crackers  
| `target-selector.js` | Selects hackable targets sorted by money/sec and writes to `targets.txt`  

---

## 🔁 Batch Hacking System (src/batch)

Handles HWGW (Hack-Grow-Weaken-Weaken) logic for all targets.

| Script | Role |
|--------|------|
| `schedule-distributor.js` | Reads `targets.txt` and launches scheduler per target  
| `hwgw-scheduler.js` | Executes HWGW per target with appropriate delays  
| `actions/hack|grow|weaken.js` | Primitive execution for each operation with delay parameter support  

---

## ⚔️ Smart Hack Fallback (src/strategies)

Fallback if RAM is too low or early-game conditions are met.

| Script | Role |
|--------|------|
| `smart-hack.js` | RAM-safe loop that weakens, grows, or hacks based on current server state  
| `tools/early-hack.js` | Automatically deploys smart-hack to low-RAM servers (configurable)  
| `runner/hack-distributor.js` | Dynamically distributes smart-hack instances based on available threads  

---

## 🏛️ Infrastructure (src/infra)

Automates server scaling and management.

| Script | Role |
|--------|------|
| `server-purchase.js` | Buys new servers based on available budget  
| `server-upgrade.js` | Upgrades purchased servers' RAM (if affordable)  
| `deploy-hack-to-slaves.js` | Copies and runs smart-hack.js on all purchased servers  
| `home-upgrader.js` | Automatically upgrades home RAM when budget allows  
| `server-cleaner.js` | Deletes small servers to recycle slots  

---

## 💹 Stock Bot (src/stock)

Automatically invests in the stock market with or without 4S API access.

| Script | Role |
|--------|------|
| `stock-bot.js` | Decides whether to run `stock-full.js` or `stock-lite.js` based on API availability and budget  
| `stock-full.js` | Uses 4S API to make high-confidence trades  
| `stock-lite.js` | Trades based on forecast/volatility fallback logic  
| `stock-logger.js` | Tracks stock value history for analysis/debugging  

---

## 🧠 Adaptive Config (src/tools)

| Script | Role |
|--------|------|
| `apply-bitnode-config.js` | Sets budget ratios per BitNode (writes `budget-config.txt`)  
| `set-feature-toggle.js` | Enables/disables modules like stock/factions via `feature-toggle.json`  
| `feature-toggle-scheduler.js` | Automatically toggles features based on progress (optional)  

---

## 🧬 Factions (src/factions)

| Script | Role |
|--------|------|
| `faction-manager.js` | Auto joins new factions and prioritizes based on `factions.txt`  
| `faction-worker.js` | Runs faction work tasks (field, hacking, security) to gain rep  

---

## 🧩 Endgame (src/endgame)

| Script | Role |
|--------|------|
| `daedalus-detector.js` | Monitors if Daedalus is available and checks requirements  
| `bitnode-reset.js` | Automatically triggers reset once requirements are met  

---

## 🔧 Config Files (config/)

| File | Description |
|------|-------------|
| `feature-toggle.json` | Enables/disables optional modules like stock/faction/endgame  
| `budget-config.txt` | Allocates percentage of funds to infra/stock/etc  
| `factions.txt` | User-defined list of preferred factions (e.g., NiteSec, Netburners)  
| `early-targets.txt` | Used by early-hack modules for early deployment

---

## 🔁 Background Automation (auto-runner.js)

Runs in a loop every 60 seconds to:

- Re-run `server-purchase.js`, `deploy-hack-to-slaves.js`
- Rerun stock-bot
- Auto-scale systems as funds increase

---

## 🧪 Dev & Debugging Notes

- `tail()` is disabled in production scripts to avoid screen spam
- `print()` used for log-only info; `tprint()` reserved for major events
- `setup.js` can be run repeatedly to fetch latest GitHub scripts
- Scripts are all `ps`-aware → won't duplicate unless killed/reset

---

## 📦 Future Improvements

- Gang automation (BitNode-2+)
- Corporation automation
- Bladeburner automation
- Hacknet investment control
- UI CLI config editor

---

## 👤 Author

Maintained by [@icymelonpop](https://github.com/icymelonpop)

---

## 📄 License

Licensed under the [MIT License](../LICENSE)
