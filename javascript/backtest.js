// Sample CSV data (date, close)
const sampleCSV = `date,close
2022-01-01,100
2022-01-02,102
2022-01-03,101
2022-01-04,105
2022-01-05,103
2022-01-06,108
2022-01-07,107
2022-01-08,110
2022-01-09,109
2022-01-10,115
`;

document.getElementById('downloadSample').onclick = function() {
  const blob = new Blob([sampleCSV], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample.csv';
  a.click();
  URL.revokeObjectURL(url);
};

function runBacktest() {
  const fileInput = document.getElementById('csvFile');
  if (!fileInput.files.length) {
    processData(sampleCSV);
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    processData(e.target.result);
  };
  reader.readAsText(file);
}

function processData(data) {
  const priceData = parseCSV(data);
  if (priceData.length === 0) {
    alert('No valid data found!');
    return;
  }
  const results = movingAverageStrategy(priceData, 3, 5); // Fast=3, Slow=5
  plotResults(results, priceData);
  showMetrics(results);
}

function parseCSV(data) {
  const lines = data.trim().split('\n');
  if (lines.length < 2) return [];
  return lines.slice(1).map(line => {
    const [date, close] = line.split(',');
    return { date: date.trim(), close: parseFloat(close) };
  }).filter(x => !isNaN(x.close));
}

// Simple Moving Average Crossover Strategy
function movingAverageStrategy(data, fastPeriod = 3, slowPeriod = 5) {
  const equityCurve = [];
  const trades = [];
  let position = 0;
  let entryPrice = 0;
  let cash = 1000;
  let shares = 0;
  const fastMA = movingAverage(data.map(x => x.close), fastPeriod);
  const slowMA = movingAverage(data.map(x => x.close), slowPeriod);
  for (let i = 0; i < data.length; i++) {
    if (i > 0 && fastMA[i-1] <= slowMA[i-1] && fastMA[i] > slowMA[i] && position === 0) {
      position = 1;
      entryPrice = data[i].close;
      shares = cash / entryPrice;
      cash = 0;
      trades.push({ type: 'Buy', date: data[i].date, price: entryPrice });
    } else if (i > 0 && fastMA[i-1] >= slowMA[i-1] && fastMA[i] < slowMA[i] && position === 1) {
      position = 0;
      cash = shares * data[i].close;
      trades.push({ type: 'Sell', date: data[i].date, price: data[i].close });
      shares = 0;
    }
    equityCurve.push(position === 1 ? shares * data[i].close : cash);
  }
  if (position === 1) {
    cash = shares * data[data.length - 1].close;
    trades.push({ type: 'Sell', date: data[data.length - 1].date, price: data[data.length - 1].close });
    position = 0;
    shares = 0;
  }
  const profit = cash - 1000;
  const totalTrades = trades.length / 2;
  const winTrades = trades.filter((t, idx) => t.type === 'Sell' && trades[idx-1]?.type === 'Buy' && t.price > trades[idx-1].price).length;
  return {
    equityCurve,
    trades,
    metrics: {
      profit: profit.toFixed(2),
      totalTrades,
      winRate: totalTrades ? ((winTrades / totalTrades) * 100).toFixed(1) + '%' : 'N/A'
    }
  };
}

function movingAverage(arr, period) {
  return arr.map((v, i) => {
    if (i < period - 1) return null;
    const slice = arr.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

function plotResults(results, priceData) {
  const ctx = document.getElementById('resultsChart').getContext('2d');
  if (window.equityChart) window.equityChart.destroy();
  window.equityChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: priceData.map(x => x.date),
      datasets: [
        {
          label: 'Equity Curve',
          data: results.equityCurve,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Price',
          data: priceData.map(x => x.close),
          borderColor: 'gray',
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: 'Date' } },
        y: { display: true, title: { display: true, text: 'Value' } }
      }
    }
  });
}

function showMetrics(results) {
  const { profit, totalTrades, winRate } = results.metrics;
  const metricsDiv = document.getElementById('metrics');
  metricsDiv.innerHTML = `
    <h2>Results</h2>
    <p><strong>Profit:</strong> $${profit}</p>
    <p><strong>Total Trades:</strong> ${totalTrades}</p>
    <p><strong>Win Rate:</strong> ${winRate}</p>
    <h3>Trades Log</h3>
    <ul>
      ${results.trades.map(trade =>
        `<li>${trade.date}: ${trade.type} @ $${trade.price}</li>`
      ).join('')}
    </ul>
  `;
}