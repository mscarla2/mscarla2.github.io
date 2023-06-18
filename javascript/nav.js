const sidebar = document.getElementById('sidebar');
const rest = document.getElementById('restofpage');

sidebar.addEventListener('mouseenter', function() {
  this.classList.add('expand');
  rest.classList.add('retract');
});

sidebar.addEventListener('mouseleave', function() {
  this.classList.remove('expand');
  rest.classList.remove('retract');
});

