window.onload = () => {
  document.getElementById("search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buscarRepos();
    }
  });
};

function buscarRepos() {
  const username = document.getElementById("pesquisa").value.trim();
  if (!username) return;

  const perfilExistente = document.getElementById("perfil");
  if (perfilExistente) perfilExistente.remove();

  fetch(`https://api.github.com/users/${username}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Usuário não encontrado");
      }
      return res.json();
    })
    .then((user) => {
      const perfilDiv = document.createElement("div");
      perfilDiv.id = "perfil";

      const blog = user.blog ? user.blog.trim() : "";
      const isLinkedIn = blog.includes("linkedin.com");

      perfilDiv.innerHTML = `
        <div class="Doce">
          <img src="${user.avatar_url}" width="80" style="border-radius:50%">
        </div>
        <section class="hot">
          <strong>${user.name || user.login}</strong><br>
          <p>${user.bio || "Bio não informada"}</p>
          <div class="icone">

          <div class="bolo">
            <img src="img/people.png" width 10/>
          </div>
          <p> Seguidores: ${user.followers}</p>
            <p> • Seguindo: ${user.following}</p>
            <p> <img src="img/location.png" width 15/> ${user.location || "Localização não informada"}</p>
            ${
              blog
                ? `<p> <img src="img/link.png" width 15/> <a href="${blog}" target="_blank">
                    ${isLinkedIn ? "LinkedIn" : "Website Pessoal"}
                   </a></p>`
                : ""
            }
          </div>
        </section>
      `;

      const container = document.querySelector(".container");
      container.insertBefore(perfilDiv, document.getElementById("repos"));
    })
    .catch((error) => {
      alert(error.message);
    });

  fetch(`https://api.github.com/users/${username}/repos`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Nenhum repositório encontrado. Faça uma busca para ver os resultados.");
      }
      return res.json();
    })
    .then((repos) => {
      const reposDiv = document.getElementById("repos");
      reposDiv.innerHTML = "";
      if (repos.length === 0) {
        reposDiv.innerHTML = "<p>Nenhum repositório encontrado.</p>";
      } else {
        repos.forEach((repo) => {
          reposDiv.innerHTML += `
            <div class="repo-card">
              <div class="repo-title">
                <strong class="repo-text">${repo.name}</strong>
              </div>
              <div class="repo-star">
                <p class="star"> <img src="img/noto_star.png" width 10/> Estrelas: ${repo.stargazers_count}</p>
              </div>
              <a href="${repo.html_url}" target="_blank">
                <button class="btn-repo">Ver no GitHub</button>
              </a>
            </div>
          `;
        });
      }
    })
    .catch((error) => {
      const reposDiv = document.getElementById("repositorios");
      reposDiv.innerHTML = `<p>${error.message}</p>`;
    });
}