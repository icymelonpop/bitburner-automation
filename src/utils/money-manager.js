/**
 * money-manager.js
 * Dynamic budget manager using external config JSON
 * Logs budget decisions to track real usage
 */

const configFile = "config/budget-config.txt";
const logFile = "logs/money-usage-log.txt";

/**
 * Load config from external file
 * @param {NS} ns
 * @returns {{reserve: number, stock: number, infra: number, other: number}}
 */
function loadConfig(ns) {
    const fallback = {
        reserve: 5e9,
        stock: 0.4,
        infra: 0.5,
        other: 0.1,
    };

    if (!ns.fileExists(configFile)) return fallback;

    try {
        const raw = ns.read(configFile);
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

/**
 * Log usage (internal use)
 * @param {NS} ns
 * @param {string} system
 * @param {number} total
 * @param {number} usable
 * @param {number} amount
 */
function logUsage(ns, system, total, usable, amount) {
    const time = new Date().toLocaleString();
    const line = `[${time}] ${system.toUpperCase()} used $${ns.nFormat(amount, "0.000a")} (of ${ns.nFormat(usable, "0.000a")} usable from ${ns.nFormat(total, "0.000a")})\n`;
    ns.write(logFile, line, "a");
}

/**
 * Get budget for a system and log it
 * @param {NS} ns
 * @param {string} system - "stock" | "infra" | "other"
 * @returns {number}
 */
export function getAvailableBudget(ns, system = "stock") {
    const total = ns.getServerMoneyAvailable("home");
    const config = loadConfig(ns);
    const usable = Math.max(0, total - config.reserve);
    const ratio = config[system] ?? 0;
    const amount = usable * ratio;

    logUsage(ns, system, total, usable, amount);
    return amount;
}
