/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    if (!ns.gang || !ns.gang.inGang()) {
        // Try to create a gang if eligible
        const factions = ns.getPlayer().factions;
        const gangTypes = ["Slum Snakes", "NiteSec", "The Black Hand"];

        for (const faction of gangTypes) {
            if (factions.includes(faction) && ns.gang.canRecruitMember()) {
                if (ns.gang.createGang(faction.includes("NiteSec") ? "Hacking" : "Combat")) {
                    ns.toast(`🚨 Formed gang with ${faction}`, "success", 8000);
                    break;
                }
            }
        }

        if (!ns.gang.inGang()) {
            ns.print("❌ Not in a gang yet.");
            return;
        }
    }

    while (true) {
        const members = ns.gang.getMemberNames();

        // Recruit new members
        while (ns.gang.canRecruitMember()) {
            const name = `Ganger-${Math.floor(Math.random() * 10000)}`;
            if (ns.gang.recruitMember(name)) {
                ns.print(`👥 Recruited: ${name}`);
            }
        }

        // Assign task
        for (const member of members) {
            const stats = ns.gang.getMemberInformation(member);
            const task = stats.hack > stats.str ? "Train Hacking" : "Train Combat";
            ns.gang.setMemberTask(member, task);
        }

        await ns.sleep(60000);
    }
}
