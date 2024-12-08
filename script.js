
// Konsolidierte Skript-Datei

// Globale Variablen
let chatList = JSON.parse(localStorage.getItem("chatList")) || [];
let currentChatIndex = null;
let botKnowledgeBase = JSON.parse(localStorage.getItem("botKnowledgeBase")) || {};

// Konversationskontext
let conversationContext = {
    userMood: null,
    hobbies: [],
    lastTopic: null,
};

// Seite wechseln
function switchPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

// Nachricht absenden mit Enter-Taste
document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Wortschatz aktualisieren
function updateWordList() {
    const wordListItems = document.getElementById("word-list-items");
    wordListItems.innerHTML = "";
    for (const [word, response] of Object.entries(botKnowledgeBase)) {
        const row = document.createElement("tr");

        const wordCell = document.createElement("td");
        wordCell.textContent = word;

        const responseCell = document.createElement("td");
        responseCell.textContent = response;

        const actionsCell = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Bearbeiten";
        editBtn.onclick = () => editWord(word);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => deleteWord(word);

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        row.appendChild(wordCell);
        row.appendChild(responseCell);
        row.appendChild(actionsCell);

        wordListItems.appendChild(row);
    }
}

// Wort hinzufügen
function addWord() {
    const newWord = document.getElementById("new-word").value.trim();
    const newResponse = document.getElementById("new-response").value.trim();

    if (newWord && newResponse) {
        botKnowledgeBase[newWord] = newResponse;
        saveKnowledgeBase();
        updateWordList();
        document.getElementById("new-word").value = "";
        document.getElementById("new-response").value = "";
    }
}

// Wort bearbeiten
function editWord(word) {
    const newResponse = prompt(`Neue Antwort für "${word}":`, botKnowledgeBase[word]);
    if (newResponse) {
        botKnowledgeBase[word] = newResponse;
        saveKnowledgeBase();
        updateWordList();
    }
}

// Wort löschen
function deleteWord(word) {
    if (confirm(`Möchtest du "${word}" wirklich löschen?`)) {
        delete botKnowledgeBase[word];
        saveKnowledgeBase();
        updateWordList();
    }
}


// Funktion: Neuer Chat hinzufügen
function addNewChat() {
    const chatName = prompt("Gib dem neuen Chat einen Namen:");
    if (chatName) {
        chatList.push({ name: chatName, messages: [] });
        updateChatList();
    }
}
// Wissen speichern
function saveKnowledgeBase() {
    localStorage.setItem("botKnowledgeBase", JSON.stringify(botKnowledgeBase));
}

// Wissen laden
function loadKnowledgeBase() {
    const savedKnowledge = localStorage.getItem("botKnowledgeBase");
    if (savedKnowledge) {
        botKnowledgeBase = JSON.parse(savedKnowledge);
    }
}

// Funktion: Chats aktualisieren
function updateChatList() {
    const chatListItems = document.getElementById("chat-list-items");
    chatListItems.innerHTML = ""; // Leeren der Liste

    chatList.forEach((chat, index) => {
        const chatItem = document.createElement("div");
        chatItem.className = "chat-item";
        chatItem.innerHTML = `
            <div class="chat-details">
                <span class="chat-name">${chat.name}</span>
                <span class="last-message">${chat.messages.at(-1)?.text || "Keine Nachrichten"}</span>
            </div>
        `;

        // Event Listener für Klick hinzufügen
        chatItem.addEventListener("click", () => openChat(index));
        chatListItems.appendChild(chatItem);
    });

    // Lokale Speicherung aktualisieren
    localStorage.setItem("chatList", JSON.stringify(chatList));
}

// Neuer Chat hinzufügen
function addNewChat() {
    const chatName = prompt("Gib dem neuen Chat einen Namen:");
    if (chatName) {
        chatList.push({ name: chatName, messages: [] });
        updateChatList();
    }
}
// Funktion: Chat öffnen
function openChat(index) {
    currentChatIndex = index; // Setze den aktuellen Chat-Index
    const chat = chatList[index];

    // Titel des aktuellen Chats aktualisieren
    document.getElementById("current-chat-title").textContent = chat.name;

    // Zur Chat-Seite wechseln
    document.getElementById("chat-window").style.display = "block";
    document.getElementById("chat-list").style.display = "none";

    // Nachrichten anzeigen
    displayMessages();
}

