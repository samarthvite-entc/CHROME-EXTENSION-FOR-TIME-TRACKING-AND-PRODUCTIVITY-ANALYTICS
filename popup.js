const productiveSites = ["github.com", "leetcode.com", "stackoverflow.com"];
const unproductiveSites = ["instagram.com", "facebook.com", "youtube.com"];

chrome.storage.local.get(null, data => {
    let statsDiv = document.getElementById("stats");
    let productive = 0, unproductive = 0;

    for (let site in data) {
        let minutes = Math.floor(data[site] / 60);
        statsDiv.innerHTML += `<p>${site}: ${minutes} min</p>`;

        if (productiveSites.includes(site)) productive += minutes;
        else if (unproductiveSites.includes(site)) unproductive += minutes;
    }

    statsDiv.innerHTML += `<hr>
        <p>🟢 Productive: ${productive} min</p>
        <p>🔴 Unproductive: ${unproductive} min</p>`;
});

document.getElementById("dashboardBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000" });
});
