/* =========================================
   ANALOGUE CALCULATOR
   Main JavaScript
   ========================================= */


/* ---------- Display Elements ---------- */

const previousDisplay = document.querySelector(".previous-display");
const currentDisplay = document.querySelector(".current-display");

const buttons = document.querySelectorAll("button");


/* ---------- Calculator State ---------- */

let currentValue = "0";
let previousValue = "";
let operator = null;
let waitingForNewValue = false;


/* ---------- Update Display ---------- */

function updateDisplay() {
    currentDisplay.textContent = currentValue;

    previousDisplay.textContent =
        previousValue && operator
            ? `${previousValue} ${operator}`
            : "";
}


/* ---------- Format Number ---------- */

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    const rounded = Number.parseFloat(
        Number(number).toPrecision(12)
    );

    return rounded.toString();
}


/* ---------- Input Number ---------- */

function inputNumber(number) {

    if (currentValue === "Error") {
        clearAll();
    }

    if (waitingForNewValue) {
        currentValue = number;
        waitingForNewValue = false;
        updateDisplay();
        return;
    }

    if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


/* ---------- Input Decimal ---------- */

function inputDecimal() {

    if (currentValue === "Error") {
        clearAll();
    }

    if (waitingForNewValue) {
        currentValue = "0.";
        waitingForNewValue = false;
        updateDisplay();
        return;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}


/* ---------- Choose Operator ---------- */

function chooseOperator(nextOperator) {

    if (currentValue === "Error") {
        return;
    }

    if (operator && waitingForNewValue) {
        operator = nextOperator;
        updateDisplay();
        return;
    }

    if (operator && previousValue !== "") {
        calculate();
    }

    previousValue = currentValue;
    operator = nextOperator;
    waitingForNewValue = true;

    updateDisplay();
}


/* ---------- Calculate ---------- */

function calculate() {

    if (
        operator === null ||
        previousValue === "" ||
        currentValue === "Error"
    ) {
        return;
    }

    const firstNumber = Number(previousValue);
    const secondNumber = Number(currentValue);

    let result;


    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "−":
        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
        case "*":
            result = firstNumber * secondNumber;
            break;

        case "÷":
        case "/":

            if (secondNumber === 0) {
                showError("Cannot divide by zero");
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }


    currentValue = formatNumber(result);

    previousValue = "";
    operator = null;
    waitingForNewValue = true;

    updateDisplay();
}


/* ---------- Percentage ---------- */

function calculatePercentage() {

    if (currentValue === "Error") {
        return;
    }

    const number = Number(currentValue);

    if (!Number.isFinite(number)) {
        showError("Invalid number");
        return;
    }

    currentValue = formatNumber(number / 100);

    updateDisplay();
}


/* ---------- Delete ---------- */

function deleteLast() {

    if (currentValue === "Error") {
        clearAll();
        return;
    }

    if (waitingForNewValue) {
        return;
    }

    if (currentValue.length <= 1) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);

        if (currentValue === "-") {
            currentValue = "0";
        }
    }

    updateDisplay();
}


/* ---------- Clear All ---------- */

function clearAll() {

    currentValue = "0";
    previousValue = "";
    operator = null;
    waitingForNewValue = false;

    updateDisplay();
}


/* ---------- Error ---------- */

function showError(message = "Error") {

    currentValue = "Error";
    previousValue = message;
    operator = null;
    waitingForNewValue = true;

    updateDisplay();
}


/* ---------- Button Click Handler ---------- */

function handleButton(button) {

    const value = button.textContent.trim();

    /* Number */
    if (/^\d$/.test(value)) {
        inputNumber(value);
        return;
    }


    /* Decimal */
    if (value === ".") {
        inputDecimal();
        return;
    }


    /* Clear */
    if (value === "AC") {
        clearAll();
        return;
    }


    /* Delete */
    if (value === "DEL") {
        deleteLast();
        return;
    }


    /* Percentage */
    if (value === "%") {
        calculatePercentage();
        return;
    }


    /* Operators */
    if (
        value === "+" ||
        value === "−" ||
        value === "×" ||
        value === "÷"
    ) {
        chooseOperator(value);
        return;
    }


    /* Equals */
    if (value === "=") {
        calculate();
    }
}


/* ---------- Add Button Events ---------- */

buttons.forEach((button) => {

    button.addEventListener("click", () => {
        handleButton(button);
    });

});


/* ---------- Keyboard Support ---------- */

document.addEventListener("keydown", (event) => {

    const key = event.key;


    /* Numbers */
    if (/^\d$/.test(key)) {
        inputNumber(key);
        return;
    }


    /* Decimal */
    if (key === ".") {
        inputDecimal();
        return;
    }


    /* Operators */

    if (key === "+") {
        chooseOperator("+");
        return;
    }

    if (key === "-") {
        chooseOperator("−");
        return;
    }

    if (key === "*") {
        chooseOperator("×");
        return;
    }

    if (key === "/") {

        event.preventDefault();

        chooseOperator("÷");
        return;
    }


    /* Enter / Equals */

    if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();

        calculate();
        return;
    }


    /* Backspace */

    if (key === "Backspace") {
        deleteLast();
        return;
    }


    /* Escape */

    if (
        key === "Escape" ||
        key === "Delete"
    ) {
        clearAll();
        return;
    }


    /* Percentage */

    if (key === "%") {
        calculatePercentage();
    }

});


/* ---------- Initial Display ---------- */

updateDisplay();