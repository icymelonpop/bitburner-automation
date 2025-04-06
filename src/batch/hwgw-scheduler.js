/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const target = ns.args[0];
    const threads = ns.args[1] ? parseInt(ns.args[1]) : 1;
    const host = ns.getHostname();

    if (!target) {
        ns.tprint("❌ No target specified.");
        return;
    }

    const scriptHack = "src/actions/hack.js";
    const scriptGrow = "src/actions/grow.js";
    const scriptWeaken = "src/actions/weaken.js";

    const weakenTime = ns.getWeakenTime(target);
    const hackTime = ns.getHackTime(target);
    const growTime = ns.getGrowTime(target);

    const buffer = 200; // Increase buffer to avoid overlap (ms)

    // Delay timing
    const delayWeaken1 = 0;
    const delayHack = weakenTime - hackTime + buffer;
    const delayGrow = weakenTime - growTime + buffer * 2;
    const delayWeaken2 = buffer * 3;

    // Execute HWGW batch
    const pid1 = ns.exec(scriptWeaken, host, threads, target, delayWeaken1); // Weaken 1
    const pid2 = ns.exec(scriptHack, host, threads, target, delayHack);      // Hack
    const pid3 = ns.exec(scriptGrow, host, threads, target, delayGrow);      // Grow
    const pid4 = ns.exec(scriptWeaken, host, threads, target, delayWeaken2); // Weaken 2

    if (pid1 && pid2 && pid3 && pid4) {
        ns.print(`📅 HWGW scheduled for ${target} | Threads: ${threads}`);
    } else {
        ns.print(`⚠️ Failed to schedule one or more actions for ${target}`);
    }
}
