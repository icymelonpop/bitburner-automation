/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const script = "src/strategies/smart-hack.js";
    const targetsFile = "config/early-targets.txt";

    if (!ns.fileExists(script, "home")) {
        ns.tprint(`❌ Missing script: ${script}`);
        return;
    }

    if (!ns.fileExists(targetsFile, "home")) {
        ns.tprint(`❌ Missing targets file: ${targetsFile}`);
        return;
    }

    const targets = ns.read(targetsFile).split("\n").map(t => t.trim()).filter(Boolean);
    if (targets.length === 0) {
        ns.tprint("⚠️ No early targets defined.");
        return;
    }

    for (const target of targets) {
        const scriptRam = ns.getScriptRam(script);
        const freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");

        const threads = Math.floor(freeRam / scriptRam);
        if (threads < 1) {
            ns.print(`💤 Not enough RAM for ${target}`);
            continue;
        }

        const pid = ns.exec(script, "home", 1, target);
        if (pid !== 0) {
            ns.print(`🚀 Early hack launched for ${target}`);
        } else {
            ns.print(`❌ Failed to launch smart-hack for ${target}`);
        }

        await ns.sleep(200);
    }

    ns.tprint("✅ Early hacking process complete.");
}
