// javascript/chart.js
// Ensure this code runs after the DOM is loaded or the script is defer/at end of body
document.addEventListener("DOMContentLoaded", function() {
  const ctx = document.getElementById('skillsChart');
  if (ctx) {
      new Chart(ctx.getContext('2d'), {
          type: 'radar',
          data: {
              labels: ['OS', 'C++', 'TFLite', 'TinyML', 'Algo Trading', 'Sys Design', 'Korean'],
              datasets: [{
                  label: 'Proficiency',
                  data: [9, 6, 6, 6, 9, 7, 3],
                  backgroundColor: 'rgba(37, 99, 235, 0.2)', // Matches the blue theme
                  borderColor: 'rgba(37, 99, 235, 1)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgba(37, 99, 235, 1)',
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
                      grid: { color: '#e2e8f0' }
                  }
              },
              plugins: {
                  legend: { display: false } // Hide legend for cleaner look
              }
          }
      });
  }
});