/** @param {NS} ns **/
export async function main(ns) {
    const maxServers = ns.getPurchasedServerLimit();
    const budgetRatio = 0.25; // only use 25% of current money
    const baseRam = 8; // minimum RAM to buy
    const maxRam = 2 ** 20; // Bitburner max: 1,048,576

    let purchased = ns.getPurchasedServers();

    for (let i = purchased.length; i < maxServers; i++) {
        let ram = baseRam;

        // Find the most RAM we can afford under budgetRatio
        while (ram <= maxRam) {
            const cost = ns.getPurchasedServerCost(ram);
            const money = ns.getServerMoneyAvailable("home");

            if (cost > money * budgetRatio) break;
            ram *= 2;
        }

        ram /= 2; // go back to the last affordable RAM

        const hostname = ns.purchaseServer(`pserv-${i}`, ram);
        if (hostname) {
            ns.tprint(`🖥️ Purchased ${hostname} with ${ram}GB RAM`);
        } else {
            ns.tprint("❌ Failed to purchase server.");
        }

        await ns.sleep(500);
    }

    ns.tprint("✅ Server purchase complete.");
}
