/** @param {NS} ns **/
export async function main(ns) {
    const factionListFile = "config/factions.txt";
    if (!ns.fileExists(factionListFile)) {
        ns.tprint("❌ Missing factions.txt");
        return;
    }

    const preferredFactions = ns.read(factionListFile).split("\n").map(f => f.trim()).filter(Boolean);
    const invitations = ns.checkFactionInvitations();

    for (const faction of preferredFactions) {
        if (invitations.includes(faction)) {
            const joined = ns.joinFaction(faction);
            if (joined) {
                ns.tprint(`✅ Joined faction: ${faction}`);
                return;
            } else {
                ns.print(`⚠️ Failed to join faction: ${faction}`);
            }
        }
    }

    ns.print("📭 No joinable factions found.");
}
