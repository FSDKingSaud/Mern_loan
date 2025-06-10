import { useState, useEffect } from "react";
import { Box, Slider } from "@mui/material";
import interestRate from "../../shared/calculatorfunc";
import "./Calculator.css";

const Calculator = () => {
  const [amount, setAmount] = useState(100000);
  const [days, setDays] = useState(120);
  const [result, setResult] = useState(0);

  // calculate interest rate
  useEffect(() => {
    const rate = interestRate(amount, days, 4);
    setResult(rate);
  }, [amount, days]);
  
  return (
    <div className="Calculator">
      <h3>Let&apos;s calculate your needed loan</h3>

      {/* amount slider */}
      <div className="Slider">
        <div className="Label">
          <p>N1000</p>
          <p>N1000000</p>
        </div>
        <Box>
          <Slider
            aria-label="Always visible"
            defaultValue={100000}
            min={1000}
            max={1000000}
            step={1000}
            valueLabelDisplay="on"
            sx={{ color: "#ecaa00", height: 10 }}
            onChange={(e) => setAmount(() => e.target.value)}
          />
        </Box>
      </div>

      {/* days slider */}
      <div className="Slider">
        <div className="Label">
          <p>30days</p>
          <p>365days</p>
        </div>
        <Box>
          <Slider
            aria-label="Always visible"
            defaultValue={120}
            min={30}
            max={365}
            step={30}
            valueLabelDisplay="on"
            sx={{ color: "#ecaa00", height: 10 }}
            onChange={(e) => setDays(() => e.target.value)}
          />
        </Box>
      </div>

      {/* interest rate result */}
      <div className="Result">
        <h4>N{amount + result}</h4>
        <p>Total your will pay</p>
      </div>
      <p>
        Your repayments are N{((result / days) * 30).toFixed()} every 30 days at
        8% Interest to pay:N
        {amount + result} in total.
      </p>
    </div>
  );
};

export default Calculator;
