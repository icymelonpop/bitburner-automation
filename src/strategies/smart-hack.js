/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    if (!target) {
        ns.tprint("❌ No target specified.");
        return;
    }

    ns.disableLog("ALL");

    while (true) {
        const moneyAvailable = ns.getServerMoneyAvailable(target);
        const maxMoney = ns.getServerMaxMoney(target);
        const currentSecurity = ns.getServerSecurityLevel(target);
        const minSecurity = ns.getServerMinSecurityLevel(target);

        const securityThreshold = minSecurity + 5;
        const moneyThreshold = maxMoney * 0.9;

        // Weaken if too secure
        if (currentSecurity > securityThreshold) {
            ns.print(`🔒 Weaken ${target} (${currentSecurity.toFixed(2)} > ${securityThreshold.toFixed(2)})`);
            await ns.weaken(target);
        }

        // Grow if low money
        else if (moneyAvailable < moneyThreshold) {
            const percent = ((moneyAvailable / maxMoney) * 100).toFixed(1);
            ns.print(`💰 Grow ${target} (${percent}% < 90%)`);
            await ns.grow(target);
        }

        // Otherwise hack
        else {
            ns.print(`🎯 Hack ${target}`);
            await ns.hack(target);
        }

        await ns.sleep(100); // Reduce loop aggressiveness
    }
}
