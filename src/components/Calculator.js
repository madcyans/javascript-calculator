import { useState } from "react";
import "./Calculator.css";

function Calculator() {
    // State to hold the current input and result
    const [input, setInput] = useState("");
    const [result, setResult] = useState("0");
    const [evaluated, setEvaluated] = useState(false);

// Clear resets state to initial values.
  const handleClear = () => {
    setInput("");
    setResult("0");
    setEvaluated(false);
  };

  // Adds a number to the display and formula.
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
      // Special case: allow a negative sign to indicate a negative number.
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
    if (lastNumber.includes(".")) return; // prevent multiple decimals in one number
    // If the last character was an operator (or if formula is empty) start a new decimal number.
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
    // Prepare the expression by replacing the symbols with JavaScript operators.
    let expression = input.replace(/x/g, "*").replace(/÷/g, "/");
    // If expression ends with an operator, remove it.
    while (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    try {
      // Evaluate the expression.
      let result = eval(expression);
      // Round result to avoid floating point issues (e.g., get 4 or more decimal places of precision).
      result = Math.round(result * 1e10) / 1e10;
      setResult(String(result));
      setInput(String(result));
      setEvaluated(true);
    } catch (err) {
      setResult("Error");
      setInput("");
      setEvaluated(true);
    }
  };

  return (
    <div className="calculator">
      {/* This element’s id is used for displaying current input/output */}
      <div id="display" className="display">
        {result}
      </div>
      <div className="buttons">
        {/* Clear Button */}
        <button id="clear" onClick={handleClear}>
          AC
        </button>
        {/* Division */}
        <button id="divide" onClick={() => handleOperator("÷")}>
          ÷
        </button>
        {/* Multiplication */}
        <button id="multiply" onClick={() => handleOperator("x")}>
          x
        </button>
        {/* Subtraction */}
        <button id="subtract" onClick={() => handleOperator("-")}>
          -
        </button>
        {/* Number Buttons */}
        <button id="seven" onClick={() => handleNumber("7")}>
          7
        </button>
        <button id="eight" onClick={() => handleNumber("8")}>
          8
        </button>
        <button id="nine" onClick={() => handleNumber("9")}>
          9
        </button>
        <button id="add" onClick={() => handleOperator("+")}>
          +
        </button>
        <button id="four" onClick={() => handleNumber("4")}>
          4
        </button>
        <button id="five" onClick={() => handleNumber("5")}>
          5
        </button>
        <button id="six" onClick={() => handleNumber("6")}>
          6
        </button>
        <button id="one" onClick={() => handleNumber("1")}>
          1
        </button>
        <button id="two" onClick={() => handleNumber("2")}>
          2
        </button>
        <button id="three" onClick={() => handleNumber("3")}>
          3
        </button>
        <button id="zero" onClick={() => handleNumber("0")}>
          0
        </button>
        <button id="decimal" onClick={handleDecimal}>
          .
        </button>
        {/* Equals button */}
        <button id="equals" onClick={handleEquals}>
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;
