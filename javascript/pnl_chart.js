async function loadPnlChart() {
  const statusEl = document.getElementById("pnl-status");
  const canvas = document.getElementById("pnl-chart");
  if (!statusEl || !canvas) return;

  try {
    const res = await fetch("data/pnl.json");
    if (!res.ok) throw new Error("no data yet");
    const data = await res.json();

    const pct = data.total_return_pct;
    const sign = pct > 0 ? "+" : "";
    statusEl.textContent =
      `Live paper trading since ${data.start_date}: ${sign}${pct}% across ` +
      `${data.n_strategies_live} active strateg${data.n_strategies_live === 1 ? "y" : "ies"} ` +
      `(${data.days_live} day${data.days_live === 1 ? "" : "s"} of data).`;

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: data.equity_curve.map((p) => p.date),
        datasets: [{
          label: "Combined paper equity (normalized)",
          data: data.equity_curve.map((p) => p.value),
          borderColor: "#3273dc",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
          fill: true,
          tension: 0.2,
          pointRadius: 2,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: (v) => v.toFixed(3) } } },
      },
    });
  } catch (err) {
    statusEl.textContent = "Live paper-trading tracker coming soon.";
    canvas.style.display = "none";
  }
}

loadPnlChart();
