/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

    const servers = scanAll(ns);
    let solved = 0;

    for (const server of servers) {
        const contracts = ns.ls(server, ".cct");
        for (const file of contracts) {
            const type = ns.codingcontract.getContractType(file, server);
            const data = ns.codingcontract.getData(file, server);

            const answer = solve(type, data);
            if (answer == null) {
                ns.print(`❌ Unsupported type: ${type} @ ${server}`);
                continue;
            }

            const reward = ns.codingcontract.attempt(answer, file, server, { returnReward: true });
            if (reward) {
                ns.tprint(`🎉 Solved [${type}] on ${server}: ${reward}`);
                solved++;
            } else {
                ns.print(`⚠️ Failed attempt on ${file} @ ${server}`);
            }
        }
    }

    if (solved === 0) {
        ns.tprint("📭 No solvable contracts found.");
    }
}

// Solve logic (limited example)
function solve(type, data) {
    switch (type) {
        case "Find Largest Prime Factor":
            return largestPrime(data);
        default:
            return null;
    }
}

function largestPrime(n) {
    let factor = 2;
    while (factor <= n) {
        if (n % factor === 0) {
            n /= factor;
        } else {
            factor++;
        }
    }
    return factor;
}

function scanAll(ns, host = "home", visited = new Set()) {
    visited.add(host);
    for (const next of ns.scan(host)) {
        if (!visited.has(next)) scanAll(ns, next, visited);
    }
    return [...visited];
}
