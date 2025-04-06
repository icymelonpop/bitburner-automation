/** @param {NS} ns **/
export async function main(ns) {
    // Check for Singularity API
    if (typeof ns.singularity?.installAugmentations !== "function") {
        ns.tprint("❌ Singularity API not available.");
        return;
    }

    const player = ns.getPlayer();
    const target = "w0r1d_d43m0n";

    // Step 1: Must be in Daedalus
    if (!player.factions.includes("Daedalus")) {
        ns.print("⏳ Daedalus not joined. Skipping reset.");
        return;
    }

    // Step 2: Backdoor check
    const backdoored = ns.getServer(target).backdoorInstalled;
    if (!backdoored) {
        ns.print(`❌ Backdoor not installed on ${target}.`);
        return;
    }

    // Step 3: Sell all stocks
    if (ns.fileExists("src/stock/sell-all.js")) {
        ns.print("💹 Selling all stocks...");
        const pid = ns.run("src/stock/sell-all.js");
        if (pid !== 0) await ns.sleep(3000);
    }

    // Step 4: Buy augmentations
    if (ns.fileExists("src/factions/augmentation-buyer.js")) {
        ns.print("🧠 Buying augmentations...");
        const pid = ns.run("src/factions/augmentation-buyer.js");
        if (pid !== 0) await ns.sleep(3000);
    }

    // Step 5: New augmentation check
    const owned = ns.singularity.getOwnedAugmentations();
    const all = ns.singularity.getOwnedAugmentations(true);
    const newAugs = all.filter(a => !owned.includes(a));

    if (newAugs.length === 0) {
        ns.print("❌ No new augmentations installed. Cannot proceed.");
        return;
    }

    // Step 6: Install augmentations and reboot
    ns.tprint("🚀 Resetting BitNode with new augmentations...");
    await ns.sleep(2000);

    const rebootScript = "setup.js";
    ns.singularity.installAugmentations(rebootScript);
}
