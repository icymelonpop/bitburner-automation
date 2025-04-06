/** @param {NS} ns **/
export async function main(ns) {
    const joinedFactions = ns.getPlayer().factions;
    const configFile = "config/factions.txt";

    let preferredFactions = [
        "Daedalus", "BitRunners", "NiteSec", "CyberSec"
    ];

    if (ns.fileExists(configFile)) {
        const raw = ns.read(configFile);
        preferredFactions = raw.split("\n").map(f => f.trim()).filter(f => f);
    }

    const factionToWork = preferredFactions.find(f => joinedFactions.includes(f));
    if (!factionToWork) {
        ns.print("⏳ No valid faction found to work for.");
        return;
    }

    const workOptions = ["Field Work", "Hacking Contracts", "Security Work"];

    for (const workType of workOptions) {
        const success = ns.workForFaction(factionToWork, workType, false);
        if (success) {
            ns.tprint(`💼 Working for ${factionToWork} - ${workType}`);
            return;
        }
    }

    ns.print(`⚠️ Unable to start work for ${factionToWork}.`);
}
