/** @param {NS} ns **/
export async function main(ns) {
    const CONFIG_PATH = "config/budget-config.txt";
    const bitNode = ns.getResetInfo().currentNode;

    // Default budget config
    let config = {
        reserve: 5e9,
        stock: 0.4,
        infra: 0.5,
        other: 0.1,
    };

    // BitNode-specific overrides
    switch (bitNode) {
        case 1: // Starter
            config = { reserve: 3e9, stock: 0.3, infra: 0.6, other: 0.1 }; break;
        case 2: // Company (no stock)
            config = { reserve: 5e9, stock: 0.0, infra: 0.9, other: 0.1 }; break;
        case 8: // Stock-focused
            config = { reserve: 1e9, stock: 0.7, infra: 0.2, other: 0.1 }; break;
        case 10: // Daedalus rush
            config = { reserve: 4e9, stock: 0.3, infra: 0.6, other: 0.1 }; break;
        default:
            ns.print("ℹ️ Using default budget config.");
            break;
    }

    try {
        await ns.write(CONFIG_PATH, JSON.stringify(config, null, 2), "w");
        ns.tprint(`✅ Applied budget config for BitNode-${bitNode}`);
        ns.print(`📁 Written to ${CONFIG_PATH}`);
        ns.print(`📊 Reserve: $${ns.formatNumber(config.reserve, "0.000a")}`);
        ns.print(`📈 Stock: ${config.stock * 100}%`);
        ns.print(`💻 Infra: ${config.infra * 100}%`);
        ns.print(`🔧 Other: ${config.other * 100}%`);
    } catch (err) {
        ns.tprint(`❌ Failed to write config: ${err}`);
    }
}
