import React, { useState, useEffect } from "react";

const CustomCaptcha = ({ onVerify }) => {
  const [captchaCode, setCaptchaCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (userInput.toUpperCase() === captchaCode) {
      setError("");
      onVerify(true);
    } else {
      setError("Invalid code");
      onVerify(false);
      generateCaptcha();
      setUserInput("");
    }
  };

  const handleRefresh = () => {
    generateCaptcha();
    setUserInput("");
    setError("");
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter the code"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-btn-800"
        />
        <div
          className="bg-gray-200 px-4 text-xl py-2 w-full rounded-lg font-bold tracking-widest select-none"
          style={{
            letterSpacing: "0.2em",
            fontFamily: "monospace",
            background:
              "repeating-linear-gradient(45deg, #f0f0f0, #e0e0e0 10px, #d0d0d0 10px, #c0c0c0 20px)",
          }}
        >
          {captchaCode.split("").map((char, index) => (
            <span
              key={index}
              style={{
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                display: "inline-block",
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="bg-gray-200 p-2 px-5 text-xl rounded-lg hover:bg-gray-300"
        >
          ↻
        </button>
        <button
          type="button"
          onClick={handleVerify}
          className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Verify
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CustomCaptcha;
