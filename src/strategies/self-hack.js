/** @param {NS} ns **/
export async function main(ns) {
    const host = ns.getHostname();

    while (true) {
        const money = ns.getServerMoneyAvailable(host);
        const maxMoney = ns.getServerMaxMoney(host);
        const sec = ns.getServerSecurityLevel(host);
        const minSec = ns.getServerMinSecurityLevel(host);

        if (sec > minSec + 5) {
            await ns.weaken(host);
        } else if (money < maxMoney * 0.9) {
            await ns.grow(host);
        } else {
            await ns.hack(host);
        }
    }
}
