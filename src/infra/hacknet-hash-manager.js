/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const minHashToSpend = 4; // cheapest upgrade = 4 hashes
    const moneyThreshold = 100e6;

    const upgrades = [
        "Reduce Minimum Security",
        "Increase Maximum Money",
        "Generate Coding Contract"
    ];

    while (true) {
        const hashes = ns.hacknet.numHashes();
        const capacity = ns.hacknet.hashCapacity();

        if (hashes < minHashToSpend) {
            await ns.sleep(10000);
            continue;
        }

        const money = ns.getServerMoneyAvailable("home");

        if (money < moneyThreshold) {
            // Early game: Sell for money
            if (ns.hacknet.spendHashes("Sell for Money")) {
                ns.print("💰 Spent hashes for money.");
            }
        } else {
            // Use for upgrade effects
            for (const upgrade of upgrades) {
                if (ns.hacknet.spendHashes(upgrade)) {
                    ns.print(`✨ Used hashes: ${upgrade}`);
                    break;
                }
            }
        }

        await ns.sleep(5000);
    }
}
