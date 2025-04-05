/** @param {NS} ns **/
export async function main(ns) {
    const hackingLevelRequired = 1000;
    const moneyRequired = 1e9;
    const serverCountRequired = 20;

    // Early exit if singularity not unlocked
    if (!ns.singularity) {
        ns.tprint("❌ Singularity functions not available.");
        return;
    }

    const hasDaedalus = ns.getPlayer().factions.includes("Daedalus");

    if (!hasDaedalus) {
        const player = ns.getPlayer();
        const hasLevel = player.hacking >= hackingLevelRequired;
        const hasMoney = ns.getServerMoneyAvailable("home") >= moneyRequired;
        const hasServers = ns.getPurchasedServers().length >= serverCountRequired;

        if (hasLevel && hasMoney && hasServers) {
            ns.toast("🎯 Daedalus unlock condition met! Check for invitation!", "info", 8000);
            ns.tprint("🟢 You meet the requirements to join Daedalus.");
        } else {
            ns.print("⏳ Waiting for Daedalus conditions...");
        }
        return;
    }

    // Already joined Daedalus: attempt backdoor to w0r1d_d43m0n
    const target = "w0r1d_d43m0n";
    if (!ns.hasRootAccess(target)) {
        ns.tprint(`❌ No root access to ${target}.`);
        return;
    }

    // Try to connect and install backdoor
    ns.tprint("🛠️ Connecting to w0r1d_d43m0n for backdoor...");
    await ns.singularity.connect("w0r1d_d43m0n");
    await ns.singularity.installBackdoor();
    ns.tprint("✅ Backdoor installed on w0r1d_d43m0n.");
}
