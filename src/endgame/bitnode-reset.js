/** @param {NS} ns **/
export async function main(ns) {
    if (!ns.singularity) {
        ns.tprint("❌ Singularity API not available.");
        return;
    }

    const player = ns.getPlayer();

    if (!player.factions.includes("Daedalus")) {
        ns.print("⏳ Daedalus not joined. Skipping reset...");
        return;
    }

    const backdoored = ns.getServer("w0r1d_d43m0n").backdoorInstalled;
    if (!backdoored) {
        ns.print("❌ Backdoor not installed on w0r1d_d43m0n.");
        return;
    }

    const augList = ns.singularity.getOwnedAugmentations(true)
        .filter(a => !ns.singularity.getOwnedAugmentations().includes(a));

    if (augList.length === 0) {
        ns.print("❌ No new augmentations installed. Cannot proceed.");
        return;
    }

    ns.tprint("🧠 All requirements met. Preparing to install augmentations...");
    await ns.sleep(3000);

    ns.singularity.installAugmentations("setup.js"); // Re-run automation on next BitNode
}
