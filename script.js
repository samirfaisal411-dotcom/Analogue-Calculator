// Tab Switch Logic
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

// Calculator Logic
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

// Open Converter Modal Logic
function openConverter(type) {
    const modal = document.getElementById('converter-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.innerText = type + ' Converter';
    modal.style.display = 'block';

    if (type === 'Currency') {
        body.innerHTML = `
            <div class="input-group"><label>USD ($)</label><input type="number" id="inp-usd" placeholder="Enter USD..." oninput="calcCurrency()"></div>
            <div class="result-box" id="res-curr">₹0.00 INR | €0.00 EUR</div>`;
    } else if (type === 'Length') {
        body.innerHTML = `
            <div class="input-group"><label>Meters (m)</label><input type="number" id="inp-len" placeholder="Enter meters..." oninput="calcLength()"></div>
            <div class="result-box" id="res-len">0 cm | 0 ft | 0 inch</div>`;
    } else if (type === 'Mass') {
        body.innerHTML = `
            <div class="input-group"><label>Kilograms (kg)</label><input type="number" id="inp-mass" placeholder="Enter kg..." oninput="calcMass()"></div>
            <div class="result-box" id="res-mass">0 Grams | 0 Pounds</div>`;
    } else if (type === 'Area') {
        body.innerHTML = `
            <div class="input-group"><label>Square Meters (m²)</label><input type="number" id="inp-area" placeholder="Enter sq meters..." oninput="calcArea()"></div>
            <div class="result-box" id="res-area">0 Sq Feet | 0 Acres</div>`;
    } else if (type === 'Time') {
        body.innerHTML = `
            <div class="input-group"><label>Hours (hrs)</label><input type="number" id="inp-time" placeholder="Enter hours..." oninput="calcTime()"></div>
            <div class="result-box" id="res-time">0 Minutes | 0 Seconds</div>`;
    } else if (type === 'Data') {
        body.innerHTML = `
            <div class="input-group"><label>Megabytes (MB)</label><input type="number" id="inp-data" placeholder="Enter MB..." oninput="calcData()"></div>
            <div class="result-box" id="res-data">0 KB | 0 GB</div>`;
    } else if (type === 'Discount') {
        body.innerHTML = `
            <div class="input-group"><label>Original Price (₹)</label><input type="number" id="inp-price" placeholder="1000" oninput="calcDiscount()"></div>
            <div class="input-group"><label>Discount (%)</label><input type="number" id="inp-disc" placeholder="20" oninput="calcDiscount()"></div>
            <div class="result-box" id="res-disc">Final Price: ₹0</div>`;
    } else if (type === 'Volume') {
        body.innerHTML = `
            <div class="input-group"><label>Liters (L)</label><input type="number" id="inp-vol" placeholder="Enter liters..." oninput="calcVolume()"></div>
            <div class="result-box" id="res-vol">0 mL | 0 Gallons</div>`;
    } else if (type === 'Numeral') {
        body.innerHTML = `
            <div class="input-group"><label>Decimal Number</label><input type="number" id="inp-num" placeholder="Enter number..." oninput="calcNumeral()"></div>
            <div class="result-box" id="res-num">Binary: 0 | Hex: 0</div>`;
    } else if (type === 'Speed') {
        body.innerHTML = `
            <div class="input-group"><label>Speed (km/h)</label><input type="number" id="inp-speed" placeholder="Enter km/h..." oninput="calcSpeed()"></div>
            <div class="result-box" id="res-speed">0 m/s | 0 mph</div>`;
    } else if (type === 'Temperature') {
        body.innerHTML = `
            <div class="input-group"><label>Celsius (°C)</label><input type="number" id="inp-temp" placeholder="Enter Celsius..." oninput="calcTemp()"></div>
            <div class="result-box" id="res-temp">0 °F | 0 K</div>`;
    } else if (type === 'BMI') {
        body.innerHTML = `
            <div class="input-group"><label>Weight (kg)</label><input type="number" id="inp-weight" placeholder="70" oninput="calcBMI()"></div>
            <div class="input-group"><label>Height (cm)</label><input type="number" id="inp-height" placeholder="170" oninput="calcBMI()"></div>
            <div class="result-box" id="res-bmi">BMI: 0</div>`;
    } else if (type === 'GST') {
        body.innerHTML = `
            <div class="input-group"><label>Amount (₹)</label><input type="number" id="inp-gst-amt" placeholder="1000" oninput="calcGST()"></div>
            <div class="input-group"><label>GST (%)</label><input type="number" id="inp-gst-rate" placeholder="18" oninput="calcGST()"></div>
            <div class="result-box" id="res-gst">GST: ₹0 | Total: ₹0</div>`;
    }
}

function closeConverter() {
    document.getElementById('converter-modal').style.display = 'none';
}

// Converter Functions
function calcCurrency() {
    let usd = parseFloat(document.getElementById('inp-usd').value) || 0;
    document.getElementById('res-curr').innerText = `₹${(usd * 83.5).toFixed(2)} INR | €${(usd * 0.92).toFixed(2)} EUR`;
}
function calcLength() {
    let m = parseFloat(document.getElementById('inp-len').value) || 0;
    document.getElementById('res-len').innerText = `${m * 100} cm | ${(m * 3.28).toFixed(2)} ft | ${(m * 39.37).toFixed(2)} in`;
}
function calcMass() {
    let kg = parseFloat(document.getElementById('inp-mass').value) || 0;
    document.getElementById('res-mass').innerText = `${kg * 1000} g | ${(kg * 2.2).toFixed(2)} lbs`;
}
function calcArea() {
    let m2 = parseFloat(document.getElementById('inp-area').value) || 0;
    document.getElementById('res-area').innerText = `${(m2 * 10.76).toFixed(2)} Sq Ft | ${(m2 / 4046.86).toFixed(4)} Acres`;
}
function calcTime() {
    let h = parseFloat(document.getElementById('inp-time').value) || 0;
    document.getElementById('res-time').innerText = `${h * 60} Min | ${h * 3600} Sec`;
}
function calcData() {
    let mb = parseFloat(document.getElementById('inp-data').value) || 0;
    document.getElementById('res-data').innerText = `${mb * 1024} KB | ${(mb / 1024).toFixed(3)} GB`;
}
function calcDiscount() {
    let p = parseFloat(document.getElementById('inp-price').value) || 0;
    let d = parseFloat(document.getElementById('inp-disc').value) || 0;
    document.getElementById('res-disc').innerText = `Final: ₹${(p - (p * d / 100)).toFixed(2)}`;
}
function calcVolume() {
    let l = parseFloat(document.getElementById('inp-vol').value) || 0;
    document.getElementById('res-vol').innerText = `${l * 1000} mL | ${(l / 3.785).toFixed(2)} Gal`;
}
function calcNumeral() {
    let n = parseInt(document.getElementById('inp-num').value) || 0;
    document.getElementById('res-num').innerText = `Bin: ${n.toString(2)} | Hex: ${n.toString(16).toUpperCase()}`;
}
function calcSpeed() {
    let s = parseFloat(document.getElementById('inp-speed').value) || 0;
    document.getElementById('res-speed').innerText = `${(s / 3.6).toFixed(2)} m/s | ${(s / 1.609).toFixed(2)} mph`;
}
function calcTemp() {
    let c = parseFloat(document.getElementById('inp-temp').value) || 0;
    document.getElementById('res-temp').innerText = `${((c * 9/5) + 32).toFixed(1)} °F | ${(c + 273.15).toFixed(1)} K`;
}
function calcBMI() {
    let w = parseFloat(document.getElementById('inp-weight').value) || 0;
    let h = parseFloat(document.getElementById('inp-height').value) || 0;
    if (w > 0 && h > 0) {
        document.getElementById('res-bmi').innerText = `BMI: ${(w / ((h / 100) ** 2)).toFixed(1)}`;
    }
}
function calcGST() {
    let a = parseFloat(document.getElementById('inp-gst-amt').value) || 0;
    let r = parseFloat(document.getElementById('inp-gst-rate').value) || 0;
    let gst = a * (r / 100);
    document.getElementById('res-gst').innerText = `GST: ₹${gst.toFixed(2)} | Total: ₹${(a + gst).toFixed(2)}`;
}

// Service Worker Register
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}
