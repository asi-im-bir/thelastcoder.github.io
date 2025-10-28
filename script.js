const username = "asi-im-bir";

const featuredProjects = [
  {
    name: "Risk Management Dashboard",
    category: "GRC Tool",
    desc: "A dynamic dashboard for enterprise risk visualization, mitigation tracking, and compliance scoring.",
    tech: ["Python", "Plotly", "Flask"],
    img: "assets/images/risk-dashboard.png",
    link: "https://github.com/asi-im-bir/risk-dashboard"
  },
  {
    name: "Compliance Automation Engine",
    category: "Automation Script",
    desc: "Automates ISO 27001 & SOC2 control mapping with AI-based compliance document generation.",
    tech: ["Python", "OpenAI", "Pandas"],
    img: "assets/images/compliance-engine.png",
    link: "https://github.com/asi-im-bir/compliance-engine"
  },
  {
    name: "Security Audit Portal",
    category: "Web App",
    desc: "Manages security audit findings, corrective actions, and team workflows in real time.",
    tech: ["NextJS", "MongoDB", "TailwindCSS"],
    img: "assets/images/audit-portal.png",
    link: "https://github.com/asi-im-bir/audit-portal"
  }
];

// 🧠 Load all projects
async function loadProjects() {
  const container = document.getElementById("project-list");
  container.innerHTML = "";

  // Featured projects first
  featuredProjects.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.dataset.project = JSON.stringify(p);
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="tech-tags">${p.tech.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <p class="category">📂 ${p.category}</p>
    `;
    container.appendChild(card);
  });

  // GitHub repos (non-featured)
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await response.json();

  repos.forEach(repo => {
    const isFeatured = featuredProjects.some(f => f.name.toLowerCase() === repo.name.toLowerCase());
    if (repo.fork || isFeatured) return;

    const card = document.createElement("div");
    card.classList.add("project-card");
    const projectData = {
      name: repo.name,
      desc: repo.description || "No description provided.",
      tech: ["GitHub Repo"],
      img: "assets/images/default.png",
      link: repo.html_url,
      category: "Public Repo"
    };
    card.dataset.project = JSON.stringify(projectData);
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p class="desc">${repo.description || "No description provided."}</p>
      <p class="category">📂 Public Repo</p>
    `;
    container.appendChild(card);
  });

  setupModalEvents();
}

// Modal functionality
function setupModalEvents() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close");

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const project = JSON.parse(card.dataset.project);
      document.getElementById("modal-title").textContent = project.name;
      document.getElementById("modal-desc").textContent = project.desc;
      document.getElementById("modal-img").src = project.img;
      document.getElementById("modal-tech").innerHTML = project.tech
        .map(t => `<span class="tag">${t}</span>`)
        .join("");
      document.getElementById("modal-link").href = project.link;
      modal.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;

    document.querySelectorAll(".project-card").forEach(card => {
      if (category === "all") card.style.display = "block";
      else card.style.display = card.innerHTML.includes(category) ? "block" : "none";
    });
  });
});

loadProjects();
