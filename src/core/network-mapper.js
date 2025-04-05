/** @param {NS} ns */
export async function main(ns) {
    const visited = new Set();
    const servers = [];

    // Recursively scan the entire network
    function scanServer(server) {
        if (visited.has(server)) return;
        visited.add(server);
        servers.push(server);

        const neighbors = ns.scan(server);
        for (const neighbor of neighbors) {
            scanServer(neighbor);
        }
    }

    scanServer("home");

    // Print discovered servers to the terminal
    ns.tprint("🌐 Found servers:");
    for (const server of servers) {
        ns.tprint(`- ${server}`);
    }

    // Optionally save the server list to a file
    await ns.write("server-list.txt", servers.join("\n"), "w");
}
