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
    type: "Web App",
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

const container = document.getElementById("project-list");

function renderProjects(filterType = "all") {
  container.innerHTML = "";
  const filtered = filterType === "all" ? projects : projects.filter(p => p.type === filterType);

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="date">${p.date}</p>
      <p class="type"><strong>${p.type}</strong></p>
      <p class="desc">${p.desc}</p>
      <div class="tech-tags">${p.tech.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <a href="${p.link}" target="_blank" class="view-btn">🔗 View Project</a>
    `;
    container.appendChild(card);
  });
}

// Initialize
renderProjects();

// Filtering
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.category);
  });
});
