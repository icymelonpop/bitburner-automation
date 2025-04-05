/** @param {NS} ns */
export async function main(ns) {
    const script = "auto/smart-hack.js";
    const targetListFile = "targets.txt";

    // Check if the script exists
    if (!ns.fileExists(script, "home")) {
        ns.tprint(`❌ Script not found: ${script}`);
        return;
    }

    // Read target list from file
    const targets = ns.read(targetListFile).split("\n").filter(t => t);

    if (targets.length === 0) {
        ns.tprint("⚠️ No targets found in targets.txt");
        return;
    }

    // Calculate available threads based on RAM
    const scriptRam = ns.getScriptRam(script);
    const maxRam = ns.getServerMaxRam("home");
    const usedRam = ns.getServerUsedRam("home");
    const freeRam = maxRam - usedRam;

    const maxThreads = Math.floor(freeRam / scriptRam);

    if (maxThreads < 1) {
        ns.tprint("⚠️ Not enough RAM to run any instances of the script.");
        return;
    }

    // Determine how many targets to assign threads to
    const threadsPerTarget = Math.max(1, Math.floor(maxThreads / targets.length));

    // Kill previous instances of the script
    ns.scriptKill(script, "home");

    let usedThreads = 0;

    for (const target of targets) {
        if (usedThreads + threadsPerTarget > maxThreads) break;
        ns.exec(script, "home", threadsPerTarget, target);
        ns.tprint(`🚀 Executing ${script} on ${target} with ${threadsPerTarget} threads`);
        usedThreads += threadsPerTarget;
    }

    ns.tprint(`✅ Total threads used: ${usedThreads}/${maxThreads}`);
}
