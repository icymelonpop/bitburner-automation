/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const script = "src/strategies/smart-hack.js";
    const targetListFile = "config/targets.txt";
    const host = "home";

    if (!ns.fileExists(script, host)) {
        ns.tprint(`❌ Script not found: ${script}`);
        return;
    }

    if (!ns.fileExists(targetListFile, host)) {
        ns.tprint(`❌ Missing file: ${targetListFile}`);
        return;
    }

    const targets = ns.read(targetListFile)
        .split("\n")
        .map(t => t.trim())
        .filter(Boolean);

    if (targets.length === 0) {
        ns.tprint("⚠️ No targets found in targets.txt");
        return;
    }

    const scriptRam = ns.getScriptRam(script);
    const maxRam = ns.getServerMaxRam(host);
    const usedRam = ns.getServerUsedRam(host);
    const freeRam = maxRam - usedRam;

    const maxThreads = Math.floor(freeRam / scriptRam);
    if (maxThreads < 1) {
        ns.tprint("⚠️ Not enough RAM to run any instances of the script.");
        return;
    }

    const threadsPerTarget = Math.max(1, Math.floor(maxThreads / targets.length));
    let usedThreads = 0;
    let launched = 0;

    // Optional: kill existing instances
    ns.scriptKill(script, host);

    for (const target of targets) {
        if (usedThreads + threadsPerTarget > maxThreads) break;

        // Skip if already running for this target
        const alreadyRunning = ns.ps(host).some(p =>
            p.filename === script && p.args.includes(target)
        );
        if (alreadyRunning) {
            ns.print(`⏳ Already running: ${target}`);
            continue;
        }

        const pid = ns.exec(script, host, threadsPerTarget, target);
        if (pid !== 0) {
            ns.print(`🚀 Running ${script} on ${target} with ${threadsPerTarget} threads`);
            usedThreads += threadsPerTarget;
            launched++;
        } else {
            ns.print(`⚠️ Failed to launch script on ${target}`);
        }

        await ns.sleep(100); // Prevent overlap
    }

    ns.tprint(`✅ Launched on ${launched} target(s). Threads used: ${usedThreads}/${maxThreads}`);
}
