/** @param {NS} ns **/
import { getAvailableBudget } from "src/utils/money-manager.js";

export async function main(ns) {
    ns.disableLog("ALL");

    const fullBot = "src/stock/stock-full.js";
    const liteBot = "src/stock/stock-lite.js";

    // Prevent duplicate runs
    const isRunning = (script) =>
        ns.ps("home").some(p => p.filename === script);

    if (isRunning(fullBot) || isRunning(liteBot)) {
        ns.print("📌 Stock bot already running. Skipping launch.");
        return;
    }

    const has4S = ns.stock.has4SDataTIXAPI();
    const fourSCost = 1e9; // Approx cost for 4S API
    const budget = getAvailableBudget(ns, "stock");

    if (has4S || budget >= fourSCost) {
        if (!has4S) {
            ns.tprint("🛒 Purchasing 4S Market Data API...");
            const bought = ns.purchase4SMarketDataTixApi?.();
            if (!bought) {
                ns.print("❌ Failed to purchase 4S API. Falling back to lite.");
                ns.run(liteBot);
                return;
            }
            ns.toast("✅ 4S API purchased", "success", 5000);
            await ns.sleep(1000);
        }

        ns.tprint("📈 Launching stock-full.js");
        ns.run(fullBot);
    } else {
        ns.print("⚠️ 4S unavailable or not affordable. Launching lite version.");
        ns.run(liteBot);
    }
}
