import React from 'react';

const SummaryCard = ({ title, amount, icon, colorClass, subtitle }) => {
  return (
    <div className={`summary-card ${colorClass}`} id={`card-${colorClass}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <span className="card-title">{title}</span>
        <span className="card-amount">{amount}</span>
        {subtitle && <span className="card-subtitle">{subtitle}</span>}
      </div>
      <div className="card-glow"></div>
    </div>
  );
};

export default SummaryCard;
