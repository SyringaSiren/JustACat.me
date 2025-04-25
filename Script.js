

// Code block toggle
const toggleCodeBtn = document.getElementById("toggle-code");
const codeBlock = document.getElementById("code-block");
toggleCodeBtn.addEventListener("click", () => {
    codeBlock.classList.toggle("d-none");
    if (!codeBlock.classList.contains("d-none")) {
        fetch('code-snippet.cs')
            .then(response => response.text())
            .then(data => {
                codeBlock.querySelector('code').textContent = data;
                hljs.highlightBlock(codeBlock.querySelector('code'));
            });
    } else {
        // Clear the code block when hidden
        codeBlock.querySelector('code').textContent = '';
    }
});