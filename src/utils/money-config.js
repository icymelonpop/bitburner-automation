export function getMoneyConfig(ns) {
    const money = ns.getServerMoneyAvailable("home");
    const bitNode = ns.getResetInfo().currentNode;
    const has4S = ns.stock.has4SDataTIXAPI();
    const hackLevel = ns.getHackingLevel();
    const timePlayed = ns.getTimeSinceLastAug();

    // Default reserve ratio and limits
    let reserveRatio = 0.05;
    let minKeep = 100e6;
    let maxKeep = 30e9;

    // Disable stock if BitNode-2 (no stock support)
    const stockEnabled = bitNode !== 2;

    // Adjust based on available money
    if (money < 1e9) {
        reserveRatio = 0.01;
        minKeep = 10e6;
    } else if (money > 100e9) {
        reserveRatio = 0.1;
    }

    // More aggressive spending if hacking level is low
    if (hackLevel < 200) {
        reserveRatio *= 0.5;
    }

    // Expand reserve if playing for a long time
    if (timePlayed > 60 * 60 * 1000) { // 1 hour
        reserveRatio += 0.02;
    }

    // Final reserve money amount
    const moneyKeep = Math.max(minKeep, Math.min(maxKeep, money * reserveRatio));

    // Stock configuration (based on 4S access)
    const buyThreshold = has4S ? 0.6 : 0.58;
    const sellThreshold = has4S ? 0.55 : 0.52;
    const maxSharePercent = has4S ? 1.0 : 0.3;

    return {
        moneyKeep,
        buyThreshold,
        sellThreshold,
        maxSharePercent,
        stockEnabled
    };
}
