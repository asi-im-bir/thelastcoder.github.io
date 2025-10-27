async function loadProjects() {
  const username = "asi-im-bir";
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await response.json();

  const projectContainer = document.getElementById("projects");
  projectContainer.innerHTML = ""; // clear old content

  repos
    .filter(repo => !repo.fork && !repo.private) // skip forks and private repos
    .forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";

      const homepage = repo.homepage ? 
        `<a href="${repo.homepage}" target="_blank">🌐 Live Demo</a>` : "";

      card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || "No description available."}</p>
        <p>⭐ ${repo.stargazers_count} | 🛠️ ${repo.language || "N/A"}</p>
        ${homepage}
        ${repo.language ? `<div class="badge">${repo.language}</div>` : ""}
      `;
      projectContainer.appendChild(card);
    });
}

loadProjects();
