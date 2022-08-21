const calculatorData = {
  calculation: '',
  result: '',
  displayedResults: false,
};

const buttons = [...document.querySelectorAll('[data-action')];
const digitsBtns = buttons.filter((button) =>
  /[0-9]/.test(button.getAttribute('data-action')),
);

digitsBtns.forEach((btn) => btn.addEventListener('click', handleDigits));

const calculationDisplay = document.querySelector('.calculation');
const resultDisplay = document.querySelector('.result');

function handleDigits(e) {
  const buttonValue = e.target.getAttribute('data-action');

  if (calculatorData.calculation === 0) calculatorData.calculation = '';

  calculatorData.calculation += buttonValue;
  resultDisplay.textContent = calculatorData.calculation;
}

const operatorsBtns = buttons.filter((button) =>
  /[\/+*-.]/.test(button.getAttribute('data-action')),
);

operatorsBtns.forEach((btn) => btn.addEventListener('click', handleOperators));

function handleOperators(e) {
  const buttonValue = e.target.getAttribute('data-action');

  if (!calculatorData.calculation && buttonValue === '-') {
    calculatorData.calculation += buttonValue;
    resultDisplay.textContent = calculatorData.calculation;
    return;
  } else if (!calculatorData.calculation) return;
  else if (calculatorData.calculation.slice(-1).match(/[\/+*-]/)) {
    calculatorData.calculation =
      calculatorData.calculation.slice(0, -1) + buttonValue;
    resultDisplay.textContent = calculatorData.calculation;
  } else {
    calculatorData.calculation += buttonValue;
    resultDisplay.textContent = calculatorData.calculation;
  }
}

const equalBtn = document.querySelector("[data-action='='");

equalBtn.addEventListener('click', handleEqualBtn);

function handleEqualBtn() {
  if (/[\/+*-.]/.test(calculatorData.calculation.slice(-1))) {
    calculationDisplay.textContent = 'Please end the calculation with a number';
    setTimeout(() => {
      calculationDisplay.textContent = '';
    }, 2500);
    return;
  } else if (!calculatorData.displayedResults) {
    calculatorData.result = customEval(calculatorData.calculation);
  }
}

customEval('5500*10');

function customEval(calculation) {
  if (!/[\/+*-]/.test(calculation.slice(1))) return;
  calculation;

  let operator;
  let operatorIndex;

  if (/[\/*]/.test(calculation.slice(1))) {
    for (let i = 1; i < calculation.length; i++) {
      if (/[\/*]/.test(calculation[i])) {
        operator = calculation[i];
        operatorIndex = i;
        break;
      }
    }
  } else {
    for (let i = 1; i < calculation.length; i++) {
      if (/[+-]/.test(calculation[i])) {
        operator = calculation[i];
        operatorIndex = i;
        break;
      }
    }
  }

  const operands = getIndexes(operatorIndex, calculation);
  console.log(operands);
}

function getIndexes(operatorIndex, calculation) {
  let rightOperand = '';
  let endIntervalIndex;

  for (let i = operatorIndex + 1; i <= calculation.length; i++) {
    if (i === calculation.length) {
      endIntervalIndex = calculation.length;
      break;
    } else if (/[\/+*-]/.test(calculation[i])) {
      endIntervalIndex = i;
      break;
    } else {
      rightOperand += calculation[i];
    }
  }

  let leftOperand = '';
  let startIntervalIndex;

  for (let i = operatorIndex - 1; i >= 0; i--) {
    if (i === 0 && /[-]/.test(calculation[i])) {
      startIntervalIndex = 0;
      leftOperand += '-';
      break;
    } else if (i === 0) {
      startIntervalIndex = 0;
      leftOperand += calculation[i];
      break;
    } else if (/[\/+*-]/.test(calculation[i])) {
      startIntervalIndex = i + 1;
      break;
    } else {
      leftOperand += calculation[i];
    }
  }

  leftOperand = leftOperand.split('').reverse().join('');
  return {
    leftOperand,
    rightOperand,
    startIntervalIndex,
    endIntervalIndex,
  };
}
