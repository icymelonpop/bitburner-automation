/** @param {NS} ns **/
export async function main(ns) {
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
        "src/infra/deploy-hack-to-slaves.js",
        "src/infra/home-upgrader.js",

        // Batch
        "src/batch/hwgw-scheduler.js",
        "src/batch/schedule-distributor.js",

        // Actions & Strategies
        "src/actions/hack.js",
        "src/actions/grow.js",
        "src/actions/weaken.js",
        "src/strategies/smart-hack.js",

        // Stock
        "src/stock/stock-bot.js",
        "src/stock/stock-full.js",
        "src/stock/stock-lite.js",
        "src/stock/stock-logger.js",

        // Factions
        "src/factions/faction-manager.js",
        "src/factions/faction-worker.js",

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

        // Main runners
        "main.js",
        "auto-runner.js",

        // Config files
        "src/config/factions.txt"
    ];

    // Function to download files in parallel
    async function downloadFiles(files) {
        const downloadPromises = files.map(file => ns.wget(baseUrl + file, file));
        await Promise.all(downloadPromises);
    }

    // Download all files in parallel
    await downloadFiles(filesToDownload);

    ns.tprint("✅ All files downloaded successfully");

    // Apply BitNode-specific config
    await ns.run("src/tools/apply-bitnode-config.js");
    await ns.sleep(500);

    // Launch main automation script
    ns.tprint("🚀 Launching automation via main.js...");
    ns.run("main.js");
}
