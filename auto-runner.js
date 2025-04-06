/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const fastInterval = 10000;  // 10s interval for first few loops
    const normalInterval = 60000; // 60s after warmup
    let fastLoops = 5;
    let loop = 0;

    ns.print("🔁 Starting auto-runner loop...");

    while (true) {
        loop++;
        ns.print(`⏱️ Loop ${loop} started...`);

        ns.run("src/infra/server-purchase.js");
        await ns.sleep(200);
        ns.run("src/infra/deploy-hack-to-slaves.js");
        await ns.sleep(200);
        ns.run("src/stock/stock-bot.js");
        await ns.sleep(200);

        // Dynamically slow down after a few fast iterations
        const sleepTime = loop < fastLoops ? fastInterval : normalInterval;
        await ns.sleep(sleepTime);
    }
}
