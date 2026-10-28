// DOM Elements
const tempForm = document.getElementById('tempForm');
const tempInput = document.getElementById('tempInput');
const currentUnitSymbol = document.getElementById('currentUnitSymbol');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const swapUnitsBtn = document.getElementById('swapUnitsBtn');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');

// Result Elements
const thermalStateBadge = document.getElementById('thermalStateBadge');
const primaryResultLabel = document.getElementById('primaryResultLabel');
const primaryResultValue = document.getElementById('primaryResultValue');
const primaryFormulaText = document.getElementById('primaryFormulaText');
const copyResultBtn = document.getElementById('copyResultBtn');
const copyTooltip = document.getElementById('copyTooltip');

// Multi-Unit Cards
const cardCelsius = document.getElementById('cardCelsius');
const cardFahrenheit = document.getElementById('cardFahrenheit');
const cardKelvin = document.getElementById('cardKelvin');
const valCelsius = document.getElementById('valCelsius');
const valFahrenheit = document.getElementById('valFahrenheit');
const valKelvin = document.getElementById('valKelvin');

// Preset Pills
const presetPills = document.querySelectorAll('.preset-pill');

// Physical Constants (Absolute Zero limits)
const ABSOLUTE_ZERO = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0
};

// Unit Symbols map
const UNIT_SYMBOLS = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K'
};

const UNIT_NAMES = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin'
};

function formatNumber(num) {
  if (Number.isInteger(num)) return num.toString();
  const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function validateInput(rawVal, unit, isTyping = false) {
  const trimmed = rawVal.trim();

  if (trimmed === '') {
    return {
      isValid: false,
      isViolation: false,
      isPending: false,
      message: 'Please enter a temperature value.'
    };
  }

  if (isTyping && (trimmed === '-' || trimmed === '+' || trimmed === '.' || trimmed === '-.' || trimmed === '+.')) {
    return {
      isValid: false,
      isViolation: false,
      isPending: true,
      message: 'Enter temperature value...'
    };
  }

  const numericPattern = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
  if (!numericPattern.test(trimmed)) {
    return {
      isValid: false,
      isViolation: false,
      isPending: false,
      message: 'Invalid input. Please enter a valid number (e.g., 25, -10.5).'
    };
  }

  const num = Number(trimmed);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return {
      isValid: false,
      isViolation: false,
      isPending: false,
      message: 'Entered value is not a valid finite number.'
    };
  }

  // Absolute zero check
  const limit = ABSOLUTE_ZERO[unit];
  if (num < limit) {
    const symbol = UNIT_SYMBOLS[unit];
    return {
      isValid: false,
      isViolation: true,
      isPending: false,
      numValue: num,
      message: `Absolute Zero Violation: ${num} ${symbol} is below absolute zero (${limit} ${symbol}). Temperature cannot exist below absolute zero!`
    };
  }

  return {
    isValid: true,
    isViolation: false,
    isPending: false,
    numValue: num
  };
}

function showError(msg, isViolation = false) {
  errorMessage.textContent = (isViolation ? '⚠️ ' : '✕ ') + msg;
  errorMessage.className = isViolation ? 'error-message show-warning' : 'error-message show-error';
  tempInput.classList.add('input-error');
  tempInput.classList.remove('input-success');
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.className = 'error-message';
  tempInput.classList.remove('input-error');
}

function updateInputSymbol() {
  const from = fromUnitSelect.value;
  currentUnitSymbol.textContent = UNIT_SYMBOLS[from] || '';
}

function convertTemperatures(value, fromUnit) {
  let c, f, k;

  switch (fromUnit) {
    case 'celsius':
      c = value;
      f = (value * 9) / 5 + 32;
      k = value + 273.15;
      break;

    case 'fahrenheit':
      c = ((value - 32) * 5) / 9;
      f = value;
      k = ((value - 32) * 5) / 9 + 273.15;
      break;

    case 'kelvin':
      c = value - 273.15;
      f = ((value - 273.15) * 9) / 5 + 32;
      k = value;
      break;

    default:
      c = value;
      f = (value * 9) / 5 + 32;
      k = value + 273.15;
  }

  // Prevent Kelvin from displaying as negative zero due to tiny float rounding
  if (Math.abs(k) < 1e-10) k = 0;

  return { c, f, k };
}

