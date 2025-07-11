document.getElementById("question-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const role = document.getElementById("role").value;
  const experience = document.getElementById("experience").value;
  const skills = document.getElementById("skills").value;
  const difficulty = document.getElementById("difficulty").value;
  const roundType = document.getElementById("roundType").value;

  const response = await fetch("http://127.0.0.1:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, experience, skills, difficulty, roundType }),
  });

  const data = await response.json();
  document.getElementById("output").innerText = data.questions || data.error;
});

const checkbox = document.getElementById("theme-checkbox");
const body = document.body;

// Initial load theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light");
  checkbox.checked = true;
  loadParticles("light");
} else {
  loadParticles("dark");
}

// Theme change event
checkbox.addEventListener("change", () => {
  const isLight = checkbox.checked;
  body.classList.toggle("light", isLight);
  const newTheme = isLight ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  loadParticles(newTheme);
});

// Function to destroy and reload particles with new color
function loadParticles(theme) {
  // Clear previous particles
  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }

  // Set color based on theme
  const color = theme === "light" ? "#64748b" : "#00ffff"; // grayish or cyan

  particlesJS("particles-js", {
    particles: {
      number: { value: 60 },
      color: { value: color },
      shape: { type: "circle" },
      opacity: { value: 0.4 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        distance: 150,
        color: color,
        opacity: 0.3,
        width: 1
      },
      move: { enable: true, speed: 2 }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}
