import React from "react";
import "./loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="skeleton-loader">
        <div className="skeleton skeleton-item"></div>
        <div className="skeleton skeleton-item"></div>
        <div className="skeleton skeleton-item"></div>
        <div className="skeleton skeleton-item"></div>
        <div className="skeleton skeleton-item"></div>
      </div>
    </div>
  );
};

export default Loader;
