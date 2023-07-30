export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }));
  }
//   static async   search(data) {
//   const response  = await (endpoint) //usando axios
  
//   if(!response.data) {
//     throw new error( 'não há dados')
//   }

//   return response.data;
// }
}


// user: {
// "name"= "carol",
// "email"= "a@b.c"
// }

// user.email