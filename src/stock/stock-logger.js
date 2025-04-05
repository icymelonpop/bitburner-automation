/** @param {NS} ns **/
export async function main(ns) {
    const logFile = "logs/stock-log.txt";   // Output file path
    const interval = 60 * 1000;              // 1 minute

    ns.disableLog("ALL");

    while (true) {
        let totalStockValue = 0;
        const symbols = ns.stock.getSymbols();

        // Sum all current long stock holdings
        for (const sym of symbols) {
            const [shares] = ns.stock.getPosition(sym);
            const price = ns.stock.getBidPrice(sym);
            totalStockValue += shares * price;
        }

        const cash = ns.getServerMoneyAvailable("home");
        const total = cash + totalStockValue;
        const timestamp = new Date().toLocaleString();

        const line = `[${timestamp}] Stocks: ${ns.nFormat(totalStockValue, "$0.000a")} | Cash: ${ns.nFormat(cash, "$0.000a")} | Total: ${ns.nFormat(total, "$0.000a")}`;

        // Append line to log file
        await ns.write(logFile, line + "\n", "a");
        ns.print(line);

        await ns.sleep(interval);
    }
}
