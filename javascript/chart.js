// javascript/chart.js
// Ensure this code runs after the DOM is loaded or the script is defer/at end of body
document.addEventListener("DOMContentLoaded", function() {
  const ctx = document.getElementById('skillsChart');
  if (ctx) {
      new Chart(ctx.getContext('2d'), {
          type: 'radar',
          data: {
              labels: ['OS', 'C++', 'TinyML', 'Low-Latency Execution', 'Deep Learning', 'Reinforcement Learning', 'Signal Processing', 'Statistical Modeling', 'Numerical Optimization'],
              datasets: [{
                  label: 'Proficiency',
                  data: [9, 6, 6, 5, 6, 5, 7, 6, 6],
                  backgroundColor: 'rgba(232, 163, 61, 0.2)', // amber theme
                  borderColor: 'rgba(232, 163, 61, 1)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgba(232, 163, 61, 1)',
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  r: {
                      beginAtZero: true,
                      max: 10,
                      ticks: { display: false }, // Hide numbers for cleaner look
                      grid: { color: 'rgba(234, 231, 221, 0.12)' },
                      angleLines: { color: 'rgba(234, 231, 221, 0.12)' },
                      pointLabels: { color: '#eae7dd', font: { family: 'IBM Plex Mono', size: 11 } }
                  }
              },
              plugins: {
                  legend: { display: false } // Hide legend for cleaner look
              }
          }
      });
  }
});