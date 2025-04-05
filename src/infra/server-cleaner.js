export async function main(ns) {
    // Define the minimum RAM threshold for keeping a server
    const minRam = 512; 
    // Get the list of all purchased servers
    const servers = ns.getPurchasedServers();

    for (const server of servers) {
        // Fetch the current RAM size of the server
        const ram = ns.getServerMaxRam(server);
        // Calculate the cost to purchase a server with the same RAM
        const serverCost = ns.getPurchasedServerCost(ram);
        // Check available funds on the home server
        const currentMoney = ns.getServerMoneyAvailable("home");

        // If the server's RAM is below the threshold and we have enough money to replace it
        if (ram < minRam && currentMoney >= serverCost) {
            // Kill all running scripts on the server
            ns.killall(server);
            // Delete the old server
            ns.deleteServer(server);
            // Purchase a new server with the minimum RAM requirement
            const newServer = ns.purchaseServer(`pserv-${Date.now()}`, minRam);
            ns.tprint(`Replaced ${server} with ${newServer} (${minRam}GB).`);
        } else {
            ns.tprint(`Skipped ${server} (RAM=${ram}GB).`);
        }
    }
}
