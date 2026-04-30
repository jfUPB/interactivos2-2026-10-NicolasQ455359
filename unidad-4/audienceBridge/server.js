const express = require("express");
const { WebSocketServer, WebSocket } = require("ws");
const http = require("http");
const os = require("os");

// ---- CONFIG ----
const HTTP_PORT = 3000;
const WS_PORT = 8083;

// ---- STATE ----
let biomeVotes = [0, 0, 0, 0]; // votes for biome 0..3
let currentBiome = 0;
let connectedCount = 0;
let collectiveEnergy = 0; // 0..100
const ENERGY_THRESHOLD = 80; // triggers mega event
const VOTE_COOLDOWN_MS = 2000;
const ACTION_COOLDOWN_MS = 800;
let voteTimer = null;
const VOTE_DURATION = 10000; // 10s voting window

// ---- EXPRESS (serve audience.html) ----
const app = express();
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/audience.html");
});

const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
  const ip = getLocalIP();
  console.log("🎮 Audience server running!");
  console.log(`   Local:   http://localhost:${HTTP_PORT}`);
  console.log(`   Network: http://${ip}:${HTTP_PORT}`);
  console.log(`   Share this URL with the audience ☝️`);
});

// ---- WS SERVER (audience + p5 visuals) ----
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`📡 WS listening on port ${WS_PORT}`);

const audienceClients = new Set();
const visualClients = new Set();

wss.on("connection", (ws, req) => {
  const url = req.url || "/";

  if (url.includes("/visual")) {
    // p5.js visual client
    visualClients.add(ws);
    console.log(`🎨 Visual conectado (${visualClients.size})`);
    ws.on("close", () => {
      visualClients.delete(ws);
      console.log(`⚠️ Visual desconectado (${visualClients.size})`);
    });
    // send current state
    ws.send(JSON.stringify({
      type: "state",
      biome: currentBiome,
      connected: audienceClients.size,
      energy: collectiveEnergy,
      votes: biomeVotes
    }));
  } else {
    // audience client
    audienceClients.add(ws);
    connectedCount = audienceClients.size;
    console.log(`📱 Audiencia conectada (${connectedCount})`);

    broadcastToAudience({
      type: "state",
      biome: currentBiome,
      connected: connectedCount,
      energy: collectiveEnergy,
      votes: biomeVotes
    });
    broadcastToVisuals({
      type: "audience_count",
      count: connectedCount
    });

    ws.on("message", (raw) => {
      let msg;
      try { msg = JSON.parse(raw); } catch { return; }
      handleAudienceMessage(msg, ws);
    });

    ws.on("close", () => {
      audienceClients.delete(ws);
      connectedCount = audienceClients.size;
      console.log(`⚠️ Audiencia desconectada (${connectedCount})`);
      broadcastToAudience({ type: "connected", count: connectedCount });
      broadcastToVisuals({ type: "audience_count", count: connectedCount });
    });
  }
});

// ---- HANDLE AUDIENCE ACTIONS ----
function handleAudienceMessage(msg, ws) {
  switch (msg.type) {
    case "vote_biome": {
      const b = parseInt(msg.biome);
      if (b >= 0 && b <= 3) {
        biomeVotes[b]++;
        console.log(`🗳️ Voto bioma ${b} | Votos: [${biomeVotes}]`);

        // start vote timer if not running
        if (!voteTimer) {
          voteTimer = setTimeout(resolveVotes, VOTE_DURATION);
          broadcastToAudience({ type: "vote_started", duration: VOTE_DURATION });
        }

        broadcastToAudience({
          type: "votes_update",
          votes: biomeVotes,
          total: biomeVotes.reduce((a, b) => a + b, 0)
        });
      }
      break;
    }

    case "send_life": {
      console.log("❤️ Vida enviada");
      collectiveEnergy = Math.min(100, collectiveEnergy + 4);
      broadcastToVisuals({
        type: "audience_life",
        energy: collectiveEnergy
      });
      broadcastToAudience({
        type: "energy_update",
        energy: collectiveEnergy
      });
      checkMegaEvent();
      break;
    }

    case "send_chaos": {
      console.log("💀 Caos enviado");
      collectiveEnergy = Math.min(100, collectiveEnergy + 6);
      broadcastToVisuals({
        type: "audience_chaos",
        energy: collectiveEnergy
      });
      broadcastToAudience({
        type: "energy_update",
        energy: collectiveEnergy
      });
      checkMegaEvent();
      break;
    }

    case "send_energy": {
      collectiveEnergy = Math.min(100, collectiveEnergy + 3);
      broadcastToAudience({
        type: "energy_update",
        energy: collectiveEnergy
      });
      checkMegaEvent();
      break;
    }
  }
}

// ---- VOTE RESOLUTION ----
function resolveVotes() {
  voteTimer = null;
  const maxVotes = Math.max(...biomeVotes);
  const winner = biomeVotes.indexOf(maxVotes);

  if (maxVotes > 0 && winner !== currentBiome) {
    currentBiome = winner;
    console.log(`🏆 Bioma ganador: ${winner} (${maxVotes} votos)`);

    broadcastToVisuals({
      type: "audience_biome",
      biome: winner,
      votes: biomeVotes
    });
  }

  broadcastToAudience({
    type: "vote_result",
    winner: winner,
    votes: biomeVotes,
    biome: currentBiome
  });

  // reset votes
  biomeVotes = [0, 0, 0, 0];
}

// ---- MEGA EVENT ----
function checkMegaEvent() {
  if (collectiveEnergy >= ENERGY_THRESHOLD) {
    console.log("⚡ MEGA EVENTO!");
    collectiveEnergy = 0;

    broadcastToVisuals({
      type: "audience_mega",
      energy: 0
    });
    broadcastToAudience({
      type: "mega_event",
      energy: 0
    });
  }
}

// ---- ENERGY DECAY ----
setInterval(() => {
  if (collectiveEnergy > 0) {
    collectiveEnergy = Math.max(0, collectiveEnergy - 0.5);
    // only broadcast occasionally to save bandwidth
  }
}, 500);

// broadcast energy state every 2s
setInterval(() => {
  broadcastToAudience({
    type: "energy_update",
    energy: collectiveEnergy
  });
}, 2000);

// ---- BROADCAST HELPERS ----
function broadcastToAudience(data) {
  const msg = JSON.stringify(data);
  for (const c of audienceClients) {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  }
}

function broadcastToVisuals(data) {
  const msg = JSON.stringify(data);
  for (const c of visualClients) {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  }
}

// ---- GET LOCAL IP ----
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
