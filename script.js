// Tab Switching (Calculator / Converter)
function switchTab(tab) {
    document.getElementById('calc-tab').classList.remove('active');
    document.getElementById('conv-tab').classList.remove('active');
    document.getElementById('calculator-view').classList.remove('active-view');
    document.getElementById('converter-view').classList.remove('active-view');

    if (tab === 'calc') {
        document.getElementById('calc-tab').classList.add('active');
        document.getElementById('calculator-view').classList.add('active-view');
    } else {
        document.getElementById('conv-tab').classList.add('active');
        document.getElementById('converter-view').classList.add('active-view');
    }
}

// Calculator Basic Logic
let screen = document.getElementById('screen');

function appendValue(val) {
    screen.value += val;
}

function clearDisplay() {
    screen.value = '';
}

function deleteLast() {
    screen.value = screen.value.slice(0, -1);
}

function calculate() {
    try {
        screen.value = eval(screen.value.replace('×', '*').replace('÷', '/'));
    } catch (e) {
        screen.value = 'Error';
    }
}
