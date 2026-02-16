import { useState, useEffect, useCallback } from "react";
import "./Calculator.css";
import { evaluate } from "mathjs";

function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [evaluated, setEvaluated] = useState(false);

  const handleClear = useCallback(() => {
    setInput("");
    setResult("0");
    setEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (input.length === 0) return;
    const newInput = input.slice(0, -1);
    setInput(newInput);

    const match = newInput.match(/(-?\d*\.?\d+)$/);
    setResult(match ? match[0] : "0");
  }, [input]);

  const handlePlusMinus = useCallback(() => {
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
  }, [input, result, evaluated]);

  const handlePercent = useCallback(() => {
    const re = /(-?\d*\.?\d+)$/;
    const match = input.match(re);
    if (match) {
      const original = match[0];
      const percentVal = String(Number(original) / 100);
      const newInput = input.slice(0, input.length - original.length) + percentVal;
      setInput(newInput);
      setResult(percentVal);
    }
  }, [input]);

  const handleNumber = useCallback(
    (num) => {
      if (evaluated) {
        setInput(num);
        setResult(num === "0" ? "" : num);
        setEvaluated(false);
        return;
      }

      if (result === "0" && num === "0") return;
      if (result === "0" && num !== "0") {
        setResult(num);
        setInput(input === "" ? num : input + num);
      } else {
        if (/[+\-x÷]$/.test(input)) {
          setResult(num);
        } else {
          setResult(result + num);
        }
        setInput(input + num);
      }
    },
    [input, result, evaluated]
  );

  const handleOperator = useCallback(
    (operator) => {
      if (evaluated) {
        setInput(result + operator);
        setResult(operator);
        setEvaluated(false);
        return;
      }
      if (/[+\-x÷]$/.test(input)) {
        if (operator === "-" && input[input.length - 1] !== "-") {
          setInput(input + operator);
        } else {
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
    },
    [input, result, evaluated]
  );

  const handleDecimal = useCallback(() => {
    if (evaluated) {
      setResult("0.");
      setInput("0.");
      setEvaluated(false);
      return;
    }
    const lastNumber = input.split(/[+\-x÷]/).pop();
    if (lastNumber.includes(".")) return;

    if (input === "" || /[+\-x÷]$/.test(input)) {
      setResult("0.");
      setInput(input + "0.");
    } else {
      setResult(result + ".");
      setInput(result + ".");
    }
  }, [input, result, evaluated]);

  const handleEquals = useCallback(() => {
    let expression = input.replace(/x/g, "*").replace(/÷/g, "/");
    while (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    try {
      let evaluatedResult = evaluate(expression);
      evaluatedResult = Math.round(evaluatedResult * 1e10) / 1e10;
      setResult(String(evaluatedResult));
      setEvaluated(true);
    } catch (err) {
      setResult("Error");
      setEvaluated(true);
    }
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
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
  }, [
    handleNumber,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
  ]);

  return (
    <div className="calculator">
      <div id="display" className="display">
        <div className="expression-display">{input}</div>
        <div className="main-result">{result}</div>
      </div>

      <div className="buttons">
        <button id="clear" onClick={handleClear}>AC</button>
        <button id="delete" onClick={handleBackspace}>DEL</button>
        <button id="plusminus" onClick={handlePlusMinus}>±</button>
        <button id="divide" onClick={() => handleOperator("÷")}>÷</button>
        <button id="multiply" onClick={() => handleOperator("x")}>x</button>
        <button id="seven" onClick={() => handleNumber("7")}>7</button>
        <button id="eight" onClick={() => handleNumber("8")}>8</button>
        <button id="nine" onClick={() => handleNumber("9")}>9</button>
        <button id="subtract" onClick={() => handleOperator("-")}>-</button>
        <button id="four" onClick={() => handleNumber("4")}>4</button>
        <button id="five" onClick={() => handleNumber("5")}>5</button>
        <button id="six" onClick={() => handleNumber("6")}>6</button>
        <button id="add" onClick={() => handleOperator("+")}>+</button>
        <button id="one" onClick={() => handleNumber("1")}>1</button>
        <button id="two" onClick={() => handleNumber("2")}>2</button>
        <button id="three" onClick={() => handleNumber("3")}>3</button>
        <button id="percent" onClick={handlePercent}>%</button>
        <button id="zero" onClick={() => handleNumber("0")}>0</button>
        <button id="decimal" onClick={handleDecimal}>.</button>
        <button id="equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

export default Calculator;
