let currentChatId = null;

// Auto create chat on page load
window.addEventListener("DOMContentLoaded", () => {
    newChat();
});

async function newChat() {
    try {
        const res = await fetch("/chat/new", { method: "POST" });
        const data = await res.json();
        currentChatId = data.chatId;
        document.getElementById("messages").innerHTML = "";
    } catch (err) {
        console.error("newChat error:", err);
    }
}

async function sendMessage() {
    const input = document.getElementById("msg");
    const text = input.value.trim();
    if (!text || !currentChatId) return;

    addMessage("user", text);
    input.value = "";

    // Show GPT typing
    showTyping(true);

    try {
        const res = await fetch("/chat/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId: currentChatId, message: text })
        });

        const data = await res.json();

        // Hide typing and show actual reply
        showTyping(false);
        addMessage("bot", data.reply || "No reply from model");
    } catch (err) {
        showTyping(false);
        console.error("sendMessage error:", err);
        addMessage("bot", "Error getting response");
    }
}

function addMessage(type, text) {
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.classList.add("msg", type);
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
}

function showTyping(show) {
    const messages = document.getElementById("messages");
    let typingDiv = document.getElementById("typing");

    if (show) {
        if (!typingDiv) {
            typingDiv = document.createElement("div");
            typingDiv.id = "typing";
            typingDiv.classList.add("msg", "bot");
            typingDiv.innerHTML = `
                GPT is typing
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            `;
            messages.appendChild(typingDiv);
        }
        typingDiv.style.display = "flex";
    } else if (typingDiv) {
        typingDiv.remove();
    }

    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
}
