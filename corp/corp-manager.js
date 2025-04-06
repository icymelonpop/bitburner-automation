/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    if (!ns.corporation) {
        ns.tprint("❌ Corporation API not available.");
        return;
    }

    const bitNode = ns.getResetInfo().currentNode;
    if (bitNode !== 3) {
        ns.print("⚠️ Not BitNode-3. Skipping corporation automation.");
        return;
    }

    if (!ns.corporation.hasCorporation()) {
        if (ns.getPlayer().money >= 150e9) {
            ns.toast("🏢 Creating Corporation...", "info", 6000);
            ns.corporation.createCorporation("BitAutoCorp", false);
        } else {
            ns.print("💸 Waiting for funds to start corporation...");
            return;
        }
    }

    const corp = ns.corporation.getCorporation();

    // Example: Expand to Agriculture, upgrade
    if (!corp.divisions.some(d => d.name === "Agri")) {
        ns.corporation.expandIndustry("Agriculture", "Agri");
        ns.corporation.purchaseUpgrade("Smart Supply", 1);
        ns.toast("🌾 Agri division created", "success", 5000);
    }

    // TODO: Add office upgrade, smart supply enable, product sales, investment management, etc.
    ns.print("✅ Corporation routine complete.");
}
