/** @param {NS} ns **/
import { getAvailableBudget } from "src/utils/money-manager.js";

export async function main(ns) {
    const maxServers = ns.getPurchasedServerLimit();
    const baseRam = 8;
    const maxRam = 2 ** 20;

    const purchased = ns.getPurchasedServers();
    const availableBudget = getAvailableBudget(ns, "infra");

    for (let i = purchased.length; i < maxServers; i++) {
        let ram = baseRam;

        // Increase RAM as much as possible within budget
        while (ram <= maxRam) {
            const cost = ns.getPurchasedServerCost(ram);
            if (cost > availableBudget) break;
            ram *= 2;
        }

        ram /= 2;

        if (ram < baseRam) {
            if (i === purchased.length) {
                ns.print("💸 Not enough budget to purchase any server.");
            }
            break;
        }

        const hostname = ns.purchaseServer(`pserv-${i}`, ram);
        if (hostname) {
            ns.tprint(`🖥️ Purchased ${hostname} with ${ram}GB RAM`);
        } else {
            ns.tprint(`❌ Failed to purchase server.`);
        }

        await ns.sleep(500);
    }

    ns.print("✅ Server purchase check complete.");
}
