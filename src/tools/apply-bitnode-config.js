/** @param {NS} ns **/
export async function main(ns) {
    const node = ns.getPlayer().bitNodeN;

    let config = {
        reserve: 5e9,
        stock: 0.4,
        infra: 0.5,
        other: 0.1
    };

    switch (node) {
        case 1:
            config = {
                reserve: 3e9,
                stock: 0.3,
                infra: 0.6,
                other: 0.1
            };
            break;
        case 2:
            config = {
                reserve: 5e9,
                stock: 0.0,
                infra: 0.9,
                other: 0.1
            };
            break;
        case 8:
            config = {
                reserve: 1e9,
                stock: 0.7,
                infra: 0.2,
                other: 0.1
            };
            break;
        case 10:
            config = {
                reserve: 4e9,
                stock: 0.3,
                infra: 0.6,
                other: 0.1
            };
            break;
        default:
            config = {
                reserve: 5e9,
                stock: 0.4,
                infra: 0.5,
                other: 0.1
            };
            break;
    }

    await ns.write("config/budget-config.txt", JSON.stringify(config, null, 2), "w");
    ns.tprint(`✅ Applied budget config for BitNode-${node}`);
}
