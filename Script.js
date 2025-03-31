
document.body.classList.toggle("dark-mode");
// Dark mode toggle
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Tab functionality
const tabLinks = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");

tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
        // Remove active class from all tabs
        tabLinks.forEach((l) => l.classList.remove("active"));
        // Remove active class from all tab content
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked tab and associated content
        link.classList.add("active");
        const tabId = link.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
    });
});

// Code block toggle
const toggleCodeBtn = document.getElementById("toggle-code");
const codeBlock = document.getElementById("code-block");
toggleCodeBtn.addEventListener("click", () => {
    codeBlock.classList.toggle("visible");
    if (codeBlock.classList.contains("visible")) {
        fetch('code-snippet.cs')
            .then(response => response.text())
            .then(data => {
                codeBlock.querySelector('code').textContent = data;
                hljs.highlightBlock(codeBlock.querySelector('code'));
            });
    }else{
        // Clear the code block when hidden
        codeBlock.querySelector('code').textContent = '';
    }
});