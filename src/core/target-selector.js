/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const visited = new Set();
    const servers = [];

    // Recursive scan from home
    function scan(server) {
        if (visited.has(server)) return;
        visited.add(server);
        servers.push(server);
        for (const neighbor of ns.scan(server)) {
            scan(neighbor);
        }
    }

    scan("home");

    const targets = [];

    for (const server of servers) {
        if (server === "home") continue;
        if (!ns.hasRootAccess(server)) continue;
        if (ns.getServerMaxMoney(server) === 0) continue;

        const requiredLevel = ns.getServerRequiredHackingLevel(server);
        if (requiredLevel > ns.getHackingLevel()) continue;

        targets.push({
            hostname: server,
            money: ns.getServerMaxMoney(server),
            security: ns.getServerMinSecurityLevel(server),
            requiredLevel
        });
    }

    // Sort by most profitable: money/sec (naive: money / sec)
    targets.sort((a, b) => {
        const scoreA = a.money / a.security;
        const scoreB = b.money / b.security;
        return scoreB - scoreA;
    });

    const list = targets.map(t => t.hostname);
    await ns.write("config/targets.txt", list.join("\n"), "w");

    // Print to terminal
    ns.tprint("🎯 Selected Targets:");
    for (const t of targets) {
        ns.tprint(`- ${t.hostname} | 💰 ${ns.formatNumber(t.money, "0.0a")} | 🔒 ${t.security}`);
    }
}
