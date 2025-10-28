// === Project Data ===
const projects = [
  {
    name: "Risk Management Dashboard",
    type: "Web App",
    date: "March 2025",
    desc: "A dashboard to visualize enterprise risks, mitigation plans, and compliance KPIs.",
    tech: ["Python", "Plotly", "Flask"],
    img: "assets/images/risk-dashboard.png",
    link: "https://github.com/asi-im-bir/risk-dashboard"
  },
  {
    name: "Compliance Automation Engine",
    type: "Automation Script",
    date: "July 2024",
    desc: "Automates ISO 27001 control mapping and generates compliance evidence reports.",
    tech: ["Python", "Pandas", "OpenAI API"],
    img: "assets/images/compliance-audit.png",
    link: "https://github.com/asi-im-bir/compliance-engine"
  },
  {
    name: "Security Audit Portal",
    type: "Web Portal",
    date: "February 2025",
    desc: "Web-based portal for tracking audit findings, corrective actions, and policies.",
    tech: ["NextJS", "Tailwind", "MongoDB"],
    img: "assets/images/grc-automation.png",
    link: "https://github.com/asi-im-bir/audit-portal"
  },
  {
    name: "Incident Tracker",
    type: "GRC Tool",
    date: "November 2024",
    desc: "Tracks and manages security incidents, compliance evidence, and remediation workflows.",
    tech: ["React", "Express", "NodeJS"],
    img: "assets/images/incident-tracker.png",
    link: "https://github.com/asi-im-bir/incident-tracker"
  }
];

// === Render Projects ===
const container = document.getElementById("project-list");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");

// Populate projects
function renderProjects(filterType = "all") {
  container.innerHTML = "";
  const filtered = filterType === "all" ? projects : projects.filter(p => p.type === filterType);

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" class="project-image">
      <div class="project-content">
        <div class="project-header">
          <h3>${p.name}</h3>
          <span class="project-date">${p.date}</span>
        </div>
        <p class="project-type">${p.type}</p>
        <p class="project-desc">${p.desc}</p>
        <div class="tech-stack">
          ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
      </div>
    `;
    card.addEventListener("click", () => openModal(p));
    container.appendChild(card);
  });
}

// === Modal Functions ===
function openModal(project) {
  document.getElementById("modal-img").src = project.img;
  document.getElementById("modal-title").textContent = project.name;
  document.getElementById("modal-desc").textContent = project.desc;
  document.getElementById("modal-tech").innerHTML = project.tech
    .map(t => `<span class="tech-tag">${t}</span>`)
    .join("");
  document.getElementById("modal-link").href = project.link;
  modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// === Filter Buttons ===
const buttons = document.querySelectorAll(".filter-btn");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    renderProjects(category);
  });
});

// Initial Render
renderProjects();

