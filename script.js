let currentInput = '';
let operator = '';
let firstOperand = '';
let shouldResetDisplay = false;
const display = document.getElementById('display');


function updateDisplay() {
  display.innerText = currentInput;
}

function appendNumber(number) {
  if (shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else {
    currentInput = (currentInput === '0') ? number : currentInput + number;
  }
  display.innerText += number;
  // updateDisplay();
}

function appendDecimal() {
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}
function del(){
  let currentInput = display.innerText.toString();
  display.innerText = currentInput.substr(0, currentInput.length - 1);
}


function setOperator(newOperator) {
  if (operator !== '') {
    calculate();
    firstOperand = currentInput;
    operator = newOperator;
    shouldResetDisplay = true;
  } else {
    firstOperand = currentInput;
    operator = newOperator;
    shouldResetDisplay = true;
  }

  display.innerText += newOperator;


  

}

function calculate() {
  if (operator === '' || shouldResetDisplay) {
    return;
  }

  const secondOperand = currentInput;
  let result;

  switch (operator) {
    case '+':
      result = parseFloat(firstOperand) + parseFloat(secondOperand);
      break;
    case '-':
      result = parseFloat(firstOperand) - parseFloat(secondOperand);
      break;
    case '*':
      result = parseFloat(firstOperand) * parseFloat(secondOperand);
      break;
    case '/':
      if (parseFloat(secondOperand) !== 0) {
        result = parseFloat(firstOperand) / parseFloat(secondOperand);
      } else {
        result = 'Error';
      }
      break;
    default:
      return;
  }

  currentInput = result.toString();
  operator = '';
  shouldResetDisplay = true;
  updateDisplay();
} 

function clearDisplay() {
  currentInput = '';
  operator = '';
  firstOperand = '';
  shouldResetDisplay = false;
  updateDisplay();
}
updateDisplay();
