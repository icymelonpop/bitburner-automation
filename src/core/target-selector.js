/** @param {NS} ns */
export async function main(ns) {
    const visited = new Set();
    const servers = [];

    // Recursively scan the network
    function scanServer(server) {
        if (visited.has(server)) return;
        visited.add(server);
        servers.push(server);
        for (const neighbor of ns.scan(server)) {
            scanServer(neighbor);
        }
    }

    scanServer("home");

    const targets = [];

    for (const server of servers) {
        if (server === "home") continue;
        if (!ns.hasRootAccess(server)) continue;
        if (ns.getServerMaxMoney(server) === 0) continue;

        const hackingLevel = ns.getHackingLevel();
        const requiredHackingLevel = ns.getServerRequiredHackingLevel(server);

        if (requiredHackingLevel > hackingLevel) continue;

        targets.push({
            hostname: server,
            money: ns.getServerMaxMoney(server),
            security: ns.getServerMinSecurityLevel(server),
            requiredLevel: requiredHackingLevel
        });
    }

    // Sort by max money descending, then by minimum security ascending
    targets.sort((a, b) => {
        if (b.money !== a.money) return b.money - a.money;
        return a.security - b.security;
    });

    // Save to file
    const targetList = targets.map(t => t.hostname);
    await ns.write("targets.txt", targetList.join("\n"), "w");

    // Print to terminal
    ns.tprint("🎯 Selected Targets:");
    for (const t of targets) {
        ns.tprint(`- ${t.hostname} | 💰 ${ns.nFormat(t.money, "0.0a")} | 🔒 ${t.security}`);
    }
}