function getFormulaText(value, from, to) {
  const valStr = formatNumber(value);

  if (from === to) {
    return `Identical unit: ${valStr} ${UNIT_SYMBOLS[from]} = ${valStr} ${UNIT_SYMBOLS[to]}`;
  }

  if (from === 'celsius' && to === 'fahrenheit') {
    return `Formula: (${valStr}°C × 9/5) + 32`;
  }
  if (from === 'celsius' && to === 'kelvin') {
    return `Formula: ${valStr}°C + 273.15`;
  }
  if (from === 'fahrenheit' && to === 'celsius') {
    return `Formula: (${valStr}°F - 32) × 5/9`;
  }
  if (from === 'fahrenheit' && to === 'kelvin') {
    return `Formula: (${valStr}°F - 32) × 5/9 + 273.15`;
  }
  if (from === 'kelvin' && to === 'celsius') {
    return `Formula: ${valStr}K - 273.15`;
  }
  if (from === 'kelvin' && to === 'fahrenheit') {
    return `Formula: (${valStr}K - 273.15) × 9/5 + 32`;
  }

  return 'Simultaneous conversion for Celsius, Fahrenheit, and Kelvin';
}

function updateThermalBadge(celsiusVal) {
  thermalStateBadge.className = 'precision-badge';

  if (celsiusVal <= -200) {
    thermalStateBadge.textContent = 'Cryogenic';
    thermalStateBadge.classList.add('state-cold');
  } else if (celsiusVal <= 0) {
    thermalStateBadge.textContent = 'Freezing';
    thermalStateBadge.classList.add('state-cold');
  } else if (celsiusVal > 0 && celsiusVal <= 30) {
    thermalStateBadge.textContent = 'Moderate';
    thermalStateBadge.classList.add('state-moderate');
  } else if (celsiusVal > 30 && celsiusVal <= 80) {
    thermalStateBadge.textContent = 'Warm / Hot';
    thermalStateBadge.classList.add('state-hot');
  } else {
    thermalStateBadge.textContent = 'Extreme Heat';
    thermalStateBadge.classList.add('state-extreme');
  }
}

function updateCardHighlights(fromUnit, toUnit) {
  [cardCelsius, cardFahrenheit, cardKelvin].forEach(card => card.classList.remove('active-unit'));

  if (toUnit === 'all') {
    // highlight all output units
    cardCelsius.classList.add('active-unit');
    cardFahrenheit.classList.add('active-unit');
    cardKelvin.classList.add('active-unit');
  } else {
    if (toUnit === 'celsius') cardCelsius.classList.add('active-unit');
    if (toUnit === 'fahrenheit') cardFahrenheit.classList.add('active-unit');
    if (toUnit === 'kelvin') cardKelvin.classList.add('active-unit');
  }
}

function handleConversion() {
  const rawInput = tempInput.value;
  const from = fromUnitSelect.value;
  const to = toUnitSelect.value;

  const validation = validateInput(rawInput, from);

  if (!validation.isValid) {
    showError(validation.message, validation.isViolation);
    resetResultDisplay();
    return;
  }

  clearError();
  tempInput.classList.add('input-success');

  const { numValue } = validation;
  const { c, f, k } = convertTemperatures(numValue, from);

  // Update multi-unit display cards
  valCelsius.textContent = `${formatNumber(c)} °C`;
  valFahrenheit.textContent = `${formatNumber(f)} °F`;
  valKelvin.textContent = `${formatNumber(k)} K`;

  // Update primary showcase
  if (to === 'all') {
    primaryResultLabel.textContent = `All Conversions from ${UNIT_NAMES[from]} (${formatNumber(numValue)}${UNIT_SYMBOLS[from]})`;
    if (from === 'celsius') {
      primaryResultValue.textContent = `${formatNumber(f)} °F  /  ${formatNumber(k)} K`;
    } else if (from === 'fahrenheit') {
      primaryResultValue.textContent = `${formatNumber(c)} °C  /  ${formatNumber(k)} K`;
    } else {
      primaryResultValue.textContent = `${formatNumber(c)} °C  /  ${formatNumber(f)} °F`;
    }
    primaryFormulaText.textContent = getFormulaText(numValue, from, 'all');
  } else {
    let targetFormattedVal = '';
    if (to === 'celsius') targetFormattedVal = `${formatNumber(c)} °C`;
    else if (to === 'fahrenheit') targetFormattedVal = `${formatNumber(f)} °F`;
    else if (to === 'kelvin') targetFormattedVal = `${formatNumber(k)} K`;

    primaryResultLabel.textContent = `Converted to ${UNIT_NAMES[to]}`;
    primaryResultValue.textContent = targetFormattedVal;
    primaryFormulaText.textContent = getFormulaText(numValue, from, to);
  }

  // Thermal state badge
  updateThermalBadge(c);

  // Active highlights
  updateCardHighlights(from, to);
}

