/* =========================================================
   ANALOGUE CALCULATOR
   Main JavaScript
========================================================= */

"use strict";

/* =========================================================
   ELEMENTS
========================================================= */

const screen = document.getElementById("screen");
const calculatorView = document.getElementById("calculator-view");
const converterView = document.getElementById("converter-view");
const calcTab = document.getElementById("calc-tab");
const convTab = document.getElementById("conv-tab");

const converterModal = document.getElementById("converter-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

/* =========================================================
   CALCULATOR STATE
========================================================= */

let expression = "";
let justCalculated = false;

/* =========================================================
   TAB SWITCH
========================================================= */

function switchTab(tab) {
    if (tab === "calc") {
        calcTab.classList.add("active");
        convTab.classList.remove("active");

        calculatorView.classList.add("active-view");
        converterView.classList.remove("active-view");
    } else {
        convTab.classList.add("active");
        calcTab.classList.remove("active");

        converterView.classList.add("active-view");
        calculatorView.classList.remove("active-view");
    }
}

/* =========================================================
   DISPLAY
========================================================= */

function updateDisplay() {
    screen.value = expression || "";
}

/* =========================================================
   CLEAR
========================================================= */

function clearDisplay() {
    expression = "";
    justCalculated = false;
    updateDisplay();
}

/* =========================================================
   DELETE LAST
========================================================= */

function deleteLast() {
    if (justCalculated) {
        clearDisplay();
        return;
    }

    expression = expression.slice(0, -1);
    updateDisplay();
}

/* =========================================================
   POSITIVE / NEGATIVE
========================================================= */

function toggleSign() {
    if (!expression) {
        expression = "-";
        updateDisplay();
        return;
    }

    const match = expression.match(/(-?\d*\.?\d+)$/);

    if (!match) {
        return;
    }

    const number = match[0];
    const start = expression.length - number.length;

    if (number.startsWith("-")) {
        expression =
            expression.substring(0, start) +
            number.substring(1);
    } else {
        expression =
            expression.substring(0, start) +
            "-" +
            number;
    }

    justCalculated = false;
    updateDisplay();
}

/* =========================================================
   NUMBER / OPERATOR INPUT
========================================================= */

function appendValue(value) {

    /* Start new calculation after result */
    if (justCalculated) {

        if (
            !isNaN(value) ||
            value === "." ||
            value === "("
        ) {
            expression = "";
        }

        justCalculated = false;
    }

    /* Numbers */
    if (!isNaN(value)) {
        expression += value;
        updateDisplay();
        return;
    }

    /* Decimal */
    if (value === ".") {
        const currentNumber =
            expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) {
            return;
        }

        if (
            currentNumber === "" ||
            currentNumber === "-"
        ) {
            expression += "0";
        }

        expression += ".";
        updateDisplay();
        return;
    }

    /* Percentage */
    if (value === "%") {
        if (!expression) {
            return;
        }

        const match = expression.match(/(\d*\.?\d+)$/);

        if (!match) {
            return;
        }

        const number = match[1];
        const percent = Number(number) / 100;

        expression =
            expression.substring(
                0,
                expression.length - number.length
            ) + percent;

        updateDisplay();
        return;
    }

    /* Operators */
    if (["+", "-", "*", "/"].includes(value)) {

        if (!expression) {
            if (value === "-") {
                expression = "-";
            }

            updateDisplay();
            return;
        }

        const lastChar = expression.slice(-1);

        if (["+", "-", "*", "/"].includes(lastChar)) {
            expression =
                expression.slice(0, -1) + value;
        } else {
            expression += value;
        }

        updateDisplay();
    }
}

/* =========================================================
   CALCULATOR ENGINE
   Safe expression evaluator
========================================================= */

