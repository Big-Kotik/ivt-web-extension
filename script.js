let state = localStorage.getItem('state');

if (state === null) {
    state = "Connected";
}

let over = false;

function syncState() {
    const button = document.getElementById("button");
    const text = document.getElementById("text");

    if (state === "Disconnected") {
        text.innerHTML = "Disconnected";
        if (over) {
            button.style.backgroundColor = "#b11f16";
        } else {
            button.style.backgroundColor = "#cf241a";
        }
    } else {
        text.innerHTML = "Connected";
        if (over) {
            button.style.backgroundColor = "#19be00";
        } else {
            button.style.backgroundColor = "#1ccf00";
        }
    }
}

function changeState() {
    const button = document.getElementById("button");

    if (state === "Connected") {
        state = "Disconnected";
        chrome.proxy.settings.set({value: {mode: "direct"}, scope: "regular"}, function() {});
    } else {
        state = "Connected";

        const proxyConfig = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: "localhost",
                    port: 8080
                }
            }
        }

        chrome.proxy.settings.set(
            {value: proxyConfig, scope: 'regular'},
            function() {}
        );
    }

    syncState();

    localStorage.setItem('state', state);
}

window.onload = function() {
    syncState();

    const button = document.getElementById("button");
    button.addEventListener("click", changeState);
}

document.getElementById("button").addEventListener('mouseover', (event) => {
    over = true;
    syncState();
});

document.getElementById("button").addEventListener('mouseout', (event) => {
    over = false;
    syncState();
});
