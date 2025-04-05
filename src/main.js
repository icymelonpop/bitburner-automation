/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();
    ns.tprint("🚀 Launching main automation system...");

    // Utility to avoid re-running already active scripts
    function safeRun(script, args = []) {
        const isRunning = ns.ps("home").some(p => p.filename === script);
        if (!isRunning) {
            const pid = ns.run(script, 1, ...args);
            if (pid !== 0) {
                ns.print(`✅ Launched: ${script}`);
            } else {
                ns.print(`❌ Failed to launch: ${script}`);
            }
        } else {
            ns.print(`⏳ Already running: ${script}`);
        }
    }

    // Load optional feature toggle
    let toggle = {
        enableStock: true,
        enableFactionAutomation: true,
        enableEarlyHack: true,
        enableEndgame: true
    };

    if (ns.fileExists("config/feature-toggle.json")) {
        try {
            toggle = JSON.parse(ns.read("config/feature-toggle.json"));
        } catch (err) {
            ns.print("⚠️ Failed to parse config/feature-toggle.json, using defaults.");
        }
    }

    const bitNode = ns.getPlayer().bitNodeN;
    ns.tprint(`🧠 Running on BitNode-${bitNode}`);

    // 🧠 Core setup
    safeRun("core/network-mapper.js");
    safeRun("core/root-access.js");
    safeRun("core/target-selector.js");

    // ⚙️ Home RAM upgrade (early speed boost)
    safeRun("infra/home-upgrader.js");

    // 💻 Early RAM-safe hack loop
    if (toggle.enableEarlyHack) {
        safeRun("tools/early-hack.js");
    }

    // ⚔️ Batch hacking system
    safeRun("batch/schedule-distributor.js");

    // 🏛️ Faction automation
    if (toggle.enableFactionAutomation) {
        safeRun("factions/faction-manager.js");
        safeRun("factions/faction-worker.js");
    }

    // 📈 Stock trading (4S-aware)
    if (toggle.enableStock) {
        safeRun("stock/stock-bot.js");
    }

    // 🔁 Automation loop: infra, stock, deploy
    safeRun("auto-runner.js");

    // 🧩 Endgame: Daedalus & reset
    if (toggle.enableEndgame) {
        safeRun("endgame/daedalus-detector.js");
        safeRun("endgame/bitnode-reset.js");
    }

    ns.tprint("✅ All systems initialized successfully.");
}