function calculate() {

    if (!expression) {
        return;
    }

    let cleanExpression = expression;

    /* Remove trailing operator */
    while (
        ["+", "-", "*", "/"].includes(
            cleanExpression.slice(-1)
        )
    ) {
        cleanExpression =
            cleanExpression.slice(0, -1);
    }

    if (!cleanExpression) {
        return;
    }

    try {

        const result =
            evaluateExpression(cleanExpression);

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = formatNumber(result);
        justCalculated = true;

        updateDisplay();

    } catch (error) {

        screen.value = "Error";
        expression = "";
        justCalculated = true;
    }
}

/* =========================================================
   SAFE EXPRESSION EVALUATOR
========================================================= */

function evaluateExpression(input) {

    const tokens = input.match(
        /(?:\d+(?:\.\d+)?|\.\d+)|[+\-*/]/g
    );

    if (!tokens || tokens.join("") !== input) {
        throw new Error("Invalid expression");
    }

    const numbers = [];
    const operators = [];

    let expectingNumber = true;

    for (let token of tokens) {

        if (!isNaN(token)) {

            numbers.push(Number(token));
            expectingNumber = false;

        } else {

            if (expectingNumber) {

                if (token === "-" && numbers.length === 0) {
                    numbers.push(0);
                } else {
                    throw new Error("Invalid operator");
                }
            }

            operators.push(token);
            expectingNumber = true;
        }
    }

    if (expectingNumber) {
        throw new Error("Incomplete expression");
    }

    /* Multiplication and division first */

    let values = [numbers[0]];
    let newOperators = [];

    for (let i = 0; i < operators.length; i++) {

        const operator = operators[i];
        const nextNumber = numbers[i + 1];

        if (operator === "*") {

            values[values.length - 1] *= nextNumber;

        } else if (operator === "/") {

            if (nextNumber === 0) {
                throw new Error("Division by zero");
            }

            values[values.length - 1] /= nextNumber;

        } else {

            newOperators.push(operator);
            values.push(nextNumber);
        }
    }

    /* Addition and subtraction */

    let result = values[0];

    for (let i = 0; i < newOperators.length; i++) {

        if (newOperators[i] === "+") {
            result += values[i + 1];
        }

        if (newOperators[i] === "-") {
            result -= values[i + 1];
        }
    }

    return result;
}

/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatNumber(number) {

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return Number(
        number.toFixed(10)
    ).toString();
}

/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener("keydown", function (event) {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        appendValue(key);
        return;
    }

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        appendValue(key);
        return;
    }

    if (key === "%") {
        appendValue("%");
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        deleteLast();
        return;
    }

    if (key === "Escape" || key.toLowerCase() === "c") {
        clearDisplay();
    }
});

/* =========================================================
   CONVERTER MODAL
========================================================= */

function openConverter(type) {

    modalTitle.innerText =
        type + " Converter";

    converterModal.style.display = "block";

    loadConverter(type);
}

/* =========================================================
   CLOSE MODAL
========================================================= */

function closeConverter() {
    converterModal.style.display = "none";
    modalBody.innerHTML = "";
}

/* =========================================================
   CLOSE MODAL BY BACKGROUND
========================================================= */

converterModal.addEventListener("click", function (event) {

    if (event.target === converterModal) {
        closeConverter();
    }
});

/* =========================================================
   CONVERTER LOADER
========================================================= */

