const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let index = 0;
let autoTimer;

function showSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
}

function goToSlide(i) {
  index = i;
  showSlide(index);
  resetTimer();
}

function changeSlide(dir) {
  index = (index + dir + slides.length) % slides.length;
  showSlide(index);
  resetTimer();
}

function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

function resetTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 5000);
}

// Auto play cada 5s
autoTimer = setInterval(nextSlide, 5000);
