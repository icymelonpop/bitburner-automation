/** @param {NS} ns **/
export async function main(ns) {
    const file = "config/feature-toggle.json";

    // 기본 설정
    let config = {
        enableStock: false,
        enableFactionAutomation: false,
        enableEarlyHack: true,
        enableEndgame: false
    };

    // 기존 설정 불러오기
    if (ns.fileExists(file)) {
        try {
            config = JSON.parse(ns.read(file));
        } catch {
            ns.print("⚠️ Failed to parse existing feature-toggle. Using default.");
        }
    }

    ns.tprint("🔄 Feature toggle scheduler started.");

    while (true) {
        const hackLevel = ns.getHackingLevel();
        const money = ns.getServerMoneyAvailable("home");
        const ram = ns.getServerMaxRam("home");

        let updated = false;

        // 조건: 해킹 레벨 500 이상이면 faction 자동화 ON
        if (hackLevel >= 500 && !config.enableFactionAutomation) {
            config.enableFactionAutomation = true;
            ns.print("🧠 [Toggle] enableFactionAutomation → true");
            updated = true;
        }

        // 조건: 10억 이상 자산이면 stock 자동화 ON
        if (money >= 1e9 && !config.enableStock) {
            config.enableStock = true;
            ns.print("💰 [Toggle] enableStock → true");
            updated = true;
        }

        // 조건: 홈 RAM 128GB 이상이면 endgame 루틴 ON
        if (ram >= 128 && !config.enableEndgame) {
            config.enableEndgame = true;
            ns.print("📈 [Toggle] enableEndgame → true");
            updated = true;
        }

        if (updated) {
            await ns.write(file, JSON.stringify(config, null, 2), "w");
            ns.tprint("✅ feature-toggle.json updated based on game state.");
        }

        await ns.sleep(60 * 1000); // 1분마다 체크
    }
}
