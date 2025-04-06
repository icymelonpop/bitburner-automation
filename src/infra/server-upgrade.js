/** @param {NS} ns **/
import { getAvailableBudget } from "src/utils/money-manager.js";

export async function main(ns) {
    const servers = ns.getPurchasedServers();
    const budget = getAvailableBudget(ns, "infra");

    for (const server of servers) {
        const currentRam = ns.getServerMaxRam(server);
        const nextRam = currentRam * 2;
        const upgradeCost = ns.getPurchasedServerCost(nextRam);

        if (nextRam > ns.getPurchasedServerMaxRam()) {
            ns.print(`⚠️ ${server} already at max RAM.`);
            continue;
        }

        if (upgradeCost > budget) {
            ns.print(`⏳ Skipping ${server}: Not enough budget ($${ns.nFormat(upgradeCost, "0.000a")})`);
            continue;
        }

        // Delete and re-purchase with higher RAM
        ns.killall(server);
        ns.deleteServer(server);
        const newServer = ns.purchaseServer(server, nextRam);

        if (newServer) {
            ns.tprint(`🔁 Upgraded ${server} to ${nextRam}GB RAM.`);
        } else {
            ns.tprint(`❌ Failed to upgrade ${server}.`);
        }

        await ns.sleep(500);
    }

    ns.print("✅ Server upgrade process complete.");
}
