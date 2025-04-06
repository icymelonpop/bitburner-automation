/** @param {NS} ns **/
export async function main(ns) {
    const script = "src/strategies/self-hack.js";
    const targets = ns.read("targets.txt").split("\n").filter(Boolean);

    for (const target of targets) {
        if (!ns.hasRootAccess(target)) continue;

        const ram = ns.getServerMaxRam(target);
        const scriptRam = ns.getScriptRam(script);
        const threads = Math.floor(ram / scriptRam);
        if (threads < 1) continue;

        await ns.scp(script, target);
        ns.scriptKill(script, target);
        const pid = ns.exec(script, target, threads);
        if (pid !== 0) {
            ns.tprint(`🚀 Deployed ${script} to ${target} with ${threads} threads`);
        }
        await ns.sleep(100);
    }

    ns.tprint("✅ Self-hack deployment complete.");
}
