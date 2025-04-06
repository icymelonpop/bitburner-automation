/** @param {NS} ns **/
export async function main(ns) {
    const script = "src/strategies/smart-hack.js";
    const targetListFile = "targets.txt";
    const host = "home";

    // Check if the hack script exists
    if (!ns.fileExists(script, host)) {
        ns.tprint(`❌ Script not found: ${script}`);
        return;
    }

    // Load targets from file
    const targets = ns.read(targetListFile).split("\n").filter(t => t.trim() !== "");
    if (targets.length === 0) {
        ns.tprint("⚠️ No targets found in targets.txt");
        return;
    }

    // Calculate available threads
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

    // Kill existing instances of the script
    ns.scriptKill(script, host);

    let usedThreads = 0;
    let launched = 0;

    // Distribute script across targets
    for (const target of targets) {
        if (usedThreads + threadsPerTarget > maxThreads) break;

        const pid = ns.exec(script, host, threadsPerTarget, target);
        if (pid !== 0) {
            ns.print(`🚀 Running ${script} on ${target} with ${threadsPerTarget} threads`);
            usedThreads += threadsPerTarget;
            launched++;
        } else {
            ns.print(`⚠️ Failed to launch script on ${target}`);
        }
    }

    ns.tprint(`✅ Launched on ${launched} targets with ${usedThreads}/${maxThreads} threads used.`);
}
