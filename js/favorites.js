import { GithubUser } from "../GithubUser.js"

// classe que via conter a logica dos dados
// como os dados serão estruturados 

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('CaDeodoro')
    .then(user => console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
      ("@github-favorites:")) || []
 
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {

    try {

      const userExists = this.entries.find(entry => entry.login === username)

      console.log(userExists)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)
      
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
    
    
  }

}

// classe que vai criar a visualização e eventos do html 
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value)
      
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `http://github.com/${user.login}.png`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");
        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td class="user">
            <img src="https://avatars.githubusercontent.com/u/115178847?s=400&u=5fa771d57043a1e5f98450087b13b3d4ec8be43c&v=4" alt="imagem de carol deodoro">
            <a href="https://github.com/CaDeodoro">
              <p>Carol Deodoro</p>
            <span>CaDeodoro</span>
            </a>
            
          </td>
          <td class="repositories">
            76
          </td>

          <td class="followers">
            9589
          </td>
          <td>
          <button class="remove">Remover</button>
          </td>
        
   `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
