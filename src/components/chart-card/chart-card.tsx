import React from "react";
import "./chart-card.scss";

const ChartCard: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => (
  <div className="chart-card">
    {title && <h3>{title}</h3>}
    {children}
  </div>
);

export default ChartCard;
