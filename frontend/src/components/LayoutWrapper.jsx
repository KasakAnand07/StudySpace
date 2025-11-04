import React from "react";
import "../styles/layoutWrapper.css";

export default function LayoutWrapper({ title, subtitle, children }) {
  return (
    <div className="layout-wrapper">
      <div className="layout-header">
        {title && <h2 className="layout-title">{title}</h2>}
        {subtitle && <p className="layout-subtitle">{subtitle}</p>}
      </div>

      <div className="layout-content custom-scroll">
        {children}
      </div>
    </div>
  );
}
