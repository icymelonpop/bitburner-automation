/** @param {NS} ns **/
export async function main(ns) {
    const hostname = ns.getHostname();
    ns.disableLog("ALL");

    // Load and sort targets
    const file = "config/targets.txt";
    if (!ns.fileExists(file)) {
        ns.tprint("❌ Missing config/targets.txt. Cannot determine targets.");
        return;
    }

    const targets = ns.read(file)
        .split("\n")
        .map(s => s.trim())
        .filter(s => s && s !== hostname && ns.hasRootAccess(s));

    if (targets.length === 0) {
        ns.tprint("⚠️ No valid targets found (excluding self or unrooted).");
        return;
    }

    // Sort targets by max money descending, then min security
    targets.sort((a, b) => {
        const moneyDiff = ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a);
        if (moneyDiff !== 0) return moneyDiff;
        return ns.getServerMinSecurityLevel(a) - ns.getServerMinSecurityLevel(b);
    });

    const target = targets[0];
    ns.tprint(`🎯 Target acquired: ${target}`);

    while (true) {
        const maxMoney = ns.getServerMaxMoney(target);
        const currentMoney = ns.getServerMoneyAvailable(target);
        const minSec = ns.getServerMinSecurityLevel(target);
        const currentSec = ns.getServerSecurityLevel(target);

        const secThreshold = minSec + 5;
        const moneyThreshold = maxMoney * 0.9;

        if (currentSec > secThreshold) {
            ns.print(`🔒 Weaken → ${target} (${currentSec.toFixed(2)} > ${secThreshold.toFixed(2)})`);
            await ns.weaken(target);
        } else if (currentMoney < moneyThreshold) {
            const percent = ((currentMoney / maxMoney) * 100).toFixed(1);
            ns.print(`💰 Grow → ${target} (${percent}% < 90%)`);
            await ns.grow(target);
        } else {
            ns.print(`🎯 Hack → ${target}`);
            await ns.hack(target);
        }

        await ns.sleep(100); // Slight delay for stability
    }
}
