/** @param {NS} ns **/
export async function main(ns) {
    const baseUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-autoscripts/main/";
    const files = [
        "master.js",
        "auto/scanner.js",
        "auto/targetSelector.js",
        "auto/hackDistributor.js",
        "auto/smartHack.js"
    ];

    for (const file of files) {
        const url = baseUrl + file;
        await ns.wget(url, file);
        ns.tprint(`📦 다운로드: ${file}`);
        await ns.sleep(200);
    }

    ns.tprint("✅ 전체 설치 완료! 시작합니다...");
    ns.run("master.js");
}
