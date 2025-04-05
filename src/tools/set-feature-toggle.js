/** @param {NS} ns **/
export async function main(ns) {
    const file = "config/feature-toggle.json";

    if (ns.args.length !== 2) {
        ns.tprint("❌ Usage: run set-feature-toggle.js [feature] [true/false]");
        ns.tprint("📌 Example: run set-feature-toggle.js enableStock false");
        return;
    }

    const [feature, valueRaw] = ns.args;
    const value = valueRaw === "true";

    // Default structure
    let config = {
        enableStock: true,
        enableFactionAutomation: true,
        enableEarlyHack: true,
        enableEndgame: true
    };

    // Try loading existing file
    if (ns.fileExists(file)) {
        try {
            config = JSON.parse(ns.read(file));
        } catch {
            ns.tprint("⚠️ Failed to parse existing config. Using defaults.");
        }
    }

    // Check if feature exists
    if (!(feature in config)) {
        ns.tprint(`❌ Unknown feature: '${feature}'`);
        ns.tprint("📌 Available features: " + Object.keys(config).join(", "));
        return;
    }

    // Apply new value
    config[feature] = value;
    await ns.write(file, JSON.stringify(config, null, 2), "w");

    ns.tprint(`✅ Feature updated: ${feature} = ${value}`);
}
