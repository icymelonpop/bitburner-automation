/** @param {NS} ns **/
export async function main(ns) {
    const script = "src/strategies/smart-hack.js";
    const targetList = ns.read("targets.txt").split("\n").filter(Boolean);
    const servers = ns.getPurchasedServers();

    if (!ns.fileExists(script, "home")) {
        ns.tprint(`❌ Script not found: ${script}`);
        return;
    }

    if (targetList.length === 0) {
        ns.print("⚠️ No targets available.");
        return;
    }

    let deployed = 0;
    let targetIndex = 0;

    for (const server of servers) {
        const target = targetList[targetIndex % targetList.length];
        targetIndex++;

        // Skip if already running the same script on the same target
        if (ns.isRunning(script, server, target)) {
            ns.print(`⏩ Already running on ${server} targeting ${target}`);
            continue;
        }

        // Optional: Clean old scripts only if RAM is blocked
        if (ns.getServerUsedRam(server) + ns.getScriptRam(script) > ns.getServerMaxRam(server)) {
            ns.killall(server);
        }

        // Copy and run
        await ns.scp(script, server);
        const threads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(script));
        if (threads < 1) {
            ns.print(`⚠️ Not enough RAM on ${server}`);
            continue;
        }

        const pid = ns.exec(script, server, threads, target);
        if (pid !== 0) {
            ns.print(`🚀 Running ${script} on ${server} targeting ${target} with ${threads} threads`);
            deployed++;
        } else {
            ns.print(`❌ Failed to execute on ${server}`);
        }

        await ns.sleep(50);
    }

    if (deployed > 0) {
        ns.tprint(`✅ Deployment complete: ${deployed} server(s) updated`);
    } else {
        ns.print("ℹ️ No updates were needed");
    }
}
