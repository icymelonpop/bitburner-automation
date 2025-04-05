/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();

    const stock4SAPI = "4SMarketDataTixApi";
    const fullBot = "stock/stock-full.js";
    const liteBot = "stock/stock-lite.js";

    const checkIfRunning = (script) =>
        ns.ps("home").some(p => p.filename === script);

    // If already running, do not start another
    if (checkIfRunning(fullBot) || checkIfRunning(liteBot)) {
        ns.print("📌 Stock bot already running. Exiting launcher.");
        return;
    }

    const has4S = ns.stock.has4SDataTIXAPI();

    if (has4S) {
        // 4S is already available
        ns.print("✅ 4S Market API available. Launching full bot...");
        ns.run(fullBot);
    } else {
        // Try to purchase 4S if not owned
        const cost = ns.getUpgradeCost(stock4SAPI);
        const money = ns.getServerMoneyAvailable("home");

        if (cost !== -1 && money >= cost) {
            const success = ns.purchaseUpgrade(stock4SAPI);
            if (success) {
                ns.toast("🛒 Purchased 4S Market Data API", "success", 8000);
                await ns.sleep(1000); // wait before launching full bot
                ns.run(fullBot);
                return;
            }
        }

        // Fallback to lite bot
        ns.print("⚠️ 4S not available or insufficient funds. Launching lite bot...");
        ns.run(liteBot);
    }
}
