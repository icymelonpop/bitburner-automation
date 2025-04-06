/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.clearLog();
    ns.ui.openTail();

    ns.tprint("🚀 Launching main automation system...");

    const bitNode = ns.getResetInfo().currentNode;
    ns.print(`🧠 Running on BitNode-${bitNode}`);

    // Load feature toggle config
    let toggle = {
        enableStock: true,
        enableFactionAutomation: true,
        enableEarlyHack: true,
        enableEndgame: true,
        enableCorpAutomation: true // New toggle (optional)
    };

    const toggleFile = "config/feature-toggle.json";
    if (ns.fileExists(toggleFile)) {
        try {
            toggle = JSON.parse(ns.read(toggleFile));
        } catch {
            ns.print(`⚠️ Failed to parse ${toggleFile}. Using defaults.`);
        }
    }

    // Utility: prevent duplicate script execution
    function safeRun(script, args = []) {
        const isRunning = ns.ps("home").some(p => p.filename === script);
        if (isRunning) {
            ns.print(`⏳ Already running: ${script}`);
            return;
        }

        const pid = ns.run(script, 1, ...args);
        ns.print(pid !== 0
            ? `✅ Launched: ${script}`
            : `❌ Failed to launch: ${script}`);
    }

    // 🧠 Core modules
    safeRun("src/core/network-mapper.js");
    safeRun("src/core/root-access.js");
    safeRun("src/core/target-selector.js");

    // 💻 Home RAM upgrades
    safeRun("src/infra/home-upgrader.js");

    // ⏱️ Wait until targets.txt exists
    while (!ns.fileExists("config/targets.txt")) {
        ns.print("⏳ Waiting for targets.txt...");
        await ns.sleep(1000);
    }

    // 💻 Deploy self-hack strategy after targets.txt is ready
    safeRun("src/infra/deploy-self-hack.js");

    // 🐣 Early RAM-safe fallback (optional)
    if (toggle.enableEarlyHack) {
        safeRun("src/tools/early-hack.js");
    }

    // ⚔️ Batch scheduler (HWGW)
    safeRun("src/batch/schedule-distributor.js");

    // 🏛️ Faction logic
    if (toggle.enableFactionAutomation) {
        safeRun("src/factions/faction-manager.js");
        safeRun("src/factions/faction-worker.js");
    }

    // 💹 Stock trading logic (4S auto-detection inside bot)
    if (toggle.enableStock) {
        safeRun("src/stock/stock-bot.js");
    }

    // 🏢 Corporation automation (BitNode-3 only)
    if (bitNode === 3 && toggle.enableCorpAutomation) {
        safeRun("src/corp/corp-manager.js");
    }

    // 🔁 Background loop: infra scaling + stock rebalance
    safeRun("auto-runner.js");

    // 🧩 Endgame logic: Daedalus unlock, BitNode reset
    if (toggle.enableEndgame) {
        safeRun("src/endgame/daedalus-detector.js");
        safeRun("src/endgame/bitnode-reset.js");
    }

    ns.tprint("✅ All systems initialized successfully.");
}
