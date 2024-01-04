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
    localStorage.setItem(document.getElementById('display').value, result);
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
  console.log(tokens)
  const postfix = infixToPostfix(tokens);
  return calculatePostfix(postfix);
}

function tokenizeExpression(expression) {
  const matchResult = expression.match(/([0-9]+(?:\.[0-9]+)?|\+|\-|\*|\/|\(|\))/g);

  if (!matchResult) {
    throw new Error('Invalid expression');
  }

  const invalidCharacters = expression.replace(/([0-9]+(?:\.[0-9]+)?|\+|\-|\*|\/|\(|\))/g, '');

  if (invalidCharacters.trim() !== '') {
    throw new Error('Invalid characters in expression');
  }

  return matchResult;
}




function infixToPostfix(arr) {
  const output = [];
  const stack = [];

  for (const i of arr) {
    if (!isNaN(parseFloat(i))) {
      output.push(i);
    }

    else {
      while (
        stack.length > 0 &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(i)
      ) {
        output.push(stack.pop());
      }
      stack.push(i);
    }
  }
  console.log(stack)

  while (stack.length > 0) {
    output.push(stack.pop());
  }
  console.log(output)
  return output;

}

function calculatePostfix(postfixTokens) {
  console.log(postfixTokens)
  const stack = [];

  for (const i of postfixTokens) {
    if (!isNaN(parseFloat(i))) {
      stack.push(parseFloat(i));
    } else {
      const operand2 = stack.pop();
      const operand1 = stack.pop();

      switch (i) {
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
  console.log(stack)
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
      return 0; //for parentheses but in this i din't used that 
  }
}


updateDisplay();
// Your existing code...  

// Add an event listener for keydown event on the document
document.addEventListener('keyup', function (event) {
  const key = event.key;

  if (!isValidInput(key)) {
    event.preventDefault();
  } else {
    handleKeyPress(key);
  }
});
// Function to handle the key press
function handleKeyPress(key) {
  // Perform actions based on the pressed key
  switch (key) {
    case 'Enter':
      calculate();
      break;
    case 'Backspace':
      deleteLastDigit();
      break;
    default:
      // For other keys, append to the display
      appendToDisplay(key);
  }
}

// Function to check if the pressed key is a valid input
function isValidInput(key) {
  // Only allow digits, operators, parentheses, dot, Enter, and Backspace
  const validInputs = /[0-9+\-*/.()\s]|Enter|Backspace/;
  return validInputs.test(key);
}

// Your existing code...




// If shouldResetDisplay is true, it means you want to start a new input. 
// In this case, you set currentInput to the new value,
//  and you reset the flag shouldResetDisplay to false.
// If shouldResetDisplay is false, it means you're continuing an existing input.
//  The function then checks if the last character is an operator and makes decisions 
//  on whether to append or replace characters accordingly.