function resetResultDisplay() {
  primaryResultLabel.textContent = 'Target Conversion';
  primaryResultValue.textContent = '--';
  primaryFormulaText.textContent = 'Formula: Select input and press Convert';
  valCelsius.textContent = '--';
  valFahrenheit.textContent = '--';
  valKelvin.textContent = '--';
  thermalStateBadge.textContent = 'Normal';
  thermalStateBadge.className = 'precision-badge';
  [cardCelsius, cardFahrenheit, cardKelvin].forEach(c => c.classList.remove('active-unit'));
}

/**
 * Swap "From" and "To" units
 */
function swapUnits() {
  const currentFrom = fromUnitSelect.value;
  const currentTo = toUnitSelect.value;

  if (currentTo === 'all') {
    // If To is all, cycle from Celsius -> Fahrenheit -> Kelvin
    const nextMap = { celsius: 'fahrenheit', fahrenheit: 'kelvin', kelvin: 'celsius' };
    fromUnitSelect.value = nextMap[currentFrom] || 'celsius';
  } else {
    // Normal swap
    fromUnitSelect.value = currentTo;
    toUnitSelect.value = currentFrom;
  }

  updateInputSymbol();

  // If input already contains a valid value, recalculate immediately
  if (tempInput.value.trim() !== '') {
    handleConversion();
  }
}

function copyResult() {
  const text = primaryResultValue.textContent;
  if (!text || text === '--') return;

  navigator.clipboard.writeText(text).then(() => {
    copyTooltip.textContent = 'Copied!';
    copyResultBtn.style.color = 'var(--success-color)';
    setTimeout(() => {
      copyTooltip.textContent = 'Copy';
      copyResultBtn.style.color = '';
    }, 1800);
  }).catch(() => {
    copyTooltip.textContent = 'Failed';
  });
}

// ---------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------

// Submit / Convert
tempForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleConversion();
});

// Real-time input validation & typing response
tempInput.addEventListener('input', () => {
  const raw = tempInput.value;
  if (raw.trim() === '') {
    clearError();
    resetResultDisplay();
    return;
  }

  const from = fromUnitSelect.value;
  const validation = validateInput(raw, from, true);

  if (validation.isPending) {
    // User is currently typing a sign or dot (e.g. "-")
    clearError();
    return;
  }

  if (!validation.isValid) {
    showError(validation.message, validation.isViolation);
    resetResultDisplay();
  } else {
    clearError();
    // Live update results as user types!
    handleConversion();
  }
});

// From unit change
fromUnitSelect.addEventListener('change', () => {
  updateInputSymbol();
  if (tempInput.value.trim() !== '') {
    handleConversion();
  }
});

// To unit change
toUnitSelect.addEventListener('change', () => {
  if (tempInput.value.trim() !== '') {
    handleConversion();
  }
});

// Swap button
swapUnitsBtn.addEventListener('click', swapUnits);

// Reset button
resetBtn.addEventListener('click', () => {
  tempForm.reset();
  fromUnitSelect.value = 'celsius';
  toUnitSelect.value = 'all';
  updateInputSymbol();
  clearError();
  resetResultDisplay();
  tempInput.focus();
});

// Copy button
copyResultBtn.addEventListener('click', copyResult);

// Preset pills click
presetPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const val = pill.getAttribute('data-val');
    const unit = pill.getAttribute('data-unit');
    tempInput.value = val;
    fromUnitSelect.value = unit;
    updateInputSymbol();
    handleConversion();
    tempInput.focus();
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateInputSymbol();
  // Set default initial demo value: 25°C
  tempInput.value = '25';
  handleConversion();
});
