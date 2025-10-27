const username = "asi-im-bir";

const projectData = {
  "portfolio-site": {
    summary: "Personal portfolio dynamically showcasing GitHub projects with animations, filters, and dark mode.",
    category: "Frontend",
    live: "https://thelastcoder.github.io",
    tech: ["HTML", "CSS", "JavaScript", "AOS.js"],
    images: ["images/portfolio-site-1.png"]
  },
  "weather-app": {
    summary: "A weather app using OpenWeather API and geolocation.",
    category: "Frontend",
    live: "https://asi-im-bir.github.io/weather-app",
    tech: ["JavaScript", "HTML", "CSS", "OpenWeather API"],
    images: ["images/weather-app-1.png"]
  }
};

// Fetch repos
let allRepos = [];
async function loadProjects() {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  allRepos = await res.json();
  renderProjects("All");
}

// Fetch README text
async function fetchReadme(username, repoName) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${username}/${repoName}/main/README.md`);
    if (!res.ok) {
      const alt = await fetch(`https://raw.githubusercontent.com/${username}/${repoName}/master/README.md`);
      if (!alt.ok) return "No README found.";
      return await alt.text();
    }
    return await res.text();
  } catch {
    return "No README available.";
  }
}

// Render projects
function renderProjects(filter) {
  const container = document.getElementById("projects");
  container.innerHTML = "";

  const filtered = allRepos.filter(r => {
    if (r.fork || r.private) return false;
    const data = projectData[r.name];
    if (filter === "All") return true;
    return (
      (r.language && r.language.toLowerCase() === filter.toLowerCase()) ||
      (data && data.category && data.category.toLowerCase() === filter.toLowerCase())
    );
  });

  filtered.forEach(repo => {
    const data = projectData[repo.name] || {};
    const image = (data.images && data.images[0]) || `images/${repo.name}.png`;
    const summary = data.summary || repo.description || "Open-source project";
    const category = data.category || repo.language || "General";

    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("data-aos", "fade-up");

    card.innerHTML = `
      <img src="${image}" alt="${repo.name}" class="project-img" onerror="this.style.display='none'">
      <div class="project-content">
        <h3>${repo.name}</h3>
        <p class="project-summary">${summary}</p>
        <div class="buttons">
          <button class="btn view-btn" 
            data-name="${repo.name}" 
            data-summary="${summary}" 
            data-image="${image}" 
            data-live="${data.live || ''}" 
            data-github="${repo.html_url}">
            👁 View Project
          </button>
        </div>
        <div class="badge">${category}</div>
      </div>
    `;
    container.appendChild(card);
  });

  if (window.AOS) AOS.refresh();
}

// Filter buttons
document.addEventListener("click", e => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderProjects(e.target.dataset.language);
  }
});

// Dark mode toggle
const toggle = document.getElementById("darkModeToggle");
const theme = localStorage.getItem("theme");
if (theme === "dark") document.body.classList.add("dark");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// === Modal Logic ===
const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalSummary = document.getElementById("modalSummary");
const modalTech = document.getElementById("modalTech");
const modalLinks = document.getElementById("modalLinks");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.getElementById("prevImg");
const nextBtn = document.getElementById("nextImg");

let currentImages = [], currentIndex = 0;

// Open modal
document.addEventListener("click", e => {
  if (e.target.classList.contains("view-btn")) {
    const { name, summary, image, live, github } = e.target.dataset;
    const project = projectData[name] || {};

    modalTitle.textContent = name;
    modalSummary.textContent = "Loading project summary...";
    modalTech.innerHTML = project.tech ? project.tech.map(t => `<li>${t}</li>`).join("") : "";

    currentImages = project.images || [image];
    currentIndex = 0;
    modalImg.src = currentImages[currentIndex];

    modalLinks.innerHTML = `
      ${project.live ? `<a href="${project.live}" target="_blank" class="btn">🌐 Live Demo</a>` : ""}
      <a href="${github}" target="_blank" class="btn-outline">💻 GitHub</a>
    `;
    modal.style.display = "flex";

    fetchReadme(username, name).then(readme => {
      const clean = readme.split("\n").filter(l => l.trim()).slice(0, 3).join(" ").replace(/[#>*`]/g, "");
      modalSummary.textContent = clean || summary;

      const techMatch = readme.match(/(Tech\s*Stack|Built\s*With)[\s\S]*?(?=\n#+|\n\n|$)/i);
      if (techMatch) {
        const lines = techMatch[0].split("\n")
          .filter(l => l && !/tech|built/i.test(l))
          .map(l => l.replace(/[-*•]/g, "").trim())
          .filter(Boolean);
        if (lines.length) modalTech.innerHTML = lines.map(t => `<li>${t}</li>`).join("");
      }
    });
  }
});

// Carousel navigation
nextBtn.addEventListener("click", () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});
prevBtn.addEventListener("click", () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.style.display = "none"; });

loadProjects();