function loadConverter(type) {

    modalBody.innerHTML = "";

    if (type === "Currency") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>USD ($)</label>
                <input
                    type="number"
                    id="inp-usd"
                    placeholder="Enter USD"
                    oninput="calcCurrency()"
                >
            </div>

            <div class="result-box" id="res-curr">
                NPR 0.00 | INR 0.00 | EUR 0.00
            </div>
        `;

    }

    else if (type === "Length") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Meters (m)</label>
                <input
                    type="number"
                    id="inp-len"
                    placeholder="Enter meters"
                    oninput="calcLength()"
                >
            </div>

            <div class="result-box" id="res-len">
                0 cm | 0 ft | 0 in
            </div>
        `;

    }

    else if (type === "Mass") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Kilograms (kg)</label>
                <input
                    type="number"
                    id="inp-mass"
                    placeholder="Enter kilograms"
                    oninput="calcMass()"
                >
            </div>

            <div class="result-box" id="res-mass">
                0 g | 0 lb
            </div>
        `;

    }

    else if (type === "Area") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Square Meters (m²)</label>
                <input
                    type="number"
                    id="inp-area"
                    placeholder="Enter square meters"
                    oninput="calcArea()"
                >
            </div>

            <div class="result-box" id="res-area">
                0 sq ft | 0 acres
            </div>
        `;

    }

    else if (type === "Time") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Hours</label>
                <input
                    type="number"
                    id="inp-time"
                    placeholder="Enter hours"
                    oninput="calcTime()"
                >
            </div>

            <div class="result-box" id="res-time">
                0 minutes | 0 seconds
            </div>
        `;

    }

    else if (type === "Data") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Megabytes (MB)</label>
                <input
                    type="number"
                    id="inp-data"
                    placeholder="Enter MB"
                    oninput="calcData()"
                >
            </div>

            <div class="result-box" id="res-data">
                0 KB | 0 GB
            </div>
        `;

    }

    else if (type === "Discount") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Original Price</label>
                <input
                    type="number"
                    id="inp-price"
                    placeholder="1000"
                    oninput="calcDiscount()"
                >
            </div>

            <div class="input-group">
                <label>Discount (%)</label>
                <input
                    type="number"
                    id="inp-disc"
                    placeholder="20"
                    oninput="calcDiscount()"
                >
            </div>

            <div class="result-box" id="res-disc">
                Final Price: 0
            </div>
        `;

    }

    else if (type === "Volume") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Liters (L)</label>
                <input
                    type="number"
                    id="inp-vol"
                    placeholder="Enter liters"
                    oninput="calcVolume()"
                >
            </div>

            <div class="result-box" id="res-vol">
                0 mL | 0 US gal
            </div>
        `;

    }

    else if (type === "Numeral") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Decimal Number</label>
                <input
                    type="number"
                    id="inp-num"
                    placeholder="Enter decimal number"
                    oninput="calcNumeral()"
                >
            </div>

            <div class="result-box" id="res-num">
                Binary: 0 | Hex: 0
            </div>
        `;

    }

    else if (type === "Speed") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Speed (km/h)</label>
                <input
                    type="number"
                    id="inp-speed"
                    placeholder="Enter km/h"
                    oninput="calcSpeed()"
                >
            </div>

            <div class="result-box" id="res-speed">
                0 m/s | 0 mph
            </div>
        `;

    }

    else if (type === "Temperature") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Celsius (°C)</label>
                <input
                    type="number"
                    id="inp-temp"
                    placeholder="Enter Celsius"
                    oninput="calcTemp()"
                >
            </div>

            <div class="result-box" id="res-temp">
                0 °F | 0 K
            </div>
        `;

    }

    else if (type === "BMI") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Weight (kg)</label>
                <input
                    type="number"
                    id="inp-weight"
                    placeholder="70"
                    oninput="calcBMI()"
                >
            </div>

            <div class="input-group">
                <label>Height (cm)</label>
                <input
                    type="number"
                    id="inp-height"
                    placeholder="170"
                    oninput="calcBMI()"
                >
            </div>

            <div class="result-box" id="res-bmi">
                BMI: 0
            </div>
        `;

    }

    else if (type === "GST") {

        modalBody.innerHTML = `
            <div class="input-group">
                <label>Amount</label>
                <input
                    type="number"
                    id="inp-gst-amt"
                    placeholder="1000"
                    oninput="calcGST()"
                >
            </div>

            <div class="input-group">
                <label>GST (%)</label>
                <input
                    type="number"
                    id="inp-gst-rate"
                    placeholder="18"
                    oninput="calcGST()"
                >
            </div>

            <div class="result-box" id="res-gst">
                GST: 0 | Total: 0
            </div>
        `;
    }
}

