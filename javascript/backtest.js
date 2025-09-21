const chartInstances = {};

// Helper function to get the computed value of a CSS variable
function getCssVar(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function renderStrategyOptions() {
  const select = document.getElementById("strategy-select");
  if (!select) return;
  select.innerHTML = Strategies.map(s =>
    `<option value="${s.id}">${s.name}</option>`
  ).join("");
  renderStrategyParams();
}

function renderStrategyParams() {
  const select = document.getElementById("strategy-select");
  const paramsDiv = document.getElementById("strategy-params");
  if (!select || !paramsDiv) return;
  
  const strategy = Strategies.find(s => s.id === select.value);
  if (!strategy || !strategy.params) { 
    paramsDiv.innerHTML = ""; 
    return; 
  }
  
  paramsDiv.innerHTML = strategy.params.map(p => `
    <div class="form-group">
      <label for="${p.id}">${p.label}</label>
      <input type="${p.type}" id="${p.id}" value="${p.default}">
    </div>
  `).join("");
}

function getDashboardConfig() {
  const select = document.getElementById("strategy-select");
  const strategy = Strategies.find(s => s.id === select.value);
  let paramValues = {};

  if (strategy && strategy.params) {
    strategy.params.forEach(p => {
      let val = document.getElementById(p.id)?.value;
      paramValues[p.id] = p.type === "number" ? Number(val) : val;
    });
  }
  
  return {
    strategyObj: { ...strategy, params: paramValues },
    asset: document.getElementById('asset')?.value,
    startDate: document.getElementById('start-date')?.value,
    endDate: document.getElementById('end-date')?.value,
    apiKey: document.getElementById('api-key')?.value,
    initialCapital: Number(document.getElementById('initial-capital')?.value) || 100000,
    commission: Number(document.getElementById('commission')?.value) || 1,
  };
}

async function runBacktest() {
  const config = getDashboardConfig();
  if (!config.strategyObj.id) {
    alert("Please select a strategy.");
    return;
  }
  console.log("Running backtest with config:", config);
  const results = await window.BacktestEngine.run(config);
  console.log("Backtest results:", results);

  document.getElementById("results-title").textContent =
    `Backtest Results: ${config.strategyObj.name} on ${config.asset}`;

  renderKPI(results);
  renderCharts(results);
  renderTradeLog(results.trades);
}

// UPDATED: Now includes Net Profit calculation and display
function renderKPI(results) {
  const area = document.getElementById("kpi-scorecard");

  if (!results || !results.equityCurve || results.equityCurve.length === 0) {
      area.innerHTML = `
        <div class="kpi-card"><div class="label">Total Return</div><div class="value">N/A</div></div>
        <div class="kpi-card"><div class="label">Net Profit</div><div class="value">N/A</div></div>
        <div class="kpi-card"><div class="label">Max Drawdown</div><div class="value">N/A</div></div>
        <div class="kpi-card"><div class="label">Sharpe Ratio</div><div class="value">N/A</div></div>
        <div class="kpi-card"><div class="label">Profit Factor</div><div class="value">N/A</div></div>
        <div class="kpi-card"><div class="label">Win Rate</div><div class="value">N/A</div></div>
        <div class="kpi-card"><div class="label">Total Trades</div><div class="value">0</div></div>
      `;
      return;
  }

  const initialCapital = results.equityCurve[0].totalEquity;
  const finalEquity = results.equityCurve[results.equityCurve.length - 1].totalEquity;
  
  // --- METRIC CALCULATIONS ---
  const totalReturn = ((finalEquity - initialCapital) / initialCapital) * 100;
  const netProfit = finalEquity - initialCapital; // NEW METRIC
  const profitFactor = results.metrics.profitFactor;

  // --- FORMATTING FOR DISPLAY ---
  const profitFactorDisplay = profitFactor === Infinity ? 'Perfect' : profitFactor.toFixed(2);
  const formattedNetProfit = netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Format as currency
  const profitClass = netProfit >= 0 ? "positive" : "negative";

  area.innerHTML = `
    <div class="kpi-card">
        <div class="label">Total Return</div>
        <div class="value ${totalReturn >= 0 ? "positive" : "negative"}">${totalReturn.toFixed(2)}%</div>
    </div>
    
    <!-- NEW KPI CARD FOR NET PROFIT -->
    <div class="kpi-card">
        <div class="label">Net Profit</div>
        <div class="value ${profitClass}">${formattedNetProfit}</div>
    </div>

    <div class="kpi-card">
        <div class="label">Max Drawdown</div>
        <div class="value negative">${results.metrics.maxDrawdown.toFixed(2)}%</div>
    </div>
    <div class="kpi-card">
        <div class="label">Sharpe Ratio</div>
        <div class="value">${results.metrics.sharpeRatio.toFixed(2)}</div>
    </div>
    <div class="kpi-card">
        <div class="label">Profit Factor</div>
        <div class="value">${profitFactorDisplay}</div>
    </div>
    <div class="kpi-card">
        <div class="label">Win Rate</div>
        <div class="value">${results.metrics.winRate.toFixed(0)}%</div>
    </div>
    <div class="kpi-card">
        <div class="label">Total Trades</div>
        <div class="value">${results.trades?.length || 0}</div>
    </div>
  `;
}

function renderCharts(results) {
    if (!results || !results.equityCurve || results.equityCurve.length === 0) {
        ['equityCurveChart', 'priceChart', 'drawdownChart'].forEach(id => {
            if (chartInstances[id]) chartInstances[id].destroy();
        });
        return;
    }

    const equityCurve = results.equityCurve;
    const trades = results.trades;
    const equityLabels = equityCurve.map(row => row.date);

    renderChart('equityCurveChart', 'line', {
        labels: equityLabels,
        datasets: [{
            label: 'Strategy Equity',
            data: equityCurve.map(row => row.totalEquity),
            borderColor: getCssVar('--primary-color'),
            tension: 0.1, pointRadius: 0
        }, {
            label: 'Benchmark (Buy & Hold)',
            data: results.benchmarkCurve,
            borderColor: getCssVar('--text-muted-color'),
            borderDash: [5, 5], tension: 0.1, pointRadius: 0
        }]
    });

    renderChart('priceChart', 'line', {
        labels: equityLabels,
        datasets: [{
            label: 'Price',
            data: equityCurve.map(row => row.price),
            borderColor: getCssVar('--text-color'),
            tension: 0.1, pointRadius: 0
        }, {
            label: 'Buy',
            data: trades.filter(t => t.type === "Long").map(trade => ({ x: trade.entryDate, y: trade.entryPrice })),
            pointStyle: 'triangle', radius: 8, rotation: 0, showLine: false,
            backgroundColor: getCssVar('--green'),
            borderColor: getCssVar('--green')
        }, {
            label: 'Sell',
            data: trades.filter(t => t.type === "Long").map(trade => ({ x: trade.exitDate, y: trade.exitPrice })),
            pointStyle: 'triangle', radius: 8, rotation: 180, showLine: false,
            backgroundColor: getCssVar('--red'),
            borderColor: getCssVar('--red')
        }]
    });

    renderChart('drawdownChart', 'bar', {
        labels: equityLabels,
        datasets: [{
            label: 'Drawdown (%)',
            data: results.metrics.drawdownSeries,
            backgroundColor: getCssVar('--red')
        }]
    }, { legend: { display: false }, y: { ticks: { callback: v => v.toFixed(1) + '%' } } });
}

function renderChart(canvasId, type, data, additionalOptions = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const container = canvas.parentElement;
  if (container) {
    container.style.position = 'relative';
    container.style.height = '40vh';
    container.style.width = '100%';
  }

  const ctx = canvas.getContext('2d');
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }
  
  chartInstances[canvasId] = new Chart(ctx, {
    type: type,
    data: data,
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: { 
          type: 'time', 
          time: { unit: 'month' }, 
          grid: { color: getCssVar('--border-color') },
          ticks: { 
            color: getCssVar('--text-muted-color'),
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12 
          } 
        },
        y: { 
          grid: { color: getCssVar('--border-color') },
          ticks: { color: getCssVar('--text-muted-color') },
          ...additionalOptions.y 
        }
      },
      plugins: { 
        legend: { 
          labels: { color: getCssVar('--text-color') },
          ...additionalOptions.legend 
        } 
      }
    }
  });
}

function renderTradeLog(trades) {
  const body = document.getElementById("trade-log-body");
  if (!body || !trades) return;
  body.innerHTML = trades.map(trade => `
    <tr>
      <td>${trade.entryDate}</td>
      <td>${trade.exitDate}</td>
      <td>${trade.type}</td>
      <td>${trade.entryPrice.toFixed(2)}</td>
      <td>${trade.exitPrice.toFixed(2)}</td>
      <td class="${trade.pnlPct >= 0 ? 'pnl-positive' : 'pnl-negative'}">${trade.pnlPct.toFixed(2)}%</td>
    </tr>
  `).join("");
}

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("strategy-select")) {
    renderStrategyOptions();
    document.getElementById("strategy-select").onchange = renderStrategyParams;
    document.getElementById("runBacktest").onclick = runBacktest;
  }
});