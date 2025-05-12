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

        const gameInfo = document.getElementById("GameInfo");
        gameInfo.classList.replace("bg-light", "bg-dark");
        gameInfo.classList.replace("text-dark", "text-light");

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

        const gameInfo = document.getElementById("GameInfo");
        gameInfo.classList.replace("bg-dark", "bg-light");
        gameInfo.classList.replace("text-light", "text-dark");


        // Change button styling
        darkModeBtn.innerHTML = '<i class="bi bi-moon"></i> Dark Mode';
        darkModeBtn.classList.replace("btn-outline-warning", "btn-outline-light");

        document.getElementById("Link").href += "?darkMode=false";

        // Store preference
        localStorage.setItem("darkMode", "false");
    }
});
//Tetris game
addEventListener("keydown", (onkeydown = (event) => {
    if(!event.Handled) {
        if (event.key === "ArrowLeft") {
            sendMove("left");
        } else if (event.key === "ArrowRight") {
            sendMove("right");
        } else if (event.key === "ArrowUp") {
            sendMove("rotate right");
        } else if (event.key === "ArrowDown") {
            sendMove("rotate left");
        }
        event.Handled = true;
    }
}))
let origin = window.location.hostname;
origin = `ws://${origin}:8080`;
let socket = new WebSocket(origin);
socket.addEventListener('open', () => {
    RequestSync();
});

document.getElementById("start-button").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "StartGame"}));
})

socket.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "move") {
        let direction = msg.direction;
        if (direction === "left") {
            playerMove(-1);
        } else if (direction === "right") {
            playerMove(1);
        } else if (direction === "rotate right") {
            playerRotate(1);
        } else if (direction === "rotate left") {
            playerRotate(-1);
        }

        draw();
    }
    else if (msg.type === "PieceDropped") {
        playerDrop();

        draw();
    }
    else if (msg.type === "PieceMerged") { //resync with the whole board
        board = msg.board;
    }
    else if(msg.type === "nextPiece") {
        nextPiece = msg.detail
    }else if(msg.type === "PieceUpdate") {
        piece = msg.details;
    }
    else if(msg.type === "SyncResponse") {

        board = msg.board;
        piece = msg.piece;
        nextPiece = msg.nextPiece;
        score = msg.score;
        level = msg.level;
        lines = msg.lines;
        gameOver = false;

    }
});

function RequestSync(){
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "SyncRequest" }));
    }
}


// Tetris Game Implementation

// Game constants and variables
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    null,
    '#FF0D72', // I
    '#0DC2FF', // J
    '#0DFF72', // L
    '#F538FF', // O
    '#FF8E0D', // S
    '#FFE138', // T
    '#3877FF'  // Z
];

// The tetromino shapes
const SHAPES = [
    null,
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // I
    [[2,0,0], [2,2,2], [0,0,0]],                  // J
    [[0,0,3], [3,3,3], [0,0,0]],                  // L
    [[4,4], [4,4]],                               // O
    [[0,5,5], [5,5,0], [0,0,0]],                  // S
    [[0,6,0], [6,6,6], [0,0,0]],                  // T
    [[7,7,0], [0,7,7], [0,0,0]]                   // Z
];

let canvas, ctx;
let nextPieceCanvas, nextPieceCtx;
let board = [];
let piece;
let nextPiece;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = true;
let lastTime = 0;
let requestId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Setup game after DOM is loaded
    canvas = document.getElementById('tetris-canvas');
    ctx = canvas.getContext('2d');

    nextPieceCanvas = document.getElementById('next-piece');
    nextPieceCtx = nextPieceCanvas.getContext('2d');

    // Set up the canvas
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    nextPieceCtx.scale(BLOCK_SIZE/2, BLOCK_SIZE/2);

    // Set up event listeners
    const startButton = document.getElementById('start-button');
    let startFlag= false;
    startButton.addEventListener('click', () => {
        if(!startFlag) {
            socket.close();
            socket = new WebSocket(origin);
        }
        startFlag = true;
        if (gameOver) {
            reset();
        }
    });
});


function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw board
    drawBoard();

    // Draw current piece
    if (piece) {
        drawPiece(ctx, piece);
    }

    // Draw next piece preview
    drawNextPiece();
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect(x, y, 1, 1);
            }
        });
    });
}

function drawPiece(context, piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x + piece.x, y + piece.y, 1, 1);
            }
        });
    });
}

function drawNextPiece() {
    nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    if (nextPiece) {
        // Center the piece in the next piece canvas
        const offsetX = (4 - nextPiece.shape[0].length) / 2;
        const offsetY = (4 - nextPiece.shape.length) / 2;

        nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    nextPieceCtx.fillStyle = COLORS[value];
                    nextPieceCtx.fillRect(x + offsetX, y + offsetY, 1, 1);
                }
            });
        });
    }
}

function collision() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] !== 0 &&
                (board[y + piece.y] === undefined ||
                    board[y + piece.y][x + piece.x] === undefined ||
                    board[y + piece.y][x + piece.x] !== 0)) {
                return true;
            }
        }
    }
    return false;
}

function rotate(matrix, dir) {
    // Transpose the matrix
    const N = matrix.length;
    const result = Array.from({length: N}, () => Array(N).fill(0));

    for (let y = 0; y < N; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            result[x][y] = matrix[y][x];
        }
    }

    // Reverse each row to get a rotated matrix
    if (dir > 0) {
        return result.map(row => row.reverse());
    } else {
        return result.reverse();
    }
}

function playerRotate(dir) {
    const originalPos = { ...piece };
    const originalShape = piece.shape;

    piece.shape = rotate(piece.shape, dir);

    // Handle collision after rotation
    if (collision()) {
        // Try to adjust position if there's a collision
        const offset = 1;
        for (let attempt = 0; attempt < 2; attempt++) {
            // Try moving right
            piece.x += offset;
            if (!collision()) return;

            // Try moving left
            piece.x -= offset * 2;
            if (!collision()) return;

            // Try moving up
            piece.x = originalPos.x;
            piece.y -= offset;
            if (!collision()) return;

            // Reset to original position and shape
            piece.x = originalPos.x;
            piece.y = originalPos.y;
            piece.shape = originalShape;
            return;
        }
    }
}

function playerMove(dir) {
    piece.x += dir;
    if (collision()) {
        piece.x -= dir;
    }
}

function playerDrop() {
    piece.y++;
}

function checkLines() {
    let linesCleared = 0;

    outer: for (let y = ROWS - 1; y >= 0; y--) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) continue outer;
        }

        // Remove the completed line
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        y++;
        linesCleared++;
    }

    if (linesCleared > 0) {
        // Update score and level
        lines += linesCleared;
        score += linesCleared * 100 * level;

        // Level up every 10 lines
        level = Math.floor(lines / 10) + 1;
        dropInterval = 1000 - (level - 1) * 50;

        // Update UI
        document.getElementById('score').textContent = score;
        document.getElementById('level').textContent = level;
        document.getElementById('lines').textContent = lines;
    }
}

function resetPiece() {
    piece = nextPiece;
}

function reset() {
    score = 0;
    level = 1;
    lines = 0;
    dropInterval = 1000;
    gameOver = false;

    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;

    resetPiece();
}



// Connect your keyboard event handlers to the Tetris game actions
function sendMove(direction) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "move", direction }));
    }
}
