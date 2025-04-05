/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const delay = ns.args[1] ?? 0;
    await ns.sleep(delay);
    await ns.grow(target);
}
