const username = "asi-im-bir";

const featuredProjects = [
  {
    name: "Risk Management Dashboard",
    category: "GRC Tool",
    desc: "Dynamic dashboard for enterprise risk visualization, mitigation tracking, and compliance scoring.",
    tech: ["Python", "Plotly", "Flask"],
    img: "assets/images/risk-dashboard.png",
    link: "https://github.com/asi-im-bir/risk-dashboard"
  },
  {
    name: "Compliance Automation Engine",
    category: "Automation Script",
    desc: "Automates ISO 27001 & SOC2 control mapping with AI-driven compliance document generation.",
    tech: ["Python", "OpenAI", "Pandas"],
    img: "assets/images/compliance-engine.png",
    link: "https://github.com/asi-im-bir/compliance-engine"
  },
  {
    name: "Security Audit Portal",
    category: "Web App",
    desc: "Real-time audit management system for tracking findings, corrective actions, and team workflows.",
    tech: ["NextJS", "MongoDB", "TailwindCSS"],
    img: "assets/images/audit-portal.png",
    link: "https://github.com/asi-im-bir/audit-portal"
  }
];

// 🧠 Fetch and render all projects
async function loadProjects() {
  const container = document.getElementById("project-list");
  container.innerHTML = "";

  // Featured first
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

  // Public repos
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await res.json();

  repos.forEach(repo => {
    if (repo.fork || featuredProjects.some(f => f.name.toLowerCase() === repo.name.toLowerCase())) return;

    const projectData = {
      name: repo.name,
      desc: repo.description || "No description available.",
      tech: ["GitHub Repo"],
      img: "assets/images/default.png",
      link: repo.html_url,
      category: "Public Repo"
    };

    const card = document.createElement("div");
    card.classList.add("project-card");
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

// 🧩 Fetch README from GitHub
async function fetchReadme(projectName) {
  const urls = [
    `https://raw.githubusercontent.com/${username}/${projectName}/main/README.md`,
    `https://raw.githubusercontent.com/${username}/${projectName}/master/README.md`
  ];

  for (const url of urls) {
    const res = await fetch(url);
    if (res.ok) return await res.text();
  }
  return "❌ No README found for this project.";
}

// 🧭 Modal logic
function setupModalEvents() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close");

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", async () => {
      const project = JSON.parse(card.dataset.project);

      document.getElementById("modal-title").textContent = project.name;
      document.getElementById("modal-desc").textContent = project.desc;
      document.getElementById("modal-img").src = project.img;
      document.getElementById("modal-tech").innerHTML = project.tech.map(t => `<span class="tag">${t}</span>`).join("");
      document.getElementById("modal-link").href = project.link;

      const readmeContainer = document.getElementById("modal-readme");
      readmeContainer.innerHTML = "🕒 Loading README preview...";
      readmeContainer.classList.remove("collapsed");

      const readme = await fetchReadme(project.name);
      const html = marked.parse(readme);
      readmeContainer.innerHTML = html;

      // Syntax highlighting
      hljs.highlightAll();

      // Collapsible toggle
      const toggleContainer = document.createElement("div");
      toggleContainer.id = "readme-toggle-container";
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "readme-toggle";
      toggleBtn.textContent = "▼ Show More";
      toggleBtn.addEventListener("click", () => {
        readmeContainer.classList.toggle("collapsed");
        toggleBtn.textContent = readmeContainer.classList.contains("collapsed") ? "▼ Show More" : "▲ Collapse";
      });
      toggleContainer.appendChild(toggleBtn);
      readmeContainer.after(toggleContainer);

      readmeContainer.classList.add("collapsed");
      modal.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// 🔍 Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    document.querySelectorAll(".project-card").forEach(card => {
      card.style.display =
        category === "all" || card.innerHTML.includes(category) ? "block" : "none";
    });
  });
});

loadProjects();
