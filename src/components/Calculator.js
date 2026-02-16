import { useState, useEffect } from "react";
import "./Calculator.css";

function Calculator() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("0");
    const [evaluated, setEvaluated] = useState(false);

  // Clear resets state to initial values.
  const handleClear = () => {
    setInput("");
    setResult("0");
    setEvaluated(false);
  };

  // Remove last character from the input
  const handleBackspace = () => {
    if (input.length === 0) return;
    const newInput = input.slice(0, -1);
    setInput(newInput);

    const match = newInput.match(/(-?\d*\.?\d+)$/);
    if (match) {
      setResult(match[0]);
    } else {
      setResult("0");
    }
  };

  const handlePlusMinus = () => {
    if (evaluated) {
      const toggled = String(Number(result) * -1);
      setResult(toggled);
      setInput(toggled);
      setEvaluated(false);
      return;
    }
    const re = /(-?\d*\.?\d+)$/;
    const match = input.match(re);
    if (match) {
      const oldNumber = match[0];
      const toggled = oldNumber.startsWith("-")
        ? oldNumber.slice(1)
        : "-" + oldNumber;
      const newInput = input.slice(0, input.length - oldNumber.length) + toggled;
      setInput(newInput);
      setResult(toggled);
    }
  };

  const handlePercent = () => {
    const re = /(-?\d*\.?\d+)$/;
    const match = input.match(re);
    if (match) {
      const original = match[0];
      const percentVal = String(Number(original) / 100);
      const newInput = input.slice(0, input.length - original.length) + percentVal;
      setInput(newInput);
      setResult(percentVal);
    }
  };

  const handleNumber = (num) => {
    // If equal was just pressed, start a new calculation.
    if (evaluated) {
      setInput(num);
      setResult(num === "0" ? "" : num);
      setEvaluated(false);
      return;
    }

    // Prevent multiple leading zeros.
    if (result === "0" && num === "0") return;
    if (result === "0" && num !== "0") {
      setResult(num);
      setInput(input === "" ? num : input + num);
    } else {
      // When the display holds an operator, start a new number.
      if (/[+\-x÷]$/.test(input)) {
        setResult(num);
      } else {
        setResult(result + num);
      }
      setInput(input + num);
    }
  };

  // Adds an operator (+, -, x, ÷).
  const handleOperator = (operator) => {
    // If the last operation was evaluation, start with the result.
    if (evaluated) {
      setInput(result + operator);
      setResult(operator);
      setEvaluated(false);
      return;
    }
    // If formula ends with an operator, adjust the expression.
    if (/[+\-x÷]$/.test(input)) {
      // Allow a negative sign to indicate a negative number.
      if (operator === "-" && input[input.length - 1] !== "-") {
        setInput(input + operator);
      } else {
        // Remove any trailing operators before appending the new one.
        let newInput = input;
        while (newInput && /[+\-x÷]$/.test(newInput)) {
          newInput = newInput.slice(0, -1);
        }
        setInput(newInput + operator);
      }
      setResult(operator);
    } else {
      setInput(input + operator);
      setResult(operator);
    }
  };

  // Adds a decimal point.
  const handleDecimal = () => {
    if (evaluated) {
      setResult("0.");
      setInput("0.");
      setEvaluated(false);
      return;
    }
    // Look at the last number entered by splitting the formula on any operator.
    const lastNumber = input.split(/[+\-x÷]/).pop();
    if (lastNumber.includes(".")) return; // prevent multiple decimals

    if (input === "" || /[+\-x÷]$/.test(input)) {
      setResult("0.");
      setInput(input + "0.");
    } else {
      setResult(result + ".");
      setInput(result + ".");
    }
  };

  // Evaluate the expression.
  const handleEquals = () => {
    let expression = input.replace(/x/g, "*").replace(/÷/g, "/");
    while (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    try {
      let evaluatedResult = eval(expression);
      evaluatedResult = Math.round(evaluatedResult * 1e10) / 1e10;
      setResult(String(evaluatedResult));
      setEvaluated(true);
    } catch (err) {
      setResult("Error");
      setEvaluated(true);
    }
  };


  // Keyboard support for numbers, operators, Enter, Backspace, and Escape.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      // If key is a digit (0-9)
      if (/^[0-9]$/.test(key)) { 
        handleNumber(key);
      } else if (key === ".") {
        handleDecimal();
      } else if (key === "+" || key === "-") {
        handleOperator(key);
      } else if (key === "*" || key === "x" || key === "X") {
        handleOperator("x");
      } else if (key === "/" || key === "÷") {
        handleOperator("÷");
      } else if (key === "Enter" || key === "=") {
        handleEquals();
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Escape") {
        handleClear();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input, result, evaluated]);

  return (
    <div className="calculator">
      <div id="display" className="display">
        <div className="expression-display">{input}</div>
        <div className="main-result">{result}</div>
      </div>

      <div className="buttons">
        {/*First Row*/}
        <button id="clear" onClick={handleClear}>AC</button>
        <button id="delete" onClick={handleBackspace}>DEL</button>
        <button id="plusminus" onClick={handlePlusMinus}>±</button>
        <button id="divide" onClick={() => handleOperator("÷")}>÷</button>
        {/*Second Row*/}
        <button id="multiply" onClick={() => handleOperator("x")}>x</button>
        <button id="seven" onClick={() => handleNumber("7")}>7</button>
        <button id="eight" onClick={() => handleNumber("8")}>8</button>
        <button id="nine" onClick={() => handleNumber("9")}>9</button>
        <button id="subtract" onClick={() => handleOperator("-")}>-</button>
        {/* Third Row */}
        <button id="four" onClick={() => handleNumber("4")}>4</button>
        <button id="five" onClick={() => handleNumber("5")}>5</button>
        <button id="six" onClick={() => handleNumber("6")}>6</button>
        <button id="add" onClick={() => handleOperator("+")}>+</button>
        {/* Fourth Row */}
        <button id="one" onClick={() => handleNumber("1")}>1</button>
        <button id="two" onClick={() => handleNumber("2")}>2</button>
        <button id="three" onClick={() => handleNumber("3")}>3</button>
        <button id="percent" onClick={handlePercent}>%</button>
        {/* Fifth Row */}
        <button id="zero" onClick={() => handleNumber("0")}>0</button>
        <button id="decimal" onClick={handleDecimal}>.</button>
        <button id="equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

export default Calculator;