/* =========================================================
   CURRENCY
========================================================= */

/*
   These are demonstration rates.
   Later we can connect a live exchange-rate API.
*/

function calcCurrency() {

    const input =
        document.getElementById("inp-usd");

    const result =
        document.getElementById("res-curr");

    if (!input || !result) {
        return;
    }

    const usd =
        parseFloat(input.value);

    if (!Number.isFinite(usd)) {
        result.innerText =
            "NPR 0.00 | INR 0.00 | EUR 0.00";
        return;
    }

    const npr = usd * 140;
    const inr = usd * 88;
    const eur = usd * 0.85;

    result.innerText =
        `NPR ${npr.toFixed(2)} | INR ${inr.toFixed(2)} | EUR ${eur.toFixed(2)}`;
}

/* =========================================================
   LENGTH
========================================================= */

function calcLength() {

    const m =
        parseFloat(
            document.getElementById("inp-len").value
        );

    const result =
        document.getElementById("res-len");

    if (!Number.isFinite(m)) {
        result.innerText =
            "0 cm | 0 ft | 0 in";
        return;
    }

    result.innerText =
        `${(m * 100).toFixed(2)} cm | ${(m * 3.28084).toFixed(2)} ft | ${(m * 39.3701).toFixed(2)} in`;
}

/* =========================================================
   MASS
========================================================= */

function calcMass() {

    const kg =
        parseFloat(
            document.getElementById("inp-mass").value
        );

    const result =
        document.getElementById("res-mass");

    if (!Number.isFinite(kg)) {
        result.innerText =
            "0 g | 0 lb";
        return;
    }

    result.innerText =
        `${(kg * 1000).toFixed(2)} g | ${(kg * 2.20462).toFixed(2)} lb`;
}

/* =========================================================
   AREA
========================================================= */

function calcArea() {

    const m2 =
        parseFloat(
            document.getElementById("inp-area").value
        );

    const result =
        document.getElementById("res-area");

    if (!Number.isFinite(m2)) {
        result.innerText =
            "0 sq ft | 0 acres";
        return;
    }

    result.innerText =
        `${(m2 * 10.7639).toFixed(2)} sq ft | ${(m2 / 4046.856).toFixed(4)} acres`;
}

/* =========================================================
   TIME
========================================================= */

function calcTime() {

    const hours =
        parseFloat(
            document.getElementById("inp-time").value
        );

    const result =
        document.getElementById("res-time");

    if (!Number.isFinite(hours)) {
        result.innerText =
            "0 minutes | 0 seconds";
        return;
    }

    result.innerText =
        `${(hours * 60).toFixed(2)} minutes | ${(hours * 3600).toFixed(2)} seconds`;
}

/* =========================================================
   DATA
========================================================= */

function calcData() {

    const mb =
        parseFloat(
            document.getElementById("inp-data").value
        );

    const result =
        document.getElementById("res-data");

    if (!Number.isFinite(mb)) {
        result.innerText =
            "0 KB | 0 GB";
        return;
    }

    result.innerText =
        `${(mb * 1024).toFixed(2)} KB | ${(mb / 1024).toFixed(3)} GB`;
}

/* =========================================================
   DISCOUNT
========================================================= */

function calcDiscount() {

    const price =
        parseFloat(
            document.getElementById("inp-price").value
        );

    const discount =
        parseFloat(
            document.getElementById("inp-disc").value
        );

    const result =
        document.getElementById("res-disc");

    if (
        !Number.isFinite(price) ||
        !Number.isFinite(discount)
    ) {
        result.innerText =
            "Final Price: 0";
        return;
    }

    const saved =
        price * (discount / 100);

    const finalPrice =
        price - saved;

    result.innerText =
        `You Save: ${saved.toFixed(2)} | Final Price: ${finalPrice.toFixed(2)}`;
}

/* =========================================================
   VOLUME
========================================================= */

