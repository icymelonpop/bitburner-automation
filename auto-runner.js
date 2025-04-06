/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const warmupInterval = 10_000;   // Fast loop during warmup phase
    const standardInterval = 60_000; // Normal loop delay after warmup
    const warmupLoops = 5;
    let loop = 0;

    ns.print("🔁 Auto-runner initialized...");

    // Utility: Prevent duplicate execution
    function safeRun(script, args = []) {
        const alreadyRunning = ns.ps("home").some(p => p.filename === script);
        if (alreadyRunning) {
            ns.print(`⏳ Already running: ${script}`);
            return;
        }

        const pid = ns.run(script, 1, ...args);
        if (pid !== 0) {
            ns.print(`✅ Running ${script} (PID ${pid})`);
        } else {
            ns.print(`❌ Failed to run ${script}`);
        }
    }

    while (true) {
        loop++;
        ns.print(`⏱️ Auto-loop #${loop} starting...`);

        safeRun("src/infra/server-purchase.js");
        await ns.sleep(200);

        safeRun("src/infra/server-upgrader.js");
        await ns.sleep(200);

        safeRun("src/infra/home-upgrader.js");
        await ns.sleep(200);

        safeRun("src/infra/deploy-hack-to-slaves.js");
        await ns.sleep(200);

        safeRun("src/stock/stock-bot.js");
        await ns.sleep(200);

        const interval = loop < warmupLoops ? warmupInterval : standardInterval;
        await ns.sleep(interval);
    }
}
