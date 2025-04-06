/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const threads = ns.args[1] ? parseInt(ns.args[1]) : 1;

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

    const buffer = 100; // buffer (ms) between operations

    // Calculate delay for correct execution sequence:
    // [ W ] → delay → [ H ] → delay → [ G ] → delay → [ W ]
    const delayWeaken1 = 0;
    const delayHack = weakenTime - hackTime + buffer;
    const delayGrow = weakenTime - growTime + buffer * 2;
    const delayWeaken2 = buffer * 3;

    // Execute batch with calculated delays and dynamic threads
    ns.exec(scriptWeaken, "home", threads, target, delayWeaken1); // Weaken (for Hack)
    ns.exec(scriptHack, "home", threads, target, delayHack);      // Hack
    ns.exec(scriptGrow, "home", threads, target, delayGrow);      // Grow
    ns.exec(scriptWeaken, "home", threads, target, delayWeaken2); // Weaken (for Grow)

    ns.tprint(`📅 HWGW scheduled for ${target} using ${threads} thread(s).`);
}
