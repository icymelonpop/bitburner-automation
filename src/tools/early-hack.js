/** @param {NS} ns **/
export async function main(ns) {
    const script = "src/strategies/smart-hack.js";
    const targetsFile = "config/early-targets.txt";

    if (!ns.fileExists(script)) {
        ns.tprint(`❌ Missing script: ${script}`);
        return;
    }

    if (!ns.fileExists(targetsFile)) {
        ns.tprint(`❌ Missing targets file: ${targetsFile}`);
        return;
    }

    const targets = ns.read(targetsFile).split("\n").map(t => t.trim()).filter(Boolean);
    if (targets.length === 0) {
        ns.tprint("⚠️ No early targets defined.");
        return;
    }

    for (const target of targets) {
        const usedRam = ns.getServerUsedRam("home");
        const freeRam = ns.getServerMaxRam("home") - usedRam;
        const scriptRam = ns.getScriptRam(script);

        if (freeRam < scriptRam) {
            ns.print(`💤 Not enough RAM to run smart-hack for ${target}`);
            continue;
        }

        const pid = ns.exec(script, "home", 1, target);
        if (pid !== 0) {
            ns.tprint(`🚀 Launched early hack for ${target}`);
        } else {
            ns.print(`❌ Failed to launch smart-hack for ${target}`);
        }

        await ns.sleep(200); // slight delay between launches
    }
}
