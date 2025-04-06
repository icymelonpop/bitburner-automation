/** @param {NS} ns **/
import { getAvailableBudget } from "src/utils/money-manager.js";

export async function main(ns) {
    ns.disableLog("ALL");
    const limit = 128; // Max RAM to upgrade up to

    while (true) {
        const current = ns.getServerMaxRam("home");

        if (current >= limit) {
            ns.print(`✅ Home RAM already ≥ ${limit}GB`);
            break;
        }

        const budget = getAvailableBudget(ns, "infra");
        const cost = ns.getUpgradeHomeRamCost();

        if (cost <= 0 || cost > budget) {
            ns.print(`💤 Waiting for budget... (need ${ns.nFormat(cost, "$0.000a")})`);
            await ns.sleep(30000);
            continue;
        }

        const success = ns.upgradeHomeRam();
        if (success) {
            ns.toast(`⬆️ Upgraded home RAM to ${ns.getServerMaxRam("home")}GB`, "success", 5000);
        } else {
            ns.print("❌ Failed to upgrade home RAM");
        }

        await ns.sleep(5000);
    }

    ns.print("🏁 Home RAM upgrade complete.");
}
