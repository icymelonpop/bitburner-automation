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

    const hackingTools = [
        { name: "BruteSSH.exe", method: ns.brutessh },
        { name: "FTPCrack.exe", method: ns.ftpcrack },
        { name: "relaySMTP.exe", method: ns.relaysmtp },
        { name: "HTTPWorm.exe", method: ns.httpworm },
        { name: "SQLInject.exe", method: ns.sqlinject },
    ];

    for (const server of servers) {
        if (ns.hasRootAccess(server) || server === "home") continue;

        let openPorts = 0;
        for (const tool of hackingTools) {
            if (ns.fileExists(tool.name, "home")) {
                try {
                    tool.method(server);
                    openPorts++;
                } catch {}
            }
        }

        if (openPorts >= ns.getServerNumPortsRequired(server)) {
            ns.nuke(server);
            ns.tprint(`✅ Rooted: ${server}`);
        }
    }

    ns.tprint("🚀 Root access attempt complete.");
}
