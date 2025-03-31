function toggleVisibility(id) {
    const element = document.getElementById(id);
    if (element.classList.contains('visible')) {
        element.classList.remove('visible');
    } else {
        element.classList.add('visible');
    }
}

function toggleInteractive(id) {
    const element = document.getElementById(id);
    if (element.classList.contains('visible')) {
        element.classList.remove('visible');
    } else {
        element.classList.add('visible');
    }
}

// Function to create an interactive half-adder
function createHalfAdder() {
    const a = document.getElementById('half-adder-a').checked;
    const b = document.getElementById('half-adder-b').checked;
    const sum = a ^ b; // XOR operation
    const carry = a && b; // AND operation
    document.getElementById('half-adder-sum').innerText = sum ? '1' : '0';
    document.getElementById('half-adder-carry').innerText = carry ? '1' : '0';
}

// Function to create an interactive full-adder
function createFullAdder() {
    const a = document.getElementById('full-adder-a').checked;
    const b = document.getElementById('full-adder-b').checked;
    const cin = document.getElementById('full-adder-cin').checked;
    const sum = a ^ b ^ cin; // XOR operation
    const carry = (a && b) || (cin && (a ^ b)); // Carry operation
    document.getElementById('full-adder-sum').innerText = sum ? '1' : '0';
    document.getElementById('full-adder-carry').innerText = carry ? '1' : '0';
}

// Function to create an interactive D-type flip-flop
function createDFlipFlop() {
    const d = document.getElementById('d-flip-flop-d').checked;
    const clk = document.getElementById('d-flip-flop-clk').checked;
    if (clk) {
        document.getElementById('d-flip-flop-q').innerText = d ? '1' : '0';
    }
}

// Event listeners for half-adder inputs
document.getElementById('half-adder-a').addEventListener('change', createHalfAdder);
document.getElementById('half-adder-b').addEventListener('change', createHalfAdder);

// Event listeners for full-adder inputs
document.getElementById('full-adder-a').addEventListener('change', createFullAdder);
document.getElementById('full-adder-b').addEventListener('change', createFullAdder);
document.getElementById('full-adder-cin').addEventListener('change', createFullAdder);

// Event listeners for D-type flip-flop inputs
document.getElementById('d-flip-flop-d').addEventListener('change', createDFlipFlop);
document.getElementById('d-flip-flop-clk').addEventListener('change', createDFlipFlop);