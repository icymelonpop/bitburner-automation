/** @param {NS} ns **/
export async function main(ns) {
    const bn = ns.getPlayer().bitNodeN;

    let config;

    if (bn === 1) {
        config = {
            reserve: 3e9,
            stock: 0.3,
            infra: 0.6,
            other: 0.1
        };
    } else if (bn === 8) {
        config = {
            reserve: 1e9,
            stock: 0.7,
            infra: 0.2,
            other: 0.1
        };
    } else {
        config = {
            reserve: 5e9,
            stock: 0.4,
            infra: 0.5,
            other: 0.1
        };
    }

    const json = JSON.stringify(config, null, 2);
    await ns.write("config/budget-config.txt", json, "w");
    ns.tprint("✅ Suggested budget config written.");
}
