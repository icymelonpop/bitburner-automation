/** @param {NS} ns **/
export async function main(ns) {
    const maxServers = ns.getPurchasedServerLimit();
    const baseRam = 8;
    const maxRam = 2 ** 20;
    const budgetRatio = 0.25;

    const purchased = ns.getPurchasedServers();

    for (let i = purchased.length; i < maxServers; i++) {
        let ram = baseRam;

        while (ram <= maxRam) {
            const cost = ns.getPurchasedServerCost(ram);
            const money = ns.getServerMoneyAvailable("home");
            if (cost > money * budgetRatio) break;
            ram *= 2;
        }

        ram /= 2;

        if (ram < baseRam) {
            if (i === purchased.length) {
                // Only show once when nothing was purchased
                ns.print("💸 Not enough money to purchase any server.");
            }
            break;
        }

        const hostname = ns.purchaseServer(`pserv-${i}`, ram);
        if (hostname) {
            ns.tprint(`🖥️ Purchased ${hostname} with ${ram}GB RAM`);
        } else {
            ns.tprint(`❌ Failed to purchase server.`);
        }

        await ns.sleep(500);
    }

    ns.print("✅ Server purchase check complete.");
}
