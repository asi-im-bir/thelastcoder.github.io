const username = "asi-im-bir";

// custom summaries
const customSummaries = {
  "portfolio-site": "My personal developer portfolio built with HTML, CSS, and JavaScript.",
  "weather-app": "A weather dashboard using OpenWeather API with dynamic icons and responsive layout.",
  "todo-api": "A RESTful Node.js API for managing tasks with JWT auth and MongoDB integration.",
};

// load repositories
async function loadProjects() {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await response.json();

  const container = document.getElementById("projects");
  container.innerHTML = "";

  repos
    .filter(repo => !repo.fork && !repo.private)
    .slice(0, 12) // show top 12
    .forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";

      const imagePath = `images/${repo.name}.png`;
      const homepage = repo.homepage ? `<a href="${repo.homepage}" target="_blank">🌐 Live Demo</a>` : "";

      card.innerHTML = `
        <img src="${imagePath}" alt="${repo.name}" class="project-img" onerror="this.style.display='none'">
        <div class="project-content">
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${customSummaries[repo.name] || repo.description || "A GitHub project."}</p>
          <p>⭐ ${repo.stargazers_count} | 🛠️ ${repo.language || "N/A"}</p>
          ${homepage}
          ${repo.language ? `<div class="badge">${repo.language}</div>` : ""}
        </div>
      `;
      container.appendChild(card);
    });
}

loadProjects();
