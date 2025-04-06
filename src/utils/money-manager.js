/**
 * money-manager.js
 * Budget manager using external JSON configuration
 * Allows per-system dynamic fund allocation with logging
 */

const configFile = "config/budget-config.txt";
const logFile = "logs/money-usage-log.txt";

/**
 * Load budget config from external file with fallback
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
        const parsed = JSON.parse(raw);

        return {
            reserve: parsed.reserve ?? fallback.reserve,
            stock: parsed.stock ?? fallback.stock,
            infra: parsed.infra ?? fallback.infra,
            other: parsed.other ?? fallback.other,
        };
    } catch (e) {
        ns.print(`⚠️ Failed to parse ${configFile}, using fallback.`);
        return fallback;
    }
}

/**
 * Append usage to log file
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
 * Returns available budget for the specified system
 * @param {NS} ns
 * @param {"stock" | "infra" | "other"} system
 * @param {boolean} [log=true] - Whether to log this usage
 * @returns {number}
 */
export function getAvailableBudget(ns, system = "stock", log = true) {
    const config = loadConfig(ns);
    const total = ns.getServerMoneyAvailable("home");
    const usable = Math.max(0, total - config.reserve);
    const ratio = config[system] ?? 0;
    const amount = usable * ratio;

    if (log) logUsage(ns, system, total, usable, amount);
    return amount;
}
