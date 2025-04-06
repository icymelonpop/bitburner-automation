/** @param {NS} ns **/
export async function main(ns) {
    const bitNode = ns.getResetInfo().currentNode;

    // Default budget configuration
    let config = {
        reserve: 5e9,  // money to keep
        stock: 0.4,    // % of funds to allocate to stock system
        infra: 0.5,    // % to servers, upgrades, etc.
        other: 0.1     // other uses (scripts, etc.)
    };

    // BitNode-specific overrides
    switch (bitNode) {
        case 1: // Starter node
            config = { reserve: 3e9, stock: 0.3, infra: 0.6, other: 0.1 }; break;
        case 2: // Company node (no stock)
            config = { reserve: 5e9, stock: 0.0, infra: 0.9, other: 0.1 }; break;
        case 8: // Stock-focused
            config = { reserve: 1e9, stock: 0.7, infra: 0.2, other: 0.1 }; break;
        case 10: // Daedalus focus
            config = { reserve: 4e9, stock: 0.3, infra: 0.6, other: 0.1 }; break;
        default:
            // Use default config above
            break;
    }

    await ns.write("config/budget-config.txt", JSON.stringify(config, null, 2), "w");
    ns.tprint(`✅ Applied budget config for BitNode-${bitNode}`);
}
