/** @param {NS} ns **/
import { getAvailableBudget } from "src/utils/money-manager.js";

export async function main(ns) {
    ns.disableLog("ALL");

    const budget = getAvailableBudget(ns, "infra");
    const maxNodes = ns.hacknet.maxNumNodes();
    const upgradeDelay = 200;

    // 1. Buy new node if affordable
    if (ns.hacknet.numNodes() < maxNodes) {
        const cost = ns.hacknet.getPurchaseNodeCost();
        if (cost <= budget) {
            const index = ns.hacknet.purchaseNode();
            if (index !== -1) {
                ns.toast(`🧱 Purchased Hacknet Node-${index}`, "success", 4000);
            }
            await ns.sleep(upgradeDelay);
        }
    }

    // 2. Loop through each node and upgrade level, RAM, cores
    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
        const upgrades = [
            {
                type: "level",
                cost: ns.hacknet.getLevelUpgradeCost(i, 1),
                upgrade: () => ns.hacknet.upgradeLevel(i, 1),
            },
            {
                type: "ram",
                cost: ns.hacknet.getRamUpgradeCost(i, 1),
                upgrade: () => ns.hacknet.upgradeRam(i, 1),
            },
            {
                type: "core",
                cost: ns.hacknet.getCoreUpgradeCost(i, 1),
                upgrade: () => ns.hacknet.upgradeCore(i, 1),
            },
        ];

        for (const { type, cost, upgrade } of upgrades) {
            if (cost <= getAvailableBudget(ns, "infra")) {
                const success = upgrade();
                if (success) {
                    ns.print(`🔧 Upgraded ${type} on Node-${i}`);
                }
                await ns.sleep(upgradeDelay);
            }
        }
    }

    ns.print("✅ Hacknet management complete.");
}
