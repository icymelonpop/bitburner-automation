/** @param {NS} ns **/
export async function main(ns) {
    const requirements = {
        hacking: 1000,
        money: 1e9,
        servers: 20
    };

    const target = "w0r1d_d43m0n";

    // Ensure Singularity API is accessible
    if (typeof ns.singularity?.installBackdoor !== "function") {
        ns.tprint("❌ Singularity functions not available.");
        return;
    }

    const player = ns.getPlayer();
    const hasDaedalus = player.factions.includes("Daedalus");

    // Step 1: Check if player is invited
    if (!hasDaedalus) {
        const hasLevel = player.hacking >= requirements.hacking;
        const hasMoney = ns.getServerMoneyAvailable("home") >= requirements.money;
        const hasServers = ns.getPurchasedServers().length >= requirements.servers;

        if (hasLevel && hasMoney && hasServers) {
            ns.toast("🎯 Daedalus requirements met. Check for invitation!", "info", 8000);
            ns.tprint("🟢 You meet the conditions to join Daedalus.");
        } else {
            ns.print("⏳ Waiting for Daedalus invitation conditions...");
        }
        return;
    }

    // Step 2: Daedalus joined → install backdoor
    if (!ns.hasRootAccess(target)) {
        ns.tprint(`❌ No root access to ${target}`);
        return;
    }

    ns.tprint(`🛠️ Connecting to ${target}...`);
    await ns.singularity.connect(target);

    ns.tprint(`📡 Installing backdoor on ${target}...`);
    await ns.singularity.installBackdoor();

    ns.tprint(`✅ Backdoor installed on ${target}.`);
}
