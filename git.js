const APIURL = "https://api.github.com/users/";
let search = document.querySelector(".search");
let main = document.querySelector(".main");
let form = document.querySelector(".form");

async function getUsername(username) {
    try {
        // Fetch user details and parse as JSON
        const response = await fetch(APIURL + username);
        if (!response.ok) throw new Error("No Profile Exist In This Name!"); // Handle non-200 responses
        const userData = await response.json(); // Parse to JSON
        userCard(userData); // Create user card with the data
        getRepos(username); // Fetch repositories
    } catch (err) {
        CreateError(err.message); // Show error message
    }
}

async function getRepos(username) {
    try {
        const response = await fetch(APIURL + username + "/repos?sort=created");
        if (!response.ok) throw new Error("Problem fetching repos");
        const repoData = await response.json(); // Parse as JSON
        addReposToCard(repoData); // Add repos to card
    } catch (err) {
        CreateError(err.message);
    }
}

// Fetch and display user details
function userCard(user) {
    const userID = user.name || user.login;
    const userInfo = user.bio ? `<p>${user.bio}</p>` : "";
    const createHTMLtag = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${userID}</h2>
            ${userInfo}
            <ul>
                <li>${user.followers}<strong> Followers</strong></li>
                <li>${user.following}<strong> Following</strong></li>
                <li>${user.public_repos}<strong> Repos</strong></li>
            </ul>
            <div  class="repos"></div>
        </div>
        </div>
      `;
    
    main.innerHTML = createHTMLtag;
}

// Error message handler
function CreateError(msg) {
    const crehtml = `
    <div class="card">
        <h1>${msg}</h1>
    </div>`;
    main.innerHTML = crehtml;
}

// Add repositories to the user card
function addReposToCard(repos) {
    const reposEl = document.querySelector(".repos");
    repos.slice(0, 5).forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        
        repoEl.innerText = repo.name;
        reposEl.appendChild(repoEl);
    });
}

// Handle form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUsername(user); // Fetch user data
        search.value = ""; // Clear search input
    }
});
