/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    if (!ns.singularity) {
        ns.tprint("❌ Singularity API not available.");
        return;
    }

    const factions = ns.getPlayer().factions;
    const owned = ns.singularity.getOwnedAugmentations(true);

    let purchased = 0;

    for (const faction of factions) {
        const augmentations = ns.singularity.getAugmentationsFromFaction(faction);

        for (const aug of augmentations) {
            if (owned.includes(aug)) continue;

            const prereqs = ns.singularity.getAugmentationPrereq(aug);
            if (!prereqs.every(req => owned.includes(req))) continue;

            const [cost, repReq] = [
                ns.singularity.getAugmentationCost(aug)[0],
                ns.singularity.getAugmentationRepReq(aug),
            ];

            const playerRep = ns.singularity.getFactionRep(faction);
            const playerMoney = ns.getServerMoneyAvailable("home");

            if (playerRep >= repReq && playerMoney >= cost) {
                const success = ns.singularity.purchaseAugmentation(faction, aug);
                if (success) {
                    ns.tprint(`🧬 Purchased ${aug} from ${faction}`);
                    purchased++;
                    await ns.sleep(100);
                }
            }
        }
    }

    if (purchased > 0) {
        ns.tprint(`✅ Successfully purchased ${purchased} augmentation(s).`);
    } else {
        ns.print("ℹ️ No augmentations met requirements this cycle.");
    }
}
