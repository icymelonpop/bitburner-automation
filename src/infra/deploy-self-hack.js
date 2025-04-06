/** @param {NS} ns **/
export async function main(ns) {
    const script = "src/strategies/self-hack.js";
    const targets = ns.read("targets.txt").split("\n").filter(Boolean);

    for (const target of targets) {
        if (!ns.hasRootAccess(target)) continue;

        // 복사 먼저 수행
        await ns.scp(script, target);

        const scriptRam = ns.getScriptRam(script);
        if (!scriptRam || scriptRam <= 0) {
            ns.tprint(`⚠️ Invalid script RAM for ${script}. Skipping ${target}`);
            continue;
        }

        const ram = ns.getServerMaxRam(target);
        const threads = Math.floor(ram / scriptRam);
        if (threads < 1) {
            ns.tprint(`⚠️ Not enough RAM on ${target}`);
            continue;
        }

        ns.scriptKill(script, target);
        const pid = ns.exec(script, target, threads);
        if (pid !== 0) {
            ns.tprint(`🚀 Deployed ${script} to ${target} with ${threads} threads`);
        } else {
            ns.tprint(`❌ Failed to deploy to ${target}`);
        }

        await ns.sleep(100);
    }

    ns.tprint("✅ Self-hack deployment complete.");
}