function calcVolume() {

    const liters =
        parseFloat(
            document.getElementById("inp-vol").value
        );

    const result =
        document.getElementById("res-vol");

    if (!Number.isFinite(liters)) {
        result.innerText =
            "0 mL | 0 US gal";
        return;
    }

    result.innerText =
        `${(liters * 1000).toFixed(2)} mL | ${(liters / 3.78541).toFixed(2)} US gal`;
}

/* =========================================================
   NUMERAL SYSTEM
========================================================= */

function calcNumeral() {

    const input =
        document.getElementById("inp-num");

    const result =
        document.getElementById("res-num");

    if (!input || !result) {
        return;
    }

    const value =
        input.value.trim();

    if (value === "") {
        result.innerText =
            "Binary: 0 | Hex: 0";
        return;
    }

    const number =
        Number(value);

    if (!Number.isInteger(number)) {
        result.innerText =
            "Please enter a whole number";
        return;
    }

    result.innerText =
        `Binary: ${number.toString(2)} | Hex: ${number.toString(16).toUpperCase()}`;
}

/* =========================================================
   SPEED
========================================================= */

function calcSpeed() {

    const speed =
        parseFloat(
            document.getElementById("inp-speed").value
        );

    const result =
        document.getElementById("res-speed");

    if (!Number.isFinite(speed)) {
        result.innerText =
            "0 m/s | 0 mph";
        return;
    }

    result.innerText =
        `${(speed / 3.6).toFixed(2)} m/s | ${(speed / 1.609344).toFixed(2)} mph`;
}

/* =========================================================
   TEMPERATURE
========================================================= */

function calcTemp() {

    const celsius =
        parseFloat(
            document.getElementById("inp-temp").value
        );

    const result =
        document.getElementById("res-temp");

    if (!Number.isFinite(celsius)) {
        result.innerText =
            "0 °F | 0 K";
        return;
    }

    const fahrenheit =
        (celsius * 9 / 5) + 32;

    const kelvin =
        celsius + 273.15;

    result.innerText =
        `${fahrenheit.toFixed(2)} °F | ${kelvin.toFixed(2)} K`;
}

/* =========================================================
   BMI
========================================================= */

function calcBMI() {

    const weight =
        parseFloat(
            document.getElementById("inp-weight").value
        );

    const height =
        parseFloat(
            document.getElementById("inp-height").value
        );

    const result =
        document.getElementById("res-bmi");

    if (
        !Number.isFinite(weight) ||
        !Number.isFinite(height) ||
        weight <= 0 ||
        height <= 0
    ) {
        result.innerText =
            "BMI: 0";
        return;
    }

    const heightMeters =
        height / 100;

    const bmi =
        weight / (heightMeters * heightMeters);

    let category = "";

    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi < 25) {
        category = "Normal";
    } else if (bmi < 30) {
        category = "Overweight";
    } else {
        category = "Obesity";
    }

    result.innerText =
        `BMI: ${bmi.toFixed(1)} — ${category}`;
}

/* =========================================================
   GST
========================================================= */

function calcGST() {

    const amount =
        parseFloat(
            document.getElementById("inp-gst-amt").value
        );

    const rate =
        parseFloat(
            document.getElementById("inp-gst-rate").value
        );

    const result =
        document.getElementById("res-gst");

    if (
        !Number.isFinite(amount) ||
        !Number.isFinite(rate)
    ) {
        result.innerText =
            "GST: 0 | Total: 0";
        return;
    }

    const gst =
        amount * (rate / 100);

    const total =
        amount + gst;

    result.innerText =
        `GST: ${gst.toFixed(2)} | Total: ${total.toFixed(2)}`;
}

/* =========================================================
   SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker
            .register("./sw.js")
            .then(function () {
                console.log(
                    "Analogue Calculator: Service Worker registered."
                );
            })
            .catch(function (error) {
                console.log(
                    "Service Worker registration skipped:",
                    error
                );
            });
    });
}