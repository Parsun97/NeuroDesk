import { Router } from "express";

const router = Router();

router.get("/widget.js", (req, res) => {
  const apiOrigin = `${req.protocol}://${req.get("host")}`;

  const js = `
(function() {
  var config = window.NeuroDeskConfig || {};
  var botId = config.botId;
  if (!botId) return;

  var API_BASE = "${apiOrigin}/api";
  var sessionId = "session_" + Math.random().toString(36).slice(2) + Date.now();
  var isOpen = false;
  var isStreaming = false;

  /* ── Inject styles ──────────────────────────────────────── */
  var style = document.createElement("style");
  style.textContent = [
    "#nd-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;cursor:pointer;box-shadow:0 4px 24px rgba(99,102,241,.5);display:flex;align-items:center;justify-content:center;z-index:2147483646;transition:transform .2s,box-shadow .2s}",
    "#nd-btn:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(99,102,241,.7)}",
    "#nd-btn svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
    "#nd-panel{position:fixed;bottom:92px;right:24px;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#0f0f17;border:1px solid rgba(255,255,255,.1);border-radius:16px;box-shadow:0 24px 64px rgba(0,0,0,.6);display:flex;flex-direction:column;z-index:2147483645;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;transition:opacity .2s,transform .2s}",
    "#nd-panel.nd-hide{opacity:0;pointer-events:none;transform:translateY(12px)}",
    "#nd-header{padding:14px 16px;background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.15));border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px}",
    "#nd-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    "#nd-avatar svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
    "#nd-title{font-size:14px;font-weight:600;color:#fff}",
    "#nd-subtitle{font-size:11px;color:rgba(255,255,255,.5);margin-top:1px}",
    "#nd-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;margin-left:auto;box-shadow:0 0 6px #22c55e}",
    "#nd-msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}",
    "#nd-msgs::-webkit-scrollbar{width:4px}",
    "#nd-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}",
    ".nd-msg{max-width:82%;padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.5;word-break:break-word}",
    ".nd-bot{background:rgba(255,255,255,.06);color:rgba(255,255,255,.88);border-bottom-left-radius:4px;align-self:flex-start}",
    ".nd-user{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}",
    ".nd-typing{display:flex;gap:4px;padding:10px 14px}",
    ".nd-typing span{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.4);animation:nd-bounce .9s infinite}",
    ".nd-typing span:nth-child(2){animation-delay:.15s}",
    ".nd-typing span:nth-child(3){animation-delay:.3s}",
    "@keyframes nd-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}",
    "#nd-footer{padding:10px 12px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:8px}",
    "#nd-input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:9px 12px;font-size:13px;color:#fff;outline:none;transition:border-color .15s}",
    "#nd-input:focus{border-color:rgba(99,102,241,.6)}",
    "#nd-input::placeholder{color:rgba(255,255,255,.3)}",
    "#nd-send{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}",
    "#nd-send:disabled{opacity:.4;cursor:not-allowed}",
    "#nd-send svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
    "#nd-branding{text-align:center;padding:4px 0 8px;font-size:10px;color:rgba(255,255,255,.2)}",
    "#nd-branding a{color:rgba(255,255,255,.3);text-decoration:none}",
  ].join("");
  document.head.appendChild(style);

  /* ── Build DOM ──────────────────────────────────────────── */
  var btn = document.createElement("button");
  btn.id = "nd-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var panel = document.createElement("div");
  panel.id = "nd-panel";
  panel.className = "nd-hide";
  panel.innerHTML = [
    '<div id="nd-header">',
      '<div id="nd-avatar"><svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg></div>',
      '<div><div id="nd-title">AI Assistant</div><div id="nd-subtitle">Powered by NeuroDesk</div></div>',
      '<div id="nd-dot"></div>',
    '</div>',
    '<div id="nd-msgs"></div>',
    '<div id="nd-footer">',
      '<input id="nd-input" type="text" placeholder="Type a message..." autocomplete="off"/>',
      '<button id="nd-send" aria-label="Send"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>',
    '</div>',
    '<div id="nd-branding">Powered by <a href="https://neurodesk.ai" target="_blank">NeuroDesk AI</a></div>',
  ].join("");

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  /* ── Fetch bot info ─────────────────────────────────────── */
  fetch(API_BASE + "/chatbots/" + botId + "/public")
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(bot){
      if (!bot) return;
      if (bot.name) document.getElementById("nd-title").textContent = bot.name;
      if (bot.primaryColor) {
        var c = bot.primaryColor;
        btn.style.background = "linear-gradient(135deg," + c + "," + c + "dd)";
        btn.style.boxShadow = "0 4px 24px " + c + "88";
        document.getElementById("nd-send").style.background = "linear-gradient(135deg," + c + "," + c + "dd)";
        document.getElementById("nd-dot").style.background = c;
        document.getElementById("nd-dot").style.boxShadow = "0 0 6px " + c;
      }
      if (bot.welcomeMessage) appendBotMsg(bot.welcomeMessage);
    })
    .catch(function(){
      appendBotMsg("Hi! How can I help you today?");
    });

  /* ── Helpers ────────────────────────────────────────────── */
  function appendBotMsg(text) {
    var msgs = document.getElementById("nd-msgs");
    var el = document.createElement("div");
    el.className = "nd-msg nd-bot";
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function appendUserMsg(text) {
    var msgs = document.getElementById("nd-msgs");
    var el = document.createElement("div");
    el.className = "nd-msg nd-user";
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById("nd-msgs");
    var el = document.createElement("div");
    el.className = "nd-msg nd-bot nd-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  /* ── Send message with SSE streaming ───────────────────── */
  function sendMessage(text) {
    if (isStreaming || !text.trim()) return;
    isStreaming = true;
    document.getElementById("nd-send").disabled = true;
    document.getElementById("nd-input").value = "";

    appendUserMsg(text);
    var typing = showTyping();

    fetch(API_BASE + "/chatbots/" + botId + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, sessionId: sessionId }),
    }).then(function(response) {
      if (!response.ok) throw new Error("Request failed");
      typing.remove();
      var botEl = appendBotMsg("");
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = "";

      function read() {
        reader.read().then(function(result) {
          if (result.done) {
            isStreaming = false;
            document.getElementById("nd-send").disabled = false;
            return;
          }
          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split("\\n");
          buffer = lines.pop();
          lines.forEach(function(line) {
            if (!line.startsWith("data: ")) return;
            try {
              var parsed = JSON.parse(line.slice(6));
              if (parsed.content) {
                botEl.textContent += parsed.content;
                document.getElementById("nd-msgs").scrollTop = document.getElementById("nd-msgs").scrollHeight;
              }
            } catch(e) {}
          });
          read();
        }).catch(function() {
          isStreaming = false;
          document.getElementById("nd-send").disabled = false;
        });
      }
      read();
    }).catch(function() {
      typing.remove();
      appendBotMsg("Sorry, I could not connect. Please try again.");
      isStreaming = false;
      document.getElementById("nd-send").disabled = false;
    });
  }

  /* ── Toggle panel ───────────────────────────────────────── */
  btn.addEventListener("click", function() {
    isOpen = !isOpen;
    panel.classList.toggle("nd-hide", !isOpen);
    btn.innerHTML = isOpen
      ? '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    if (isOpen) setTimeout(function(){ document.getElementById("nd-input").focus(); }, 200);
  });

  document.getElementById("nd-send").addEventListener("click", function() {
    sendMessage(document.getElementById("nd-input").value);
  });

  document.getElementById("nd-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(this.value);
    }
  });
})();
`;

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(js);
});

export default router;
