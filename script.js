const username = "asi-im-bir";

// Local data fallback
const projectData = {
  "portfolio-site": {
    summary: "Personal portfolio that fetches projects dynamically from GitHub.",
    category: "Frontend",
    live: "https://thelastcoder.github.io",
    tech: ["HTML", "CSS", "JavaScript"],
    images: ["images/portfolio-site-1.png"]
  }
};

// Configure Markdown + syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language: validLang }).value;
  },
  langPrefix: 'hljs language-',
});

let allRepos = [];
async function loadProjects() {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  allRepos = await res.json();
  renderProjects("All");
}

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
    const img = (data.images && data.images[0]) || `images/${repo.name}.png`;
    const summary = data.summary || repo.description || "Open-source project";
    const category = data.category || repo.language || "General";

    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <img src="${img}" alt="${repo.name}" class="project-img" onerror="this.style.display='none'">
      <div class="project-content">
        <h3>${repo.name}</h3>
        <p class="project-summary">${summary}</p>
        <div class="buttons">
          <button class="btn view-btn"
            data-name="${repo.name}"
            data-image="${img}"
            data-live="${data.live || ''}"
            data-github="${repo.html_url}">
            👁 View Project
          </button>
        </div>
        <div class="badge">${category}</div>
      </div>`;
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
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Fetch README
async function fetchReadme(repoName) {
  const urls = [
    `https://raw.githubusercontent.com/${username}/${repoName}/main/README.md`,
    `https://raw.githubusercontent.com/${username}/${repoName}/master/README.md`
  ];
  for (const url of urls) {
    const res = await fetch(url);
    if (res.ok) return await res.text();
  }
  return "No README found.";
}

// Modal logic
const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalTech = document.getElementById("modalTech");
const modalLinks = document.getElementById("modalLinks");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.getElementById("prevImg");
const nextBtn = document.getElementById("nextImg");
const readmeContent = document.getElementById("readmeContent");
let currentImages = [], currentIndex = 0;

document.addEventListener("click", e => {
  if (e.target.classList.contains("view-btn")) {
    const { name, image, live, github } = e.target.dataset;
    const project = projectData[name] || {};

    modal.style.display = "flex";
    modalTitle.textContent = name;
    modalTech.innerHTML = project.tech ? project.tech.map(t => `<li>${t}</li>`).join("") : "";
    readmeContent.textContent = "Loading README...";

    currentImages = project.images || [image];
    currentIndex = 0;
    modalImg.src = currentImages[currentIndex];

    modalLinks.innerHTML = `
      ${project.live ? `<a href="${project.live}" target="_blank" class="btn">🌐 Live Demo</a>` : ""}
      <a href="${github}" target="_blank" class="btn-outline">💻 GitHub</a>
      <a href="project.html?repo=${name}" class="btn" target="_blank">📖 Full Case Study</a>
    `;

    fetchReadme(name).then(md => {
      readmeContent.innerHTML = marked.parse(md);
    });
  }
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.style.display = "none"; });

loadProjects();
