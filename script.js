let currentInput = '';
let shouldResetDisplay = false;
const display = document.getElementById('display');

function updateDisplay() {
  display.value = currentInput;
}

function deleteLastDigit() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function appendToDisplay(value) {
  if (shouldResetDisplay) {
    currentInput = value;
    shouldResetDisplay = false;
  } else {
    // Check if the last character is an operator
    const lastCharIsOperator = /[+\-*/]$/.test(currentInput);

    // If the current value is an operator and the last character is an operator, replace the last operator
    if (/^[+\-*/]$/.test(value) && lastCharIsOperator) {
      currentInput = currentInput.slice(0, -1) + value;
    } else {
      currentInput += value;
    }
  }

  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

function calculate() {
  try {
    const result = evaluateExpression(currentInput);
    currentInput = result.toString();
    shouldResetDisplay = true;
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    shouldResetDisplay = true;
    updateDisplay();
  }
}

function evaluateExpression(expression) {
  const tokens = tokenizeExpression(expression);
  const postfix = infixToPostfix(tokens);
  return calculatePostfix(postfix);
}

function tokenizeExpression(expression) {
  return expression.match(/([0-9]+|\+|\-|\*|\/|\(|\))/g) || [];
}

function infixToPostfix(infixTokens) {
  const output = [];
  const stack = [];

  for (const token of infixTokens) {
    if (!isNaN(parseFloat(token))) {
      output.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      stack.pop(); // Remove the '(' from the stack
    } else {
      while (
        stack.length > 0 &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    }
  }

  while (stack.length > 0) {
    output.push(stack.pop());
  }

  return output;
}

function calculatePostfix(postfixTokens) {
  const stack = [];

  for (const token of postfixTokens) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else {
      const operand2 = stack.pop();
      const operand1 = stack.pop();

      switch (token) {
        case '+':
          stack.push(operand1 + operand2);
          break;
        case '-':
          stack.push(operand1 - operand2);
          break;
        case '*':
          stack.push(operand1 * operand2);
          break;
        case '/':
          if (operand2 !== 0) {
            stack.push(operand1 / operand2);
          } else {
            throw new Error('Division by zero');
          }
          break;
        default:
          throw new Error('Invalid operator');
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack.pop();
}

function getPrecedence(operator) {
  switch (operator) {
    case '+':
    case '-':
      return 1;
    case '*':
    case '/':
      return 2;
    default:
      return 0; // for parentheses
  }
}

updateDisplay();
