import { getMoneyConfig } from "/src/utils/money-config.js";

export async function main(ns) {
    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    const config = {
        interval: 5000,       // Time between each loop (ms)
        historyLength: 5,     // Price history window
        minProfit: 0.10       // Minimum profit before selling
    };

    const priceHistory = {};

    // Update price history for a stock
    function updatePrice(symbol, price) {
        if (!priceHistory[symbol]) priceHistory[symbol] = [];
        priceHistory[symbol].push(price);
        if (priceHistory[symbol].length > config.historyLength) {
            priceHistory[symbol].shift();
        }
    }

    // Check if the stock price is trending upward
    function isUpwardTrend(symbol) {
        const history = priceHistory[symbol];
        return (
            history &&
            history.length === config.historyLength &&
            history[history.length - 1] > history[0]
        );
    }

    // Try to buy stock if conditions are met
    function tryBuy(symbol, moneyKeep, maxSharePercent) {
        const price = ns.stock.getPrice(symbol);
        if (price <= 0 || !isFinite(price)) return;

        updatePrice(symbol, price);

        const [shares] = ns.stock.getPosition(symbol);
        if (shares > 0) return; // Already holding

        if (!isUpwardTrend(symbol)) return;

        const available = ns.getServerMoneyAvailable("home") - moneyKeep;
        if (available < price) return;

        const maxShares = ns.stock.getMaxShares(symbol) * maxSharePercent;
        const quantity = Math.floor(Math.min(available / price, maxShares));
        if (quantity <= 0) return;

        const cost = ns.stock.buyStock(symbol, quantity);
        if (cost > 0) {
            ns.toast(`🟢 Bought ${symbol}: ${quantity} shares`, "success", 5000);
        }
    }

    // Try to sell stock if profit condition is met
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

    // Calculate total worth of owned stocks
    function calculateStockWorth() {
        let total = 0;
        for (const symbol of ns.stock.getSymbols()) {
            const [shares] = ns.stock.getPosition(symbol);
            const price = ns.stock.getPrice(symbol);
            total += shares * price;
        }
        return total;
    }

    // 🔁 Main loop
    while (true) {
        const { moneyKeep, maxSharePercent } = getMoneyConfig(ns);

        const symbols = ns.stock.getSymbols();
        for (const symbol of symbols) {
            trySell(symbol);
            tryBuy(symbol, moneyKeep, maxSharePercent);
        }

        // Display current finances
        const cash = ns.getServerMoneyAvailable("home");
        const stockWorth = calculateStockWorth();
        const netWorth = cash + stockWorth;

        ns.clearLog();
        ns.print("📉 Lite Stock Bot Active");
        ns.print("────────────────────────────");
        ns.print(`💰 Cash:      ${ns.formatNumber(cash, "$0.000a")}`);
        ns.print(`📈 Stock:     ${ns.formatNumber(stockWorth, "$0.000a")}`);
        ns.print(`🧾 Net Worth: ${ns.formatNumber(netWorth, "$0.000a")}`);
        ns.print(`⏱  Updated:   ${new Date().toLocaleTimeString()}`);

        await ns.sleep(config.interval);
    }
}
