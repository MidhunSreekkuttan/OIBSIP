document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const historyDisplay = document.getElementById('history-display');
  const currentDisplay = document.getElementById('current-display');
  const clearBtn = document.querySelector('.btn[data-action="clear"]');
  const buttons = document.querySelectorAll('.btn');

  // Calculator State
  let currentInput = '0';
  let expressionTokens = [];
  let justEvaluated = false;
  let hasError = false;
  let activeOperator = null;

  const DISPLAY_OPERATORS = {
    '+': '+',
    '-': '−',
    '−': '−',
    '*': '×',
    '×': '×',
    '/': '÷',
    '÷': '÷'
  };

  function getLastOperand() {
    for (let i = expressionTokens.length - 1; i >= 0; i--) {
      const token = expressionTokens[i];
      if (!['+', '−', '×', '÷', '-', '*', '/'].includes(token)) {
        return token;
      }
    }
    return '0';
  }

  /**
   * Updates the UI display screens
   */
  function updateDisplay() {
    if (hasError) {
      currentDisplay.textContent = currentInput;
      currentDisplay.classList.add('error-state');
    } else {
      currentDisplay.classList.remove('error-state');

      if (currentInput !== '') {
        currentDisplay.textContent = currentInput;
      } else if (expressionTokens.length > 0) {
        // While waiting for the next operand after an operator, keep displaying the previous value
        currentDisplay.textContent = getLastOperand();
      } else {
        currentDisplay.textContent = '0';
      }
    }

    // Dynamic label for Clear button: 'C' when typing input, 'AC' when input is 0 or cleared
    if (clearBtn) {
      if (currentInput !== '' && currentInput !== '0' && !justEvaluated) {
        clearBtn.textContent = 'C';
        clearBtn.setAttribute('aria-label', 'Clear current entry');
      } else {
        clearBtn.textContent = 'AC';
        clearBtn.setAttribute('aria-label', 'All Clear');
      }
    }

    // Build history display text
    if (expressionTokens.length > 0) {
      const historyStr = expressionTokens.map(token => {
        return DISPLAY_OPERATORS[token] ? ` ${DISPLAY_OPERATORS[token]} ` : token;
      }).join('');
      historyDisplay.textContent = historyStr;
    } else if (justEvaluated) {
      // Keep existing history text showing the evaluated equation
    } else {
      historyDisplay.innerHTML = '&nbsp;';
    }

    updateActiveOperatorUI();
  }

  /**
   * Highlights the active operator button
   */
  function updateActiveOperatorUI() {
    buttons.forEach(btn => {
      const op = btn.getAttribute('data-operator');
      if (op && activeOperator && (op === activeOperator || DISPLAY_OPERATORS[op] === DISPLAY_OPERATORS[activeOperator])) {
        btn.classList.add('is-active-op');
      } else {
        btn.classList.remove('is-active-op');
      }
    });
  }

  /**
   * Clears error state
   */
  function clearError() {
    if (hasError) {
      hasError = false;
      currentInput = '0';
      expressionTokens = [];
      activeOperator = null;
    }
  }

  /**
   * Handles numeric input (0-9)
   */
  function handleNumber(num) {
    if (hasError) clearError();

    // If calculation just completed, starting with a digit starts a fresh calculation
    if (justEvaluated) {
      currentInput = num;
      expressionTokens = [];
      justEvaluated = false;
      activeOperator = null;
      updateDisplay();
      return;
    }

    activeOperator = null;

    if (currentInput === '0' || currentInput === '') {
      currentInput = num;
    } else {
      // Prevent input from exceeding 16 digits
      if (currentInput.replace(/[-.]/g, '').length >= 16) return;
      currentInput += num;
    }

    updateDisplay();
  }

  /**
   * Handles decimal point input (.)
   */
  function handleDecimal() {
    if (hasError) clearError();

    if (justEvaluated) {
      currentInput = '0.';
      expressionTokens = [];
      justEvaluated = false;
      activeOperator = null;
      updateDisplay();
      return;
    }

    activeOperator = null;

    if (currentInput === '' || currentInput === '0') {
      currentInput = '0.';
    } else if (!currentInput.includes('.')) {
      currentInput += '.';
    }

    updateDisplay();
  }

  function handleOperator(op) {
    if (hasError) return;

    const standardOp = DISPLAY_OPERATORS[op] || op;

    // Chain from previous calculation result
    if (justEvaluated) {
      expressionTokens = [currentInput, standardOp];
      currentInput = '';
      justEvaluated = false;
      activeOperator = standardOp;
      updateDisplay();
      return;
    }

    if (currentInput !== '') {
      expressionTokens.push(currentInput);
      expressionTokens.push(standardOp);
      currentInput = '';
      activeOperator = standardOp;
    } else if (expressionTokens.length > 0) {
      // Consecutive operator pressed: replace previous operator with new one
      expressionTokens[expressionTokens.length - 1] = standardOp;
      activeOperator = standardOp;
    } else {
      // If expression is empty and no input, use 0 as left-hand operand
      expressionTokens.push('0');
      expressionTokens.push(standardOp);
      activeOperator = standardOp;
    }

    updateDisplay();
  }

  /**
   * Evaluates the complete token expression respecting operator precedence (BODMAS/PEMDAS)
   */
  function evaluateTokens(tokens) {
    const sanitized = tokens.map(token => {
      if (token === '×') return '*';
      if (token === '÷') return '/';
      if (token === '−') return '-';
      return token;
    });

    // Pass 1: Multiplication and Division
    const pass1 = [];
    let i = 0;
    while (i < sanitized.length) {
      const token = sanitized[i];
      if (token === '*' || token === '/') {
        const prevOperand = parseFloat(pass1.pop());
        const nextOperand = parseFloat(sanitized[i + 1]);

        if (isNaN(prevOperand) || isNaN(nextOperand)) {
          return { error: 'Error' };
        }

        // Division by zero check: display clear error message instead of crashing
        if (token === '/' && nextOperand === 0) {
          return { error: 'Cannot divide by zero' };
        }

        const res = (token === '*') ? prevOperand * nextOperand : prevOperand / nextOperand;
        pass1.push(res.toString());
        i += 2;
      } else {
        pass1.push(token);
        i++;
      }
    }

    // Pass 2: Addition and Subtraction
    let result = parseFloat(pass1[0]);
    if (isNaN(result)) return { error: 'Error' };

    let j = 1;
    while (j < pass1.length) {
      const op = pass1[j];
      const nextOperand = parseFloat(pass1[j + 1]);

      if (isNaN(nextOperand)) {
        return { error: 'Error' };
      }

      if (op === '+') {
        result += nextOperand;
      } else if (op === '-') {
        result -= nextOperand;
      }
      j += 2;
    }

    // Clean floating-point inaccuracies (e.g., 0.1 + 0.2 = 0.3)
    const cleanedResult = parseFloat(result.toPrecision(12));

    return { value: cleanedResult.toString() };
  }

  /**
   * Handles equals (=) evaluation
   */
  function handleEquals() {
    if (hasError) return;

    if (expressionTokens.length === 0) {
      return;
    }

    // Append current input if available
    if (currentInput !== '') {
      expressionTokens.push(currentInput);
    } else {
      // If trailing operator, remove it
      if (['+', '−', '×', '÷', '-', '*', '/'].includes(expressionTokens[expressionTokens.length - 1])) {
        expressionTokens.pop();
      }
    }

    if (expressionTokens.length === 0) {
      updateDisplay();
      return;
    }

    const fullHistory = expressionTokens
      .map(token => DISPLAY_OPERATORS[token] ? DISPLAY_OPERATORS[token] : token)
      .join(' ') + ' =';

    const evalResult = evaluateTokens(expressionTokens);

    if (evalResult.error) {
      hasError = true;
      currentInput = evalResult.error;
      historyDisplay.textContent = fullHistory;
      currentDisplay.textContent = currentInput;
      currentDisplay.classList.add('error-state');
    } else {
      currentInput = evalResult.value;
      historyDisplay.textContent = fullHistory;
      currentDisplay.textContent = currentInput;
      justEvaluated = true;
    }

    expressionTokens = [];
    activeOperator = null;
    updateActiveOperatorUI();
  }

  /**
   * Handles backspace / delete (DEL)
   */
  function handleBackspace() {
    if (hasError) {
      handleClear();
      return;
    }

    if (justEvaluated) {
      historyDisplay.innerHTML = '&nbsp;';
      justEvaluated = false;
      return;
    }

    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
      if (currentInput === '-') currentInput = '0';
    } else if (currentInput.length === 1 && currentInput !== '0') {
      currentInput = '0';
    } else if (currentInput === '' && expressionTokens.length > 0) {
      // If waiting on an operator, remove operator and restore previous operand for editing
      const lastToken = expressionTokens.pop();
      if (['+', '−', '×', '÷', '-', '*', '/'].includes(lastToken) && expressionTokens.length > 0) {
        currentInput = expressionTokens.pop();
      }
      activeOperator = null;
    }

    updateDisplay();
  }

  /**
   * Handles Clear button (C / AC)
   */
  function handleClear() {
    // If user is editing a number, first press clears current input (C); second press clears all (AC)
    if (currentInput !== '' && currentInput !== '0' && expressionTokens.length > 0 && !justEvaluated) {
      currentInput = '0';
    } else {
      currentInput = '0';
      expressionTokens = [];
      justEvaluated = false;
      hasError = false;
      activeOperator = null;
      historyDisplay.innerHTML = '&nbsp;';
    }

    updateDisplay();
  }

  /**
   * Handles percentage calculation (%)
   */
  function handlePercent() {
    if (hasError) return;

    const targetVal = currentInput !== '' ? currentInput : getLastOperand();
    const val = parseFloat(targetVal);

    if (!isNaN(val)) {
      const percentVal = parseFloat((val / 100).toPrecision(12));
      currentInput = percentVal.toString();
      updateDisplay();
    }
  }

  /**
   * Handles sign toggle (±)
   */
  function handleNegate() {
    if (hasError) return;

    if (currentInput !== '' && currentInput !== '0') {
      if (currentInput.startsWith('-')) {
        currentInput = currentInput.slice(1);
      } else {
        currentInput = '-' + currentInput;
      }
      updateDisplay();
    }
  }

  /**
   * Triggers visual press effect on a button element
   */
  function triggerButtonEffect(button) {
    if (!button) return;
    button.classList.add('btn-pressed');
    setTimeout(() => {
      button.classList.remove('btn-pressed');
    }, 120);
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      triggerButtonEffect(button);

      const number = button.getAttribute('data-number');
      const operator = button.getAttribute('data-operator');
      const action = button.getAttribute('data-action');
      const decimal = button.getAttribute('data-decimal');

      if (number !== null) {
        handleNumber(number);
      } else if (decimal !== null) {
        handleDecimal();
      } else if (operator !== null) {
        handleOperator(operator);
      } else if (action !== null) {
        switch (action) {
          case 'clear':
            handleClear();
            break;
          case 'delete':
            handleBackspace();
            break;
          case 'equals':
            handleEquals();
            break;
          case 'percent':
            handlePercent();
            break;
          case 'negate':
            handleNegate();
            break;
        }
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    let matchedBtn = null;

    if (e.key >= '0' && e.key <= '9') {
      matchedBtn = document.querySelector(`.btn[data-number="${e.key}"]`);
      handleNumber(e.key);
    } else if (e.key === '.') {
      matchedBtn = document.querySelector('.btn[data-decimal="."]');
      handleDecimal();
    } else if (e.key === '+') {
      matchedBtn = document.querySelector('.btn[data-operator="+"]');
      handleOperator('+');
    } else if (e.key === '-') {
      matchedBtn = document.querySelector('.btn[data-operator="−"]');
      handleOperator('−');
    } else if (e.key === '*') {
      matchedBtn = document.querySelector('.btn[data-operator="×"]');
      handleOperator('×');
    } else if (e.key === '/') {
      e.preventDefault();
      matchedBtn = document.querySelector('.btn[data-operator="÷"]');
      handleOperator('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      matchedBtn = document.querySelector('.btn[data-action="equals"]');
      handleEquals();
    } else if (e.key === 'Backspace') {
      matchedBtn = document.querySelector('.btn[data-action="delete"]');
      handleBackspace();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      matchedBtn = document.querySelector('.btn[data-action="clear"]');
      handleClear();
    } else if (e.key === '%') {
      matchedBtn = document.querySelector('.btn[data-action="percent"]');
      handlePercent();
    }

    if (matchedBtn) {
      triggerButtonEffect(matchedBtn);
    }
  });

  // Initial render
  updateDisplay();
});
