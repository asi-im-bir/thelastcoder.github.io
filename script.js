const username = "asi-im-bir";

// === Featured projects with summaries ===
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

// === Load both featured & public GitHub repos ===
async function loadProjects() {
  const container = document.getElementById("project-list");
  container.innerHTML = "";

  // 1️⃣ Featured projects (curated)
  featuredProjects.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="tech-tags">${p.tech.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <p class="category">📂 ${p.category}</p>
      <a href="${p.link}" target="_blank" class="view-btn">🔗 View on GitHub</a>
    `;
    container.appendChild(card);
  });

  // 2️⃣ Public repos from GitHub
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await response.json();

  repos.forEach(repo => {
    const isFeatured = featuredProjects.some(f => f.name.toLowerCase() === repo.name.toLowerCase());
    if (repo.fork || isFeatured) return;

    const card = document.createElement("div");
    card.classList.add("project-card");
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p class="desc">${repo.description || "No description provided."}</p>
      <p class="category">📂 Public Repo</p>
      <a href="${repo.html_url}" target="_blank" class="view-btn">🔗 View on GitHub</a>
    `;
    container.appendChild(card);
  });
}

// Initialize
loadProjects();

// 🔍 Filtering logic
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;

    const allCards = document.querySelectorAll(".project-card");
    allCards.forEach(card => {
      if (category === "all") {
        card.style.display = "block";
      } else {
        card.style.display = card.innerHTML.includes(category) ? "block" : "none";
      }
    });
  });
});
