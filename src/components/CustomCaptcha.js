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
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
        {/* Captcha Box */}
        <div
          className="flex justify-center items-center bg-gray-200 text-2xl py-3 px-6 rounded-lg font-bold tracking-widest select-none w-full md:w-auto"
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

        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="bg-gray-200 p-3 px-4 rounded-lg hover:bg-gray-300 transition-all text-xl"
        >
          ↻
        </button>
      </div>

      {/* Input & Verify */}
      <div className="mt-4 flex flex-col space-y-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter the code"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-btn-800 text-center"
        />

        <button
          type="button"
          onClick={handleVerify}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          Verify
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default CustomCaptcha;
