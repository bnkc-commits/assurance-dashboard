let token = null;
const socket = io();
let peer = new RTCPeerConnection();
let channel = peer.createDataChannel("prospectData");

document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    alert("Connecté !");
  } else {
    alert("Erreur: " + (data.error || "inconnue"));
  }
};

document.getElementById("prospectForm").onsubmit = async (e) => {
  e.preventDefault();
  const request = {
    name: document.getElementById("name").value,
    request: document.getElementById("request").value
  };
  await fetch("/api/prospect", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
    body: JSON.stringify(request)
  });
  channel.send(JSON.stringify(request));
};
