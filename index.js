const InputNode = document.querySelector("#calculate_input");
const numberBtn = document.querySelectorAll(".number-btn");
const operatorBtn = document.querySelectorAll(".operator-btn");
const clearBtn = document.querySelector("#clear_btn");
const cancelBtn = document.querySelector("#cancel_btn");
const completeBtn = document.querySelector("#complete_btn");
const calcTable = document.querySelector(".btns-table");
const logContainer = document.querySelector(".log-container");
const seeLogBtn = document.querySelector("#see_log_btn");
const resultLogs = [];

function addInputValue(value) {
  InputNode.value += value;
}

function clearAll() {
  InputNode.value = "";
}

function infixToPostfix(infixExpression) {
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
  let postfixExpression = "";
  const stack = [];
  let currentNumber = "";

  for (let i = 0; i < infixExpression.length; i++) {
    let token = infixExpression[i];

    if (/\d/.test(token)) {
      currentNumber += token;
    } else if ("+-*/".includes(token)) {
      if (currentNumber !== "") {
        postfixExpression += currentNumber + " ";
        currentNumber = "";
      }

      while (
        stack.length > 0 &&
        precedence[stack[stack.length - 1]] >= precedence[token]
      ) {
        postfixExpression += stack.pop() + " ";
      }
      stack.push(token);
    }
  }

  if (currentNumber !== "") {
    postfixExpression += currentNumber + " ";
  }

  while (stack.length > 0) {
    postfixExpression += stack.pop() + " ";
  }

  return postfixExpression.trim();
}

function evaluatePostfix(postfixExpression) {
  const stack = [];
  const operands = postfixExpression.split(" ");

  for (let i = 0; i < operands.length; i++) {
    let token = operands[i];

    if (/\d/.test(token)) {
      stack.push(Number(token));
    } else {
      let operand2 = stack.pop();
      let operand1 = stack.pop();
      switch (token) {
        case "+":
          stack.push(operand1 + operand2);
          break;
        case "-":
          stack.push(operand1 - operand2);
          break;
        case "*":
          stack.push(operand1 * operand2);
          break;
        case "/":
          stack.push(operand1 / operand2);
          break;
      }
    }
  }

  return stack.pop();
}

function showResult(expression) {
  expression = expression.replace(/X/g, "*");
  const Postfix = infixToPostfix(expression);
  const result = evaluatePostfix(Postfix);
  if (isNaN(result)) {
    InputNode.value = "올바른 식을 입력하세요.";
  } else {
    InputNode.value = result;
    resultLogs.push(`${expression} = ${result}`);
    const liElement = document.createElement("li");
    liElement.innerText = resultLogs[resultLogs.length - 1];
    logContainer.append(liElement);
  }
}

function toggleTableAndLog() {
  const calcTableDisplayStyle = window
    .getComputedStyle(calcTable)
    .getPropertyValue("display");

  if (calcTableDisplayStyle === "flex") {
    calcTable.style.display = "none";
    logContainer.style.display = "flex";
    seeLogBtn.innerText = "로그 닫기";
    if (resultLogs.length === 0) {
      logContainer.firstChild.innerText = "계산 기록이 없습니다.";
    } else {
      logContainer.firstChild.innerText = "";
    }
  } else {
    calcTable.style.display = "flex";
    logContainer.style.display = "none";
    seeLogBtn.innerText = "로그 보기";
  }
}

function undo() {
  console.log(InputNode.value);
  let popedValue = InputNode.value.toString().split("");
  popedValue.pop();
  InputNode.value = popedValue.join("");
}

numberBtn.forEach((a) =>
  a.addEventListener("click", () => {
    addInputValue(a.innerText);
  })
);
operatorBtn.forEach((a) =>
  a.addEventListener("click", () => {
    addInputValue(a.innerText);
  })
);
clearBtn.addEventListener("click", clearAll);
completeBtn.addEventListener("click", () => {
  showResult(InputNode.value);
});
seeLogBtn.addEventListener("click", toggleTableAndLog);
cancelBtn.addEventListener("click", undo);
