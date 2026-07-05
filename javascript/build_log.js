const PNL_SOURCE = "../data/pnl_demo.json"; // swap to ../data/pnl.json once real history has enough days

async function loadTerminal() {
  const statLine = document.getElementById("terminal-stats");
  const canvas = document.getElementById("pnl-chart");
  const disclaimer = document.getElementById("terminal-disclaimer");
  if (!statLine || !canvas) return;

  try {
    const res = await fetch(PNL_SOURCE);
    if (!res.ok) throw new Error("no data yet");
    const data = await res.json();

    const pct = data.total_return_pct;
    const pctClass = pct > 0 ? "gain" : pct < 0 ? "loss" : "neutral";
    const sign = pct > 0 ? "+" : "";

    statLine.innerHTML = `
      <div class="terminal-stat">
        <span class="stat-label">Combined return</span>
        <span class="stat-value ${pctClass}">${sign}${pct}%</span>
      </div>
      <div class="terminal-stat">
        <span class="stat-label">Active strategies</span>
        <span class="stat-value neutral">${data.n_strategies_live}</span>
      </div>
      <div class="terminal-stat">
        <span class="stat-label">Days live</span>
        <span class="stat-value neutral">${data.days_live}</span>
      </div>
      <div class="terminal-stat">
        <span class="stat-label">Since</span>
        <span class="stat-value neutral">${data.start_date}</span>
      </div>
    `;

    if (disclaimer) {
      disclaimer.textContent = data.demo
        ? "// placeholder numbers for layout — real paper-trading history is still short"
        : `// live paper-trading result, updated ${data.as_of}`;
    }

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: data.equity_curve.map((p) => p.date),
        datasets: [{
          data: data.equity_curve.map((p) => p.value),
          borderColor: "#e8a33d",
          backgroundColor: "rgba(232, 163, 61, 0.12)",
          fill: true,
          tension: 0.25,
          pointRadius: 0,
          borderWidth: 2,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            ticks: { color: "#8b93a1", font: { family: "IBM Plex Mono", size: 10 } },
            grid: { color: "rgba(234, 231, 221, 0.06)" },
          },
        },
      },
    });
  } catch (err) {
    statLine.innerHTML = `<span class="log-empty">// no paper-trading data yet</span>`;
    canvas.style.display = "none";
  }
}

async function loadEntries() {
  const container = document.getElementById("log-entries");
  if (!container) return;

  try {
    const res = await fetch("../build-log/entries.md");
    if (!res.ok) throw new Error("no entries yet");
    const text = await res.text();

    const blocks = text.split(/\n(?=## )/).map((b) => b.trim()).filter(Boolean);
    const entries = blocks.map((block) => {
      const headerMatch = block.match(/^## (\d{4}-\d{2}-\d{2}) — (.+)$/m);
      const date = headerMatch ? headerMatch[1] : "";
      const title = headerMatch ? headerMatch[2] : "Untitled";
      const body = block.replace(/^## .+$/m, "").trim();
      return { date, title, body };
    }).reverse(); // newest first

    if (entries.length === 0) {
      container.innerHTML = '<p class="log-empty">Nothing logged yet.</p>';
      return;
    }

    container.innerHTML = entries.map((e) => `
      <div class="log-entry">
        <div class="log-entry-date">${e.date}</div>
        <h3 class="log-entry-title">${e.title}</h3>
        <div class="log-entry-body">${marked.parse(e.body)}</div>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = '<p class="log-empty">Nothing logged yet.</p>';
  }
}

loadTerminal();
loadEntries();
