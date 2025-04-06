/** @param {NS} ns **/
export async function main(ns) {
    const script = "src/strategies/smart-hack.js";
    const targets = ns.read("targets.txt").split("\n").filter(Boolean);
    const servers = ns.getPurchasedServers();

    if (!ns.fileExists(script)) {
        ns.tprint(`❌ Script not found: ${script}`);
        return;
    }

    if (targets.length === 0) {
        ns.tprint("⚠️ No targets available in targets.txt");
        return;
    }

    let targetIndex = 0;

    for (const server of servers) {
        await ns.killall(server);
        await ns.scp(script, server);

        const maxRam = ns.getServerMaxRam(server);
        const usedRam = ns.getServerUsedRam(server);
        const scriptRam = ns.getScriptRam(script);
        const threads = Math.floor((maxRam - usedRam) / scriptRam);

        if (threads <= 0) {
            ns.tprint(`⚠️ Not enough RAM on ${server}`);
            continue;
        }

        const target = targets[targetIndex % targets.length];
        targetIndex++;

        const pid = ns.exec(script, server, threads, target);
        if (pid !== 0) {
            ns.tprint(`🚀 Running ${script} on ${server} targeting ${target} with ${threads} threads`);
        } else {
            ns.tprint(`❌ Failed to execute ${script} on ${server}`);
        }
        await ns.sleep(100);
    }

    ns.tprint("✅ Deployment to pservs complete.");
}
