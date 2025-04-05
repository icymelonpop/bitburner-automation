/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];

    if (!target) {
        ns.tprint("❌ No target specified.");
        return;
    }

    while (true) {
        const moneyAvailable = ns.getServerMoneyAvailable(target);
        const maxMoney = ns.getServerMaxMoney(target);
        const minSecurity = ns.getServerMinSecurityLevel(target);
        const currentSecurity = ns.getServerSecurityLevel(target);

        // 1. If security too high, weaken
        if (currentSecurity > minSecurity + 5) {
            await ns.weaken(target);
        }
        // 2. If money low, grow
        else if (moneyAvailable < maxMoney * 0.9) {
            await ns.grow(target);
        }
        // 3. Otherwise, hack
        else {
            await ns.hack(target);
        }
    }
}
