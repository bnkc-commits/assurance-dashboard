// Inscription
document.getElementById("registerForm").onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const username = document.getElementById("usernameRegister").value;
  const password = document.getElementById("passwordRegister").value;
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, password })
  });
  const data = await res.json();
  alert(data.status || data.error);
};

// Connexion
document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    alert("Connecté !");
  } else {
    alert("Erreur: " + (data.error || "inconnue"));
  }
};
