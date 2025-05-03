const urlParams = new URLSearchParams(window.location.search);


// Add CSS for transitions to the head
document.addEventListener("DOMContentLoaded", () => {
    // Add transition styles
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        body, header, footer, .card, .list-group-item, .nav-link, .btn {
            transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
        }
    `;
    document.head.appendChild(styleElement);
    const header = document.querySelector("header");
    const darkModeBtn = document.createElement("button");
    darkModeBtn.className = "btn btn-sm btn-outline-light position-absolute top-0 end-0 m-3";
    darkModeBtn.id = "darkModeToggle";
    darkModeBtn.innerHTML = '<i class="bi bi-moon"></i> Dark Mode';
    header.style.position = "relative";
    header.appendChild(darkModeBtn);

    // Add Bootstrap Icons link
    const iconLink = document.createElement("link");
    iconLink.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css";
    iconLink.rel = "stylesheet";
    document.head.appendChild(iconLink);

    if (urlParams.get("darkMode") === null) {
        // First check for saved user preference
        const savedPreference = localStorage.getItem("darkMode");

        // If no saved preference, use system preference
        if (savedPreference === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                enableDarkMode();
            }
        } else {
            // Otherwise use saved preference
            if (savedPreference === "true") {
                enableDarkMode();
            }
        }
    } else {
        if (urlParams.get("DarkMode") === "true") {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    // Toggle dark/light mode
    darkModeBtn.addEventListener("click", () => {
        if (document.body.classList.contains("bg-dark")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        // Body and main elements
        document.body.classList.replace("bg-light", "bg-dark");
        document.body.classList.replace("text-dark", "text-light");
        document.querySelector("header").classList.replace("bg-secondary", "bg-dark");
        document.querySelector("footer").classList.replace("bg-light", "bg-dark");

        // Nav tabs and content
        const navTabs = document.querySelectorAll(".nav-tabs .nav-link:not(.active)");
        navTabs.forEach(tab => {
            tab.classList.add("text-light");
            tab.style.borderColor = "#495057";
        });

        // Change button styling
        darkModeBtn.innerHTML = '<i class="bi bi-sun"></i> Light Mode';
        darkModeBtn.classList.replace("btn-outline-light", "btn-outline-warning");

        document.getElementById("Link").href += "?darkMode=true";

        // Store preference
        localStorage.setItem("darkMode", "true");
    }

    function disableDarkMode() {
        // Body and main elements
        document.body.classList.replace("bg-dark", "bg-light");
        document.body.classList.replace("text-light", "text-dark");
        document.querySelector("header").classList.replace("bg-dark", "bg-secondary");
        document.querySelector("footer").classList.replace("bg-dark", "bg-light");

        //analytics badge
        const analyticsBadge = document.getElementById("analytics-badge");
        if (analyticsBadge) {
            analyticsBadge.src = "https://simpleanalyticsbadges.com/justacat.me?logo=white&text=white&background=6C757D";
        }

        // Nav tabs and content
        const navTabs = document.querySelectorAll(".nav-tabs .nav-link:not(.active)");
        navTabs.forEach(tab => {
            tab.classList.remove("text-light");
            tab.style.borderColor = "";
        });

        // List group items
        const listItems = document.querySelectorAll(".list-group-item");
        listItems.forEach(item => {
            item.classList.remove("bg-dark");
            item.classList.remove("text-light");
            item.classList.remove("border-secondary");
        });

        // Change button styling
        darkModeBtn.innerHTML = '<i class="bi bi-moon"></i> Dark Mode';
        darkModeBtn.classList.replace("btn-outline-warning", "btn-outline-light");

        document.getElementById("Link").href += "?darkMode=false";

        // Store preference
        localStorage.setItem("darkMode", "false");
    }
});

// Code block toggle
const toggleCodeBtn = document.getElementById("toggle-code");
const codeBlock = document.getElementById("code-block");
if(toggleCodeBtn) {
    toggleCodeBtn.addEventListener("click", () => {
        codeBlock.classList.toggle("d-none");
        if (!codeBlock.classList.contains("d-none")) {
            fetch('code-snippet.cs')
                .then(response => response.text())
                .then(data => {
                    codeBlock.querySelector('code').textContent = data;
                });
        } else {
            codeBlock.querySelector('code').textContent = '';
        }
    });
}

//Tetris game
addEventListener("keydown", (onkeydown = (event) => {
    if (event.key === "ArrowLeft") {
        sendMove("left");
    } else if (event.key === "ArrowRight") {
        sendMove("right");
    } else if (event.key === "ArrowUp") {
        sendMove("rotate right");
    } else if (event.key === "ArrowDown") {
        sendMove("rotate left");
    }
}))
let origin = window.location.origin;
if(window.location.origin.indexOf("https://") === -1) {
    origin = origin.replace("http://", "ws://");
}else{
    origin = origin.replace("https://", "wss://");
}
let socket = new WebSocket(origin);
socket.addEventListener('open', () => {
    log("Connected to server");
});

socket.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'move') {
        log(`Move: ${msg.direction}`);
    }
});

function sendMove(direction) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "move", direction }));
    }
}

function log(message) {
    console.log(message);
}



