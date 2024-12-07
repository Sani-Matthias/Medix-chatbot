// Wechsel zwischen Seiten
function switchPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

// Nachricht senden und anzeigen
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const messageText = userInput.value.trim();

    if (messageText) {
        addMessage('user', messageText); // Zeige Benutzer-Nachricht an
        const botResponse = generateBotResponse(messageText); // Generiere KI-Antwort
        setTimeout(() => {
            addMessage('bot', botResponse); // Zeige KI-Antwort an
        }, 1000); // Antwort verzögert anzeigen
        userInput.value = ''; // Eingabefeld leeren
        saveChat(); // Speichere den Chat-Verlauf
    }
}

// Nachricht im Chat-Fenster anzeigen
function addMessage(sender, text) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Automatisch scrollen
}

// Lernfähige KI-Datenbank
const botKnowledgeBase = JSON.parse(localStorage.getItem('botKnowledgeBase')) || {
    "Hallo": "Hallo! Wie kann ich dir helfen?",
    "Wie geht es dir?": "Mir geht es gut, danke! Und dir?",
    "Erzähl mir etwas über Erste Hilfe.": "Erste Hilfe ist die sofortige Hilfeleistung in einem Notfall. Was möchtest du genau wissen?"
};

// Einfache lernfähige KI-Antwort generieren
function generateBotResponse(userMessage) {
    if (botKnowledgeBase[userMessage]) {
        return botKnowledgeBase[userMessage];
    } else {
        const newResponse = prompt(`Wie soll die KI auf folgende Eingabe reagieren: "${userMessage}"?`);
        if (newResponse) {
            botKnowledgeBase[userMessage] = newResponse;
            saveKnowledgeBase();
            return newResponse;
        } else {
            return "Das habe ich leider nicht verstanden. Kannst du es anders formulieren?";
        }
    }
}

// Speichere die Wissensbasis im lokalen Speicher
function saveKnowledgeBase() {
    localStorage.setItem('botKnowledgeBase', JSON.stringify(botKnowledgeBase));
}

// Chat-Verlauf speichern
function saveChat() {
    const messages = document.getElementById('messages').innerHTML;
    localStorage.setItem('chatHistory', messages);
}

// Chat-Verlauf laden
function loadChat() {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
        document.getElementById('messages').innerHTML = savedMessages;
    }
}

// Chat-Verlauf löschen
function clearChat() {
    localStorage.removeItem('chatHistory');
    document.getElementById('messages').innerHTML = '';
}

// Wissensbasis zurücksetzen
function clearKnowledgeBase() {
    localStorage.removeItem('botKnowledgeBase');
    alert("Die Wissensbasis wurde zurückgesetzt.");
}

// Nachricht bei Drücken der Enter-Taste senden
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Beim Laden der Seite Chat-Verlauf und Wissensbasis laden
document.addEventListener('DOMContentLoaded', () => {
    loadChat();
});
