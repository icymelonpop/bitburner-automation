# Bitburner Automation - Architecture Documentation

---

## 📌 Overview

This project is a **modular and extensible automation framework** for [Bitburner](https://danielyxie.github.io/bitburner/).  
It automates all key systems: hacking, stock trading, infrastructure, factions, and endgame resets.

Designed with:
- Clean folder structure for readability and GitHub maintenance
- BitNode-adaptive configuration
- Minimal manual intervention
- Self-repairing and update-friendly via `setup.js`

---

## 🧭 High-Level System Design

```
+--------------------------+
|     setup.js (entry)     |
+-----------+--------------+
            |
            v
+--------------------------+
|     main.js (core)       | ← Feature toggles apply here
+-----------+--------------+
            |
     ┌──────┼────────────────────┐
     ↓      ↓                    ↓
[Core]   [Infra]              [Auto-runner]
 Scan     Servers                Loop
 Root     Deploy
 Targets  Upgrade

            ↓
         [Stock]
         [Factions]
         [Endgame]
```

All components are **independent scripts** managed by `main.js`, `auto-runner.js`, and scheduled logic.

---

## 🔁 Execution Pipeline

### 1. Boot

```bash
wget https://raw.githubusercontent.com/Icymelonpop/bitburner-automation/main/setup.js setup.js
run setup.js
```

This performs:
- 🔽 Downloads all scripts from GitHub (structured into folders)
- 🔧 Applies BitNode-specific budget logic
- 🧠 Initializes `main.js`, which configures the system

---

### 2. Main Orchestrator - `main.js`

The central script that:
- Applies toggles (stock, faction, endgame modules)
- Initializes core infrastructure
- Launches optional batch hacking
- Starts background automation (`auto-runner.js`)

---

## 📁 Folder-by-Folder Breakdown

### 📂 `src/core/` – Core Initialization

| Script | Role |
|--------|------|
| `network-mapper.js` | Recursive DFS scan of all servers → `server-list.txt`  
| `root-access.js` | Runs port crackers and nukes eligible servers  
| `target-selector.js` | Selects profitable hack targets → `targets.txt`  

---

### 📂 `src/infra/` – Infrastructure Automation

| Script | Role |
|--------|------|
| `server-purchase.js` | Buys new pservs within budget  
| `server-upgrader.js` | Upgrades pserv RAM intelligently  
| `home-upgrader.js` | Upgrades home server RAM  
| `server-cleaner.js` | Deletes tiny/obsolete pservs  
| `deploy-hack-to-slaves.js` | Runs `smart-hack.js` on pservs  
| `deploy-self-hack.js` | Runs `self-hack.js` on all rooted servers  

---

### 📂 `src/batch/` – Optional Batch Hacking

| Script | Role |
|--------|------|
| `schedule-distributor.js` | Reads `targets.txt`, launches scheduler  
| `hwgw-scheduler.js` | Implements Hack-Grow-Weaken-Weaken delay batching  
| `actions/hack.js` etc. | Simple delay-wrapped primitives for HWGW  

> Batch hacking is only used if enough RAM is available.

---

### 📂 `src/strategies/` – Hack Strategy

| Script | Role |
|--------|------|
| `smart-hack.js` | Prioritized loop: weaken → grow → hack  
| `self-hack.js` | Same logic, but distributed to remote rooted servers  

Used by:
- `deploy-hack-to-slaves.js` for pservs  
- `deploy-self-hack.js` for rooted servers

---

### 📂 `src/stock/` – Stock Automation

| Script | Role |
|--------|------|
| `stock-bot.js` | Main entry → chooses full/lite depending on 4S  
| `stock-full.js` | Uses 4S APIs to invest dynamically  
| `stock-lite.js` | Fallback using forecast & volatility  
| `stock-logger.js` | Records portfolio value and logs  

Stock mode only activates if:
- 4S APIs available **or**
- `feature-toggle.json` allows it **and**
- Sufficient budget exists

---

### 📂 `src/factions/` – Faction Automation

| Script | Role |
|--------|------|
| `faction-manager.js` | Joins new factions, prioritizes from `factions.txt`  
| `faction-worker.js` | Runs work (field, hacking, etc.) for rep gain  

---

### 📂 `src/endgame/` – BitNode Reset

| Script | Role |
|--------|------|
| `daedalus-detector.js` | Detects when Daedalus can be joined  
| `bitnode-reset.js` | Automatically resets after prep  

Triggered once all factions joined and money is sufficient.

---

### 📂 `src/tools/` – Config Helpers

| Script | Role |
|--------|------|
| `apply-bitnode-config.js` | Writes `budget-config.txt` per BitNode  
| `set-feature-toggle.js` | Edits `feature-toggle.json` to enable/disable modules  
| `feature-toggle-scheduler.js` | Dynamically toggles modules as milestones hit  

---

### 📂 `src/utils/`

| Script | Role |
|--------|------|
| `money-manager.js` | Allocates money between infra/stock reserves  

---

## ⚙️ Config Folder

| File | Description |
|------|-------------|
| `feature-toggle.json` | Optional modules (`stock`, `factions`, `endgame`)  
| `budget-config.txt` | Allocated funds for infra/stock/etc (BitNode-aware)  
| `factions.txt` | Prioritized faction list  
| `early-targets.txt` | Pre-hack targets for `early-hack.js`  

---

## 🔁 `auto-runner.js` – Background Automation

Runs every 60s (adjustable) and:

- Purchases new servers if possible
- Deploys updated scripts to servers
- Runs stock-bot periodically

Safe to keep running persistently.  
Scripts are `ps()`-aware → no duplication.

---

## 🧪 Developer Notes

- `tprint()` only for high-priority logs  
- `print()` used inside logs/debug windows  
- `tail()` usage minimized to avoid UI clutter  
- Every module is safe to rerun or update dynamically  
- `setup.js` can be rerun to patch any missing files  

---

## 💡 Customization Tips

| Goal | Modify |
|------|--------|
| Add new hack strategy | `src/strategies/*.js` and update deployer  
| Add new modules | Extend `main.js` or `auto-runner.js`  
| Adjust budgets | Edit `tools/apply-bitnode-config.js`  
| Skip stock module | Toggle `feature-toggle.json`  
| Use batch hacking only | Remove `deploy-self-hack.js` call  

---

## 📎 Maintainer

Maintained by [@icymelonpop](https://github.com/icymelonpop)

---

## 📄 License

Licensed under the [MIT License](../LICENSE)
