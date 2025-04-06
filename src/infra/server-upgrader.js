/** @param {NS} ns **/
export async function main(ns) {
    // Get the list of purchased servers
    const servers = ns.getPurchasedServers();

    // Loop through each server to check if an upgrade is possible
    for (const server of servers) {
        // Get the current RAM size of the server
        const currentRam = ns.getServerMaxRam(server);

        // Calculate the upgrade cost (doubling the current RAM)
        const upgradeCost = ns.getPurchasedServerCost(currentRam * 2);

        // Get the available money in the home server
        const moneyAvailable = ns.getServerMoneyAvailable("home");

        // Check if there is enough money to upgrade the server
        if (upgradeCost <= moneyAvailable) {
            ns.purchaseServer(server, currentRam * 2); // Upgrade the RAM to double
            ns.tprint(`✅ Upgraded ${server} to ${currentRam * 2}GB RAM.`);
        } else {
            ns.tprint(`❌ Not enough money to upgrade ${server} (needs ${upgradeCost} vs available ${moneyAvailable})`);
        }
    }
}
