/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const baseUrl = "https://raw.githubusercontent.com/Icymelonpop/bitburner-automation/main/";

    const filesToDownload = [
        // Core
        "src/core/network-mapper.js",
        "src/core/root-access.js",
        "src/core/target-selector.js",

        // Infrastructure
        "src/infra/server-purchase.js",
        "src/infra/server-upgrader.js",
        "src/infra/server-cleaner.js",
        "src/infra/show-purchased-servers.js",
        "src/infra/deploy-self-hack.js",
        "src/infra/deploy-hack-to-slaves.js",
        "src/infra/home-upgrader.js",

        // Batch
        "src/batch/hwgw-scheduler.js",
        "src/batch/schedule-distributor.js",

        // Actions & Strategies
        "src/actions/hack.js",
        "src/actions/grow.js",
        "src/actions/weaken.js",
        "src/strategies/self-hack.js",
        "src/strategies/smart-hack.js",

        // Stock
        "src/stock/stock-bot.js",
        "src/stock/stock-full.js",
        "src/stock/stock-lite.js",
        "src/stock/stock-logger.js",
        "src/stock/sell-all.js",

        // Factions
        "src/factions/faction-manager.js",
        "src/factions/faction-worker.js",
        "src/factions/augmentation-buyer.js",

        // Endgame
        "src/endgame/daedalus-detector.js",
        "src/endgame/bitnode-reset.js",

        // Tools
        "src/tools/apply-bitnode-config.js",
        "src/tools/early-hack.js",
        "src/tools/set-feature-toggle.js",
        "src/tools/feature-toggle-scheduler.js",

        // Utilities
        "src/utils/money-manager.js",
        "src/utils/money-config.js",

        // Corporation (BitNode-3)
        "src/corp/corp-manager.js",

        // Main runners
        "main.js",
        "auto-runner.js",

        // Config files
        "config/budget-config.txt",
        "config/factions.txt",
        "config/early-targets.txt",
        "config/feature-toggle.json"
    ];

    // 🛠 Extract folders and create dummy file to ensure directory structure
    const folders = new Set(filesToDownload.map(path => path.substring(0, path.lastIndexOf("/"))));
    for (const folder of folders) {
        try {
            await ns.write(`${folder}/placeholder.txt`, "// folder init", "w");
        } catch (e) {
            ns.print(`⚠️ Failed to create ${folder}/placeholder.txt: ${e.message}`);
        }
    }

    // 🔽 Download files concurrently
    const failed = [];
    const downloads = filesToDownload.map(async file => {
        const success = await ns.wget(baseUrl + file, file);
        if (!success) {
            ns.tprint(`✖ Failed to download: ${file}`);
            failed.push(file);
        } else {
            ns.print(`✔ Downloaded: ${file}`);
        }
    });

    await Promise.all(downloads);

    if (failed.length > 0) {
        ns.tprint(`❌ ${failed.length} file(s) failed to download:`);
        for (const file of failed) ns.tprint(`   - ${file}`);
        ns.tprint("⚠️ Setup incomplete. Please check errors.");
        return;
    }

    ns.tprint("✅ All files downloaded successfully");

    // ⚙️ Apply BitNode budget config
    const configPid = ns.run("src/tools/apply-bitnode-config.js");
    if (configPid !== 0) {
        await ns.sleep(500);
    }

    // 🚀 Launch main system
    ns.tprint("🚀 Launching automation via main.js...");
    ns.run("main.js");
}
