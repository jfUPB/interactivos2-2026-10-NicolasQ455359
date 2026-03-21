const { WebSocket } = require("ws");
const osc = require("osc");

const WS_PORT = 8082;
const OSC_PORT = 9000;

const wss = new WebSocket.Server({ port: WS_PORT });
console.log("WS relay listening on ws://127.0.0.1:" + WS_PORT);

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: OSC_PORT,

  // Déjalo en false/omitido si quieres args crudos.
  // Si algún día activas metadata:true, el normalizador igual te deja números.
  // metadata: true,
});

udpPort.open();

function normalizeArg(a) {
  // Soporta ambos formatos:
  // - raw: 0.3
  // - metadata: { type: "f", value: 0.3 }
  if (a != null && typeof a === "object" && "value" in a) return a.value;
  return a;
}

udpPort.on("message", (msg, timeTag, info) => {
  const payload = {
    address: msg.address,
    args: Array.isArray(msg.args) ? msg.args.map(normalizeArg) : [],
    from: { address: info.address, port: info.port },
    timeTag,
  };

  const text = JSON.stringify(payload);
  console.log("Received OSC message:", text);

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(text);
  }
});

udpPort.on("ready", () => {
  console.log("OSC listening on udp://0.0.0.0:" + OSC_PORT);
});
