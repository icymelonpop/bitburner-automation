/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.getHostname();

    while (true) {
        const money = ns.getServerMoneyAvailable(target);
        const max = ns.getServerMaxMoney(target);
        const sec = ns.getServerSecurityLevel(target);
        const min = ns.getServerMinSecurityLevel(target);

        if (sec > min + 5) {
            await ns.weaken(target);
        } else if (money < max * 0.9) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}
