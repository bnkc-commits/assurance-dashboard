let token = null;
const socket = io();
let peer = new RTCPeerConnection();

peer.ondatachannel = (event) => {
  let channel = event.channel;
  channel.onmessage = (e) => {
    let msgDiv = document.getElementById("messages");
    let data = JSON.parse(e.data);
    msgDiv.innerHTML += `<p><strong>${data.name}</strong>: ${data.request}</p>`;
  };
};

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
    alert("Agent connecté !");
    loadLogs();
  } else {
    alert("Erreur de connexion: " + (data.error || "inconnue"));
  }
};

async function loadLogs() {
  const res = await fetch("/api/logs", {
    headers: { "Authorization": "Bearer " + token }
  });
  const data = await res.json();
  let logsDiv = document.getElementById("logs");
  logsDiv.innerHTML = data.map(l => `<p>${l.action} par ${l.user_email} à ${l.timestamp}</p>`).join("");
}

document.getElementById("validateForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("validateEmail").value;
  const res = await fetch("/api/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  alert(data.status || data.error);
};

function printPDF() {
  window.open("/api/print", "_blank");
}
