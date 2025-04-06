/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const symbols = ns.stock.getSymbols();
    let soldCount = 0;
    let totalProfit = 0;

    for (const symbol of symbols) {
        const [longShares, avgLong, shortShares, avgShort] = ns.stock.getPosition(symbol);
        const price = ns.stock.getPrice(symbol);

        // Sell long position
        if (longShares > 0) {
            const revenue = ns.stock.sellStock(symbol, longShares);
            const profit = (price - avgLong) * longShares;
            ns.print(`🔴 Sold long ${symbol}: ${longShares} shares | Profit: ${ns.nFormat(profit, "$0.000a")}`);
            totalProfit += profit;
            soldCount++;
        }

        // Sell short position
        if (shortShares > 0) {
            const revenue = ns.stock.sellShort(symbol, shortShares);
            const profit = (avgShort - price) * shortShares;
            ns.print(`🔴 Sold short ${symbol}: ${shortShares} shares | Profit: ${ns.nFormat(profit, "$0.000a")}`);
            totalProfit += profit;
            soldCount++;
        }

        await ns.sleep(100);
    }

    if (soldCount > 0) {
        ns.tprint(`✅ Sold ${soldCount} stock position(s)`);
        ns.tprint(`💰 Total profit: ${ns.nFormat(totalProfit, "$0.000a")}`);
    } else {
        ns.print("📭 No stock positions to sell.");
    }
}
