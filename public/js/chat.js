// Global State
let currentChatId = null;

// ==========================================
// 1. TYPING ANIMATION ENGINE
// ==========================================
function typeWriter(element, text) {
    let i = 0;
    element.innerHTML = "";
    const speed = 15; // Typing speed in milliseconds

    function type() {
        if (i < text.length) {
            // Handle newlines properly for code/text
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(type, speed);
            
            // Auto-scroll to bottom while typing
            const msgPanel = document.getElementById("messages");
            msgPanel.scrollTop = msgPanel.scrollHeight;
        }
    }
    type();
}

// ==========================================
// 2. CORE CHAT LOGIC
// ==========================================
async function startNewChat() {
    try {
        const res = await fetch("/chat/new", { method: "POST" });
        if (!res.ok) throw new Error("Failed to create chat");
        
        const data = await res.json();
        currentChatId = data.chatId;
        
        // Reset Chat UI
        document.getElementById("messages").innerHTML = '<div class="msg bot">New session started. How can I help?</div>';
    } catch (error) {
        console.error(error);
        if(typeof showToast === 'function') showToast("Error starting new chat", "error");
    }
}

async function loadChat(id) {
    try {
        currentChatId = id;
        const res = await fetch(`/chat/history/${id}`);
        if (!res.ok) throw new Error("Failed to load history");

        const chat = await res.json();
        const container = document.getElementById("messages");
        container.innerHTML = ""; // Clear current messages
        
        // Render history
        if (chat.messages.length === 0) {
            container.innerHTML = '<div class="msg bot">Empty chat. Say hello!</div>';
        } else {
            chat.messages.forEach(m => {
                addMessageUI(m.role === "user" ? "user" : "bot", m.text);
            });
        }

        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768 && typeof toggleSidebar === 'function') {
            toggleSidebar();
        }
    } catch (error) {
        console.error(error);
        if(typeof showToast === 'function') showToast("Could not load chat", "error");
    }
}

async function sendMessage() {
    const input = document.getElementById("msg");
    const text = input.value.trim();
    if (!text) return;

    // Ensure we have an active chat session
    if (!currentChatId) await startNewChat();

    // 1. Show user message
    addMessageUI("user", text);
    input.value = "";
    
    // 2. Show bot "Typing..." placeholder
    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "msg bot";
    botMsgDiv.innerHTML = `<span style="opacity: 0.7;"><i>CodeBot is thinking...</i></span>`;
    document.getElementById("messages").appendChild(botMsgDiv);
    
    // Auto-scroll
    const container = document.getElementById("messages");
    container.scrollTop = container.scrollHeight;

    try {
        // 3. Fetch from backend
        const res = await fetch("/chat/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId: currentChatId, message: text })
        });
        
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        
        // 4. Start Typewriter effect with actual response
        typeWriter(botMsgDiv, data.reply);

    } catch (error) {
        console.error("Send Error:", error);
        botMsgDiv.innerHTML = `<span style="color: #ef4444;">Sorry, I encountered an error connecting to the server.</span>`;
    }
}

function addMessageUI(type, text) {
    const container = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    
    // Convert newlines to <br> for proper rendering of previous chats
    div.innerHTML = text.replace(/\n/g, '<br>'); 
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ==========================================
// 3. API WRAPPERS FOR CRUD (No Page Reloads)
// ==========================================

// Ye function chat.ejs ke inline-edit blur/enter event se call hoga
async function renameChatAPI(id, newTitle) {
    try {
        const res = await fetch(`/chat/rename/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title: newTitle })
        });
        return res.ok; // Returns true if successful
    } catch (error) {
        console.error("Rename Error:", error);
        return false;
    }
}

// Ye function aapke modal / delete logic me use hoga
async function deleteChatAPI(id) {
    try {
        const res = await fetch(`/chat/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (error) {
        console.error("Delete Error:", error);
        return false;
    }
}