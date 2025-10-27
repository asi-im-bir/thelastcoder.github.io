const username = "asi-im-bir";

const customSummaries = {
  "portfolio-site": "A fully responsive portfolio showcasing my development projects, built with pure HTML, CSS, and JS.",
  "weather-app": "A modern weather dashboard using the OpenWeather API, displaying real-time forecasts with clean visuals.",
  "todo-api": "A Node.js API that manages daily tasks with JWT authentication, built with Express and MongoDB.",
  "chat-app": "A real-time chat platform using Socket.io, Node.js, and WebSocket events.",
  "machine-learning-demo": "A Python-based machine learning demo featuring predictive modeling and data visualization.",
};

let allRepos = [];

async function loadProjects() {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  allRepos = await response.json();
  renderProjects("All");
}

function renderProjects(language) {
  const container = document.getElementById("projects");
  container.innerHTML = "";

  const filtered = allRepos.filter(repo => {
    if (repo.fork || repo.private) return false;
    if (language === "All") return true;
    return repo.language && repo.language.toLowerCase() === language.toLowerCase();
  });

  filtered.slice(0, 12).forEach((repo, index) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("data-aos", index % 2 === 0 ? "fade-up" : "zoom-in");

    const imagePath = `images/${repo.name}.png`;
    const homepage = repo.homepage ? `<a href="${repo.homepage}" target="_blank">🌐 Live Demo</a>` : "";
    const summary = customSummaries[repo.name] || repo.description || "An open-source project exploring new ideas.";

    card.innerHTML = `
      <img src="${imagePath}" alt="${repo.name}" class="project-img" onerror="this.style.display='none'">
      <div class="project-content">
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p class="project-summary">${summary}</p>
        <div class="links">
          <a href="${repo.html_url}" target="_blank">🔗 GitHub</a>
          ${homepage}
        </div>
        <div class="badge">${repo.language || "N/A"}</div>
      </div>
    `;
    container.appendChild(card);
  });

  // Refresh AOS when content updates
  if (window.AOS) AOS.refresh();
}

// 🔄 Language Filter
document.addEventListener("click", e => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    renderProjects(e.target.dataset.language);
  }
});

// 🌙 Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") document.body.classList.add("dark");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

loadProjects();
