/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const host = ns.getHostname();

    if (!target || target === host) {
        ns.tprint(`⚠️ Invalid target: '${target}' (cannot self-target '${host}')`);
        return;
    }

    ns.disableLog("ALL");

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

        await ns.sleep(100); // Slight delay to avoid tight infinite loop
    }
}