// Nachrichtenbereich aktualisieren
function displayMessages() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    if (currentChatIndex === null) {
        messagesDiv.innerHTML = `<div class="no-chat">Kein Chat ausgewählt.</div>`;
        return;
    }

    chatList[currentChatIndex].messages.forEach(msg => {
        const messageElement = document.createElement("div");
        messageElement.className = msg.sender === "user" ? "message user" : "message bot";
        messageElement.innerText = msg.text;
        messagesDiv.appendChild(messageElement);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Automatisch scrollen
}

// Funktion: Zurück zur Chatliste
function returnToChatList() {
    document.getElementById("chat-window").style.display = "none";
    document.getElementById("chat-list").style.display = "block";
}


// Navigation modernisieren
function updateNavigation() {
    const navLinks = document.querySelectorAll(".bottom-nav a");
    navLinks.forEach(link => {
        link.style.borderBottom = "2px solid transparent";
        link.style.transition = "border-bottom 0.3s ease";
        link.addEventListener("mouseenter", () => {
            link.style.borderBottom = "2px solid white";
        });
        link.addEventListener("mouseleave", () => {
            link.style.borderBottom = "2px solid transparent";
        });
    });
}

// Funktion: Nachricht senden
function sendMessage() {
    const userMessage = document.getElementById("user-input").value.trim();
    if (!userMessage || currentChatIndex === null) return;

    const chat = chatList[currentChatIndex];
    // Benutzer-Nachricht hinzufügen
    chat.messages.push({ sender: "user", text: userMessage });
    addMessage("user", userMessage);

    // Bot-Antwort mit Verzögerung hinzufügen
    setTimeout(() => {
        const botResponse = generateBotResponse(userMessage);
        chat.messages.push({ sender: "bot", text: botResponse });
        addMessage("bot", botResponse);
        displayMessages();
        updateChatList(); // Speichern der aktualisierten Chatliste
    }, 1000); // 1000 Millisekunden = 1 Sekunde Verzögerung

    document.getElementById("user-input").value = "";
    displayMessages();
}



// Nachricht hinzufügen
function addMessage(sender, text) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = sender === "user" ? "message user" : "message bot";
    messageElement.innerText = text;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


// Funktion: Bot-Antwort generieren
function generateBotResponse(userMessage) {
    const detectedMood = detectMood(userMessage);
    if (detectedMood) {
        conversationContext.userMood = detectedMood;
        conversationContext.lastTopic = "mood";
        return `Ich bemerke, dass du dich ${detectedMood} fühlst. Weißt du, warum du dich so fühlst?`;
    }

    const detectedHobby = detectHobby(userMessage);
    if (detectedHobby) {
        conversationContext.hobbies.push(detectedHobby);
        conversationContext.lastTopic = "hobby";
        return askFollowUpHobbyQuestion(detectedHobby);
    }

    if (botKnowledgeBase[userMessage]) {
        return botKnowledgeBase[userMessage];
    } else {
        const newResponse = prompt(`Wie soll ich auf "${userMessage}" antworten?`);
        if (newResponse) {
            botKnowledgeBase[userMessage] = newResponse;
            saveKnowledgeBase();
            addWordToWordList(userMessage, newResponse);
            return newResponse;
        }
        return "Das habe ich leider nicht verstanden.";
    }
}

// Funktion: Stimmung erkennen
function detectMood(message) {
    const moodKeywords = {
        happy: ["glücklich", "super", "freue mich"],
        sad: ["traurig", "schlecht", "enttäuscht"],
        stressed: ["gestresst", "überarbeitet", "druck"]
    };

    for (const mood in moodKeywords) {
        if (moodKeywords[mood].some(keyword => message.toLowerCase().includes(keyword))) {
            return mood;
        }
    }
    return null;
}

// Funktion: Hobby erkennen
function detectHobby(message) {
    const hobbies = ["zeichnen", "malen", "lesen", "fußball", "kochen", "tanzen", "fotografieren"];
    for (const hobby of hobbies) {
        if (message.toLowerCase().includes(hobby)) {
            return hobby;
        }
    }
    return null;
}

// Funktion: Folgefragen zu Hobbys
function askFollowUpHobbyQuestion(hobby) {
    const hobbyQuestions = {
        zeichnen: "Welche Art von Zeichnungen machst du gerne?",
        malen: "Welche Farben oder Techniken verwendest du am liebsten?",
        lesen: "Welches Buch liest du aktuell?",
        fußball: "Für welchen Verein spielst du oder welchen schaust du gerne?",
        kochen: "Was ist dein Lieblingsgericht, das du kochst?",
        tanzen: "Welche Tanzart magst du am meisten?",
        fotografieren: "Fotografierst du eher Natur, Menschen oder etwas anderes?"
    };
    return hobbyQuestions[hobby] || `Das klingt spannend! Erzähl mir mehr über ${hobby}.`;
}

// Funktion: Wissen speichern
function saveKnowledgeBase() {
    localStorage.setItem('botKnowledgeBase', JSON.stringify(botKnowledgeBase));
}

// Funktion: Wissen laden
function loadKnowledgeBase() {
    const savedKnowledge = localStorage.getItem('botKnowledgeBase');
    if (savedKnowledge) {
        botKnowledgeBase = JSON.parse(savedKnowledge);
    }
}

// Initialisierung
window.onload = function () {
    updateChatList();
    loadKnowledgeBase();
};

function updateWordList() {
    const wordListItems = document.getElementById("word-list-items");
    wordListItems.innerHTML = "";
    for (const [word, response] of Object.entries(botKnowledgeBase)) {
        const row = document.createElement("tr");

        const wordCell = document.createElement("td");
        wordCell.textContent = word;

        const responseCell = document.createElement("td");
        responseCell.textContent = response;

        const actionsCell = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Bearbeiten";
        editBtn.onclick = () => editWord(word);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => deleteWord(word);

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        row.appendChild(wordCell);
        row.appendChild(responseCell);
        row.appendChild(actionsCell);

        wordListItems.appendChild(row);
    }
}

function addWord() {
    const newWord = document.getElementById("new-word").value.trim();
    const newResponse = document.getElementById("new-response").value.trim();

    if (newWord && newResponse) {
        botKnowledgeBase[newWord] = newResponse;
        saveKnowledgeBase();
        updateWordList();
        document.getElementById("new-word").value = "";
        document.getElementById("new-response").value = "";
    }
}

function editWord(word) {
    const newResponse = prompt(`Neue Antwort für "${word}":`, botKnowledgeBase[word]);
    if (newResponse) {
        botKnowledgeBase[word] = newResponse;
        saveKnowledgeBase();
        updateWordList();
    }
}

function deleteWord(word) {
    if (confirm(`Möchtest du "${word}" wirklich löschen?`)) {
        delete botKnowledgeBase[word];
        saveKnowledgeBase();
        updateWordList();
    }
}

// Wort hinzufügen
function addWord() {
    const newWord = document.getElementById("new-word").value.trim();
    const newResponse = document.getElementById("new-response").value.trim();

    if (newWord && newResponse) {
        botKnowledgeBase[newWord] = newResponse;
        saveKnowledgeBase();
        updateWordList();
        document.getElementById("new-word").value = "";
        document.getElementById("new-response").value = "";
    }
}

// Funktion: Wort zur Wortliste hinzufügen
function addWordToWordList(word, response) {
    const wordListTable = document.getElementById("word-list-items");
    const row = document.createElement("tr");

    const wordCell = document.createElement("td");
    wordCell.textContent = word;

    const responseCell = document.createElement("td");
    responseCell.textContent = response;

    const actionsCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Löschen";
    deleteBtn.onclick = () => deleteWord(word);

    actionsCell.appendChild(deleteBtn);
    row.appendChild(wordCell);
    row.appendChild(responseCell);
    row.appendChild(actionsCell);
    wordListTable.appendChild(row);
}


// Beim Laden der Seite
window.onload = function () {
    updateChatList();
    loadKnowledgeBase();
    updateWordList();
};
