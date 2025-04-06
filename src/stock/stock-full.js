import { getMoneyConfig } from "utils/money-config.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    let config = getMoneyConfig(ns);

    function shouldBuy(symbol) {
        const forecast = ns.stock.getForecast(symbol);
        const volatility = ns.stock.getVolatility(symbol);
        return forecast >= config.buyThreshold && volatility <= config.volatilityLimit;
    }

    // Check if the stock should be sold
    function shouldSell(symbol, avgPrice) {
        const forecast = ns.stock.getForecast(symbol);
        const bidPrice = ns.stock.getBidPrice(symbol);
        const profitRatio = (bidPrice - avgPrice) / avgPrice;

        return forecast < config.sellThreshold || profitRatio >= config.minProfitPercent;
    }

    // Attempt to buy stock
    function tryBuy(symbol) {
        if (!shouldBuy(symbol)) return;

        const [shares] = ns.stock.getPosition(symbol);
        if (shares > 0) return;

        const availableMoney = ns.getPlayer().money - config.moneyKeep;
        if (availableMoney <= 0) return;

        const askPrice = ns.stock.getAskPrice(symbol);
        const maxShares = ns.stock.getMaxShares(symbol) * config.maxSharePercent;
        const quantity = Math.floor(Math.min(availableMoney / askPrice, maxShares));

        if (quantity <= 0) return;

        const cost = ns.stock.buyStock(symbol, quantity);
        if (cost > 0) {
            ns.toast(`🟢 Bought ${symbol}: ${quantity} shares`, "success", 5000);
        }
    }

    // Attempt to sell stock
    function trySell(symbol) {
        const [shares, avgPrice] = ns.stock.getPosition(symbol);
        if (shares <= 0) return;

        if (shouldSell(symbol, avgPrice)) {
            const bidPrice = ns.stock.getBidPrice(symbol);
            const revenue = ns.stock.sellStock(symbol, shares);
            const profit = (bidPrice - avgPrice) * shares;
            ns.toast(`🔴 Sold ${symbol}: $${ns.formatNumber(profit, "0.000a")}`, "success", 5000);
        }
    }

    function calculateTotalStockWorth() {
        let total = 0;
        for (const symbol of ns.stock.getSymbols()) {
            const [longShares, , shortShares,] = ns.stock.getPosition(symbol);
            const price = ns.stock.getBidPrice(symbol);
            total += (longShares + shortShares) * price;
        }
        return total;
    }

    // 🔁 Main loop
    while (true) {
        config = getMoneyConfig(ns); // ⏱ Refresh config dynamically every loop

        const symbols = ns.stock.getSymbols();

        for (const symbol of symbols) {
            trySell(symbol);
            tryBuy(symbol);
        }

        const cash = ns.getPlayer().money;
        const stockWorth = calculateTotalStockWorth();
        const netWorth = cash + stockWorth;

        ns.clearLog();
        ns.print("💹 Stock Bot Active");
        ns.print("────────────────────────────");
        ns.print(`💰 Cash:      ${ns.formatNumber(cash, "$0.000a")}`);
        ns.print(`📈 Stock:     ${ns.formatNumber(stockWorth, "$0.000a")}`);
        ns.print(`🧾 Net Worth: ${ns.formatNumber(netWorth, "$0.000a")}`);
        ns.print(`⏱  Updated:   ${new Date().toLocaleTimeString()}`);

        await ns.sleep(config.interval);
    }
}
