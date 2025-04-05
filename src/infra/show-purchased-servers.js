/** @param {NS} ns **/
export async function main(ns) {
    const servers = ns.getPurchasedServers();
    ns.tprint("🖥️ Purchased servers:");
    for (const s of servers) {
        const ram = ns.getServerMaxRam(s);
        ns.tprint(`- ${s} (${ram}GB RAM)`);
    }
}
