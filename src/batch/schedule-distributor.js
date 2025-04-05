/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();

    const schedulerScript = "batch/hwgw-scheduler.js"; // Batch execution script
    const targetListFile = "targets.txt";

    // Load target list
    if (!ns.fileExists(targetListFile)) {
        ns.tprint(`❌ Missing file: ${targetListFile}`);
        return;
    }

    const targets = ns.read(targetListFile)
        .split("\n")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    if (targets.length === 0) {
        ns.tprint("⚠️ No targets found in targets.txt");
        return;
    }

    const home = "home";
    const scriptRam = ns.getScriptRam(schedulerScript);
    const maxRam = ns.getServerMaxRam(home);

    let launched = 0;

    for (const target of targets) {
        const usedRam = ns.getServerUsedRam(home);
        const freeRam = maxRam - usedRam;

        if (freeRam < scriptRam) {
            ns.print("💤 Not enough RAM. Skipping...");
            continue;
        }

        // Prevent duplicate scheduler for the same target
        const alreadyRunning = ns.ps(home).some(p =>
            p.filename === schedulerScript && p.args.includes(target)
        );
        if (alreadyRunning) {
            ns.print(`⏳ Scheduler already running for ${target}`);
            continue;
        }

        const threads = Math.floor(freeRam / scriptRam);
        const pid = ns.exec(schedulerScript, home, threads, target);
        if (pid !== 0) {
            ns.toast(`📅 Scheduled: ${target} (${threads} threads)`, "success", 5000);
            launched++;
        } else {
            ns.print(`❌ Failed to launch scheduler for ${target}`);
        }

        await ns.sleep(200); // small delay between launches
    }

    ns.tprint(`✅ Launched ${launched} scheduler instance(s).`);
}
