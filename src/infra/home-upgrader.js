/** @param {NS} ns **/
import { getAvailableBudget } from "src/utils/money-manager.js";

export async function main(ns) {
    ns.disableLog("ALL");

    const targetLimit = 128; // Max RAM to upgrade up to

    while (true) {
        const currentRam = ns.getServerMaxRam("home");

        if (currentRam >= targetLimit) {
            ns.print(`✅ Home RAM already ≥ ${targetLimit}GB`);
            break;
        }

        const cost = ns.getUpgradeHomeRamCost();
        const budget = getAvailableBudget(ns, "infra");

        if (cost <= 0 || cost > budget) {
            ns.print(`⏳ Waiting for funds (need ${ns.nFormat(cost, "$0.000a")})`);
            await ns.sleep(15000);
            continue;
        }

        const success = ns.upgradeHomeRam();
        if (success) {
            const newRam = ns.getServerMaxRam("home");
            ns.toast(`🏠 Home RAM upgraded to ${newRam}GB`, "success", 5000);
        } else {
            ns.print("❌ Failed to upgrade home RAM.");
        }

        await ns.sleep(3000);
    }

    ns.print("🏁 Home RAM upgrade complete.");
}
