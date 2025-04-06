/** @param {NS} ns **/
export async function main(ns) {
    const script = "src/strategies/self-hack.js";
    const servers = ns.read("server-list.txt").split("\n").filter(Boolean);

    if (!ns.fileExists(script, "home")) {
        ns.tprint(`❌ Missing ${script}`);
        return;
    }

    for (const server of servers) {
        if (!ns.hasRootAccess(server)) continue;
        if (server === "home") continue;

        const maxRam = ns.getServerMaxRam(server);
        const usedRam = ns.getServerUsedRam(server);
        const freeRam = maxRam - usedRam;
        const scriptRam = ns.getScriptRam(script);

        const threads = Math.floor(freeRam / scriptRam);
        if (threads < 1 || !Number.isFinite(threads)) continue;

        await ns.killall(server);
        await ns.scp(script, server, "home");

        const pid = ns.exec(script, server, threads);
        if (pid !== 0) {
            ns.print(`🚀 Launched ${script} on ${server} with ${threads} threads`);
        } else {
            ns.print(`⚠️ Failed to run on ${server}`);
        }
    }

    ns.tprint("✅ Self-hack deployed to all rooted servers.");
}
