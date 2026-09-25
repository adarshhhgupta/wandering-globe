import React from 'react';
import { DollarSign, PieChart, Tag, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/mockData.js';

export function BudgetSummary({
  trip,
  selectedCurrency,
  onChangeCurrency
}) {
  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency] || '$';

  // Compute live totals from all days & stops
  let liveStopsCost = 0;
  let freeStopsCount = 0;
  let categoryCounts = {};

  trip.days.forEach((day) => {
    day.stops.forEach((stop) => {
      const cost = Number(stop.costEstimate) || 0;
      liveStopsCost += cost;
      if (cost === 0) freeStopsCount++;

      const cat = stop.category || 'Sightseeing';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });

  const baseBreakdown = trip.estimatedTotalBudget?.breakdown || {
    activities: liveStopsCost,
    food: 300,
    stay: 400,
    transport: 100
  };

  const totalCalculated =
    liveStopsCost +
    (baseBreakdown.food || 0) +
    (baseBreakdown.stay || 0) +
    (baseBreakdown.transport || 0);

  const breakdownItems = [
    { label: 'Activities & Attractions', amount: liveStopsCost, color: '#3b82f6' },
    { label: 'Food & Dining (Est.)', amount: baseBreakdown.food || 0, color: '#f97316' },
    { label: 'Lodging & Stay (Est.)', amount: baseBreakdown.stay || 0, color: '#10b981' },
    { label: 'Local Transport (Est.)', amount: baseBreakdown.transport || 0, color: '#a855f7' },
  ];

  return (
    <div className="budget-summary-card">
      <div className="budget-card-header">
        <div className="budget-title-block">
          <PieChart size={18} className="budget-icon" />
          <span className="card-heading">Trip Financials</span>
        </div>

        {/* Currency Switcher */}
        <div className="currency-selector-row">
          <label htmlFor="currency-select-dropdown" className="currency-label">Currency:</label>
          <div className="currency-select-container">
            <select
              id="currency-select-dropdown"
              value={selectedCurrency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="currency-dropdown"
              aria-label="Select Currency"
            >
              {Object.keys(CURRENCY_SYMBOLS).map((c) => (
                <option key={c} value={c} className="currency-dropdown-option">
                  {c} ({CURRENCY_SYMBOLS[c]})
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="currency-select-chevron" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Big Total */}
      <div className="total-budget-box">
        <span className="total-label">Estimated Total Budget</span>
        <div className="total-amount-display">
          <span className="currency-symbol">{currencySymbol}</span>
          <span className="amount-number">{totalCalculated.toLocaleString()}</span>
        </div>
        <span className="budget-pacing-note">
          Based on {trip.durationDays} days in {trip.destination}
        </span>
      </div>

      {/* Visual Breakdown Progress Bars */}
      <div className="breakdown-bars-list">
        {breakdownItems.map((item) => {
          const percentage = totalCalculated > 0
            ? Math.round((item.amount / totalCalculated) * 100)
            : 0;

          return (
            <div key={item.label} className="breakdown-bar-item">
              <div className="bar-labels">
                <span className="bar-category">{item.label}</span>
                <span className="bar-cost">
                  {currencySymbol}{item.amount.toLocaleString()} ({percentage}%)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category distribution pills */}
      <div className="category-distribution">
        <span className="distribution-title">
          <Tag size={13} /> Activity Balance:
        </span>
        <div className="distribution-chips">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <span key={cat} className="dist-chip">
              {cat}: <strong>{count}</strong>
            </span>
          ))}
          {freeStopsCount > 0 && (
            <span className="dist-chip free-chip">
              <CheckCircle2 size={12} /> {freeStopsCount} Free Stops
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
