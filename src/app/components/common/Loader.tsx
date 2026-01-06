import React from "react";
import "./loader.css";

const SpinnerLoader: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default SpinnerLoader;
