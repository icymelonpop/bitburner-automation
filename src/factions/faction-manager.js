/** @param {NS} ns **/
export async function main(ns) {
    const factionListFile = "config/factions.txt";

    // Load preferred faction list
    if (!ns.fileExists(factionListFile)) {
        ns.tprint("❌ Missing config/factions.txt");
        return;
    }

    const preferred = ns.read(factionListFile)
        .split("\n")
        .map(f => f.trim())
        .filter(Boolean);

    const invitations = ns.checkFactionInvitations();

    if (invitations.length === 0) {
        ns.print("📭 No faction invitations available.");
        return;
    }

    for (const faction of preferred) {
        if (invitations.includes(faction)) {
            const success = ns.joinFaction(faction);
            if (success) {
                ns.tprint(`✅ Joined faction: ${faction}`);
                return;
            } else {
                ns.print(`⚠️ Failed to join faction: ${faction}`);
            }
        }
    }

    ns.print("📭 No preferred factions matched current invitations.");
}
