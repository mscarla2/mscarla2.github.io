const ctx = document.getElementById('skillsChart').getContext('2d');
const skillsChart = new Chart(ctx, {
  type: 'radar',
  data: {
    labels: ['Python', 'C++', 'Java', 'JavaScript', 'Physique'],
    datasets: [{
      label: 'Skill Proficiency',
      data: [10, 10, 5, 4, 9],
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