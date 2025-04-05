/** @param {NS} ns **/
export async function main(ns) {
    const config = {
        interval: 5000,               // Time between each loop (ms)
        moneyKeep: 10e9,              // Minimum money to keep in reserve
        maxSharePercent: 1.0,         // Max percentage of shares to buy
        minProfit: 0.10,              // Sell if profit exceeds 10%
        historyLength: 5              // Price history length for trend detection
    };

    ns.disableLog("ALL");
    ns.tail();

    const priceHistory = {};

    // Update price history for a symbol
    function updatePrice(symbol, price) {
        if (!priceHistory[symbol]) priceHistory[symbol] = [];
        priceHistory[symbol].push(price);
        if (priceHistory[symbol].length > config.historyLength) {
            priceHistory[symbol].shift();
        }
    }

    // Check if price is trending upward
    function isUpwardTrend(symbol) {
        const history = priceHistory[symbol];
        return (
            history &&
            history.length === config.historyLength &&
            history[history.length - 1] > history[0]
        );
    }

    // Attempt to buy stock based on price trend
    function tryBuy(symbol) {
        const price = ns.stock.getPrice(symbol);
        if (price <= 0 || !isFinite(price)) return;

        updatePrice(symbol, price);

        const [shares] = ns.stock.getPosition(symbol);
        if (shares > 0) return;

        if (!isUpwardTrend(symbol)) return;

        const available = ns.getPlayer().money - config.moneyKeep;
        if (available < price) return;

        const maxShares = ns.stock.getMaxShares(symbol) * config.maxSharePercent;
        const quantity = Math.floor(Math.min(available / price, maxShares));
        if (quantity <= 0) return;

        const cost = ns.stock.buyStock(symbol, quantity);
        if (cost > 0) {
            ns.toast(`🟢 Bought ${symbol}: ${quantity} shares`, "success", 5000);
        }
    }

    // Attempt to sell if profit is above threshold
    function trySell(symbol) {
        const [shares, avgPrice] = ns.stock.getPosition(symbol);
        if (shares <= 0) return;

        const currentPrice = ns.stock.getPrice(symbol);
        const profitRatio = (currentPrice - avgPrice) / avgPrice;

        if (profitRatio >= config.minProfit) {
            ns.stock.sellStock(symbol, shares);
            ns.toast(`🔴 Sold ${symbol}: ${shares} shares (+${(profitRatio * 100).toFixed(1)}%)`, "success", 5000);
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
