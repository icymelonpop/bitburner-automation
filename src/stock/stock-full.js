/** @param {NS} ns **/
export async function main(ns) {
    const config = {
        interval: 5000,              // Time between each loop (ms)
        moneyKeep: 20e9,             // Minimum money to keep in reserve
        buyThreshold: 0.6,           // Forecast threshold for buying long
        sellThreshold: 0.55,         // Forecast threshold for selling long
        volatilityLimit: 0.05,       // Max allowed volatility
        maxSharePercent: 1.0,        // Max percentage of available shares to buy
        minProfitPercent: 0.15       // Minimum profit ratio before forced sell
    };

    ns.disableLog("ALL");
    ns.tail();

    // Check if this stock is a good candidate for buying
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
        if (shares > 0) return; // Already holding

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

            ns.toast(`🔴 Sold ${symbol}: $${ns.nFormat(profit, "$0.000a")}`, "success", 5000);
        }
    }

    // Main loop
    while (true) {
        const symbols = ns.stock.getSymbols();

        for (const symbol of symbols) {
            trySell(symbol);
            tryBuy(symbol);
        }

        await ns.sleep(config.interval);
    }
}
