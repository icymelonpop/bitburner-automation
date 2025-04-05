/** @param {NS} ns **/
export async function main(ns) {
    const joined = ns.getPlayer().factions;
    const preferred = ["Daedalus", "BitRunners", "NiteSec", "CyberSec"];

    const faction = preferred.find(f => joined.includes(f));
    if (!faction) {
        ns.print("⏳ No valid faction to work for yet.");
        return;
    }

    const workTypes = ["Hacking Contracts", "Security Work", "Field Work"];
    for (const work of workTypes) {
        const success = ns.workForFaction(faction, work, false);
        if (success) {
            ns.tprint(`💼 Working for ${faction} doing ${work}`);
            return;
        }
    }

    ns.print("⚠️ Could not start work for any faction.");
}
