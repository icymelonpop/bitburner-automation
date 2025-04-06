/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const schedulerScript = "src/batch/hwgw-scheduler.js";
    const targetListFile = "config/targets.txt";

    // Load targets from file
    if (!ns.fileExists(targetListFile, "home")) {
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

    const home = "home";
    const scriptRam = ns.getScriptRam(schedulerScript);
    const maxRam = ns.getServerMaxRam(home);

    let launched = 0;

    for (const target of targets) {
        const freeRam = maxRam - ns.getServerUsedRam(home);
        const threads = Math.floor(freeRam / scriptRam);

        if (threads < 1) {
            ns.print(`💤 Not enough RAM to run scheduler for ${target}`);
            continue;
        }

        // Avoid launching duplicate scheduler
        const alreadyRunning = ns.ps(home).some(p =>
            p.filename === schedulerScript && p.args.includes(target)
        );
        if (alreadyRunning) {
            ns.print(`⏳ Already running: ${target}`);
            continue;
        }

        const pid = ns.exec(schedulerScript, home, threads, target);
        if (pid !== 0) {
            ns.print(`📅 Scheduler launched: ${target} (${threads} threads)`);
            launched++;
        } else {
            ns.print(`❌ Failed to launch scheduler for ${target}`);
        }

        await ns.sleep(200);
    }

    ns.tprint(`✅ Launched ${launched} HWGW scheduler(s).`);
}
