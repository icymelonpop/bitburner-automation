/** @param {NS} ns **/
import { getAvailableBudget } from "src/utils/money-manager.js";

export async function main(ns) {
    ns.disableLog("ALL");

    if (!ns.singularity) {
        ns.tprint("❌ Singularity API not available.");
        return;
    }

    const budget = getAvailableBudget(ns, "infra");

    // 1. Buy Tor if not owned
    if (!ns.singularity.purchaseTor() && !ns.singularity.getOwnedAugmentations().includes("Tor")) {
        const torCost = 200000;
        if (torCost <= budget && !ns.singularity.purchaseTor()) {
            ns.toast("🛒 Purchased TOR Router", "success", 5000);
        }
    }

    // 2. Buy available programs
    const programs = [
        "BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe",
        "HTTPWorm.exe", "SQLInject.exe", "DeepscanV2.exe",
        "AutoLink.exe", "ServerProfiler.exe"
    ];

    for (const prog of programs) {
        const cost = ns.singularity.getDarkwebProgramCost(prog);
        if (cost === -1) continue; // not available or already owned
        if (cost <= getAvailableBudget(ns, "infra") && !ns.fileExists(prog, "home")) {
            const purchased = ns.singularity.purchaseProgram(prog);
            if (purchased) {
                ns.toast(`💾 Purchased ${prog}`, "success", 5000);
                await ns.sleep(200);
            }
        }
    }

    ns.print("✅ Program purchasing complete.");
}
