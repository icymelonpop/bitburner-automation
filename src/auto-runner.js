/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();
    ns.tprint("🔁 Starting auto-runner loop...");

    // Safe script launcher (prevents duplicate execution)
    function safeRun(script, args = []) {
        const running = ns.ps("home").some(p => p.filename === script);
        if (!running) {
            const pid = ns.run(script, 1, ...args);
            if (pid !== 0) {
                ns.print(`✅ Launched: ${script}`);
            } else {
                ns.print(`❌ Failed to launch: ${script}`);
            }
        } else {
            ns.print(`⏳ Already running: ${script}`);
        }
    }

    while (true) {
        // 🖥️ Purchase servers if possible
        safeRun("infra/server-purchase.js");
        await ns.sleep(200);

        // 🚀 Deploy smart-hack to purchased servers
        safeRun("infra/deploy-hack-to-slaves.js");
        await ns.sleep(200);

        // 📈 Launch dynamic stock bot (auto handles 4S or lite fallback)
        safeRun("stock/stock-bot.js");
        await ns.sleep(200);

        // Wait before next cycle
        await ns.sleep(60 * 1000); // 1 minute loop
    }
}
