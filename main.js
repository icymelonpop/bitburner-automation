/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.ui.openTail();
    ns.tprint("🚀 Launching main automation system...");

    // Utility to avoid re-running already active scripts
    function safeRun(script, args = []) {
        const isRunning = ns.ps("home").some(p => p.filename === script);
        if (!isRunning) {
            const pid = ns.run(script, 1, ...args);
            ns.print(pid !== 0
                ? `✅ Launched: ${script}`
                : `❌ Failed to launch: ${script}`
            );
        } else {
            ns.print(`⏳ Already running: ${script}`);
        }
    }

    // Load feature toggles
    let toggle = {
        enableStock: true,
        enableFactionAutomation: true,
        enableEarlyHack: true,
        enableEndgame: true
    };

    if (ns.fileExists("config/feature-toggle.json")) {
        try {
            toggle = JSON.parse(ns.read("config/feature-toggle.json"));
        } catch {
            ns.print("⚠️ Failed to parse config/feature-toggle.json. Using defaults.");
        }
    }

    const bitNode = ns.getResetInfo().currentNode;
    ns.tprint(`🧠 Running on BitNode-${bitNode}`);

    // 🧠 Core setup
    safeRun("src/core/network-mapper.js");
    safeRun("src/core/root-access.js");
    safeRun("src/core/target-selector.js");

    // ⚙️ Home RAM upgrade
    safeRun("src/infra/home-upgrader.js");

    // 💻 Early hack loop
    if (toggle.enableEarlyHack) {
        safeRun("src/tools/early-hack.js");
    }

    // ⚔️ Batch hacking system
    safeRun("src/batch/schedule-distributor.js");

    // 🏛️ Faction automation
    if (toggle.enableFactionAutomation) {
        safeRun("src/factions/faction-manager.js");
        safeRun("src/factions/faction-worker.js");
    }

    // 📈 Stock system
    if (toggle.enableStock) {
        safeRun("src/stock/stock-bot.js");
    }

    // 🔁 Infra loop
    safeRun("auto-runner.js");

    // 🧩 Endgame logic
    if (toggle.enableEndgame) {
        safeRun("src/endgame/daedalus-detector.js");
        safeRun("src/endgame/bitnode-reset.js");
    }

    ns.tprint("✅ All systems initialized successfully.");
}
