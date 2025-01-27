const ctx = document.getElementById('skillsChart').getContext('2d');
const skillsChart = new Chart(ctx, {
  type: 'radar',
  data: {
    labels: ['Distributed Systems', 'TensorflowLite', 'TinyML', 'Algo Trading', 'Embedded Dev C++', 'System Design', 'Korean'],
    datasets: [{
      label: 'Learning Focus',
      data: [7, 9,10,6,8,7,3],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true
      }
    }
  }
});