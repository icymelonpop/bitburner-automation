/** Remote Setup Bootstrap
 *  Use this from Bitburner console:
 *  await import("https://raw.githubusercontent.com/Icymelonpop/bitburner-automation/main/bootstrap/remote-setup.js").then(m => m.main(ns));
 */

/** @param {NS} ns **/
export async function main(ns) {
    const file = "setup.js";
    const url = "https://raw.githubusercontent.com/Icymelonpop/bitburner-automation/main/setup.js";

    ns.tprint("🌐 Downloading setup.js...");
    const ok = await ns.wget(url, file);
    if (!ok) {
        ns.tprint("❌ Failed to download setup.js");
        return;
    }

    ns.tprint("✅ Downloaded setup.js. Executing...");
    ns.run(file);
}
