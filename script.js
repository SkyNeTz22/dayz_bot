const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const GOOGLE_API_KEY = "AIzaSyBg3v0HTwv-TEPIOsTYge4VziKm5GV7tS0";
const GOOGLE_CUSTOM_SEARCH_ID = "93ef247daff724aaf";


sendBtn.addEventListener("click", handleUserInput);

function handleUserInput() {
	const categories = ["ammo_questions", "general_questions", "guns_questions", "sickness_questions"];
    const question = userInput.value.trim();
	if (question !== "") {
		displayUserMessage(question);
        // Load the JSON file
		let matchFound = false;
		for (const category of categories) {
			fetch(category + ".json")
			.then((response) => response.json())
			.then((jsonArray) => {
				for (const jsonField of jsonArray) {
				matchFound = false;
				// Check if question matches any question inside the json file
					if (question.toLowerCase() === jsonField["question"].toLowerCase()) {
						displayBotMessage(jsonField["answer"]);
						// Match found => break and get out of loop.
						matchFound = true;
						break;		
					}
				}
				
			})
			.catch((error) => {
				console.error("Error loading or parsing JSON:", error);
			});
			if (matchFound) {
				break;
			}
		}
		userInput.value = "";
	}
}

function displayUserMessage(message) {
    const userMessage = `<div class="user-message" style="color: cyan;">User: ${message}</div>`;
    chatBox.innerHTML += userMessage;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayBotMessage(message) {
    const botMessage = `<div class="bot-message" style="color: gold;">Bot: ${message}</div>`;
    chatBox.innerHTML += botMessage;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(question) {
    // You can implement the actual bot logic here to generate responses based on the question.
    const botResponse = generateBotResponse(question);
    setTimeout(() => {
        displayBotMessage(botResponse);
    }, 500);
}

function generateBotResponse(question) {
    // Replace this with your actual logic to generate responses.
    return "I'm just a simple bot. I don't have access to real DayZ information, but I'm here to help!";
}

function fetchFAQAnswers(question) {
}

async function searchGoogle(question) {
    try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${question}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CUSTOM_SEARCH_ID}`);
        const data = await response.json();
        const firstResult = data.items && data.items[0];
        return firstResult ? Google: ${firstResult.snippet} : null;
    } catch (error) {
        console.error("Error fetching Google response:", error);
        return null;
    }
}

async function simulateBotTyping() {
    const typingElement = document.createElement("div");
    typingElement.classList.add("bot-message", "bot-typing");
    chatBox.appendChild(typingElement);

    const botResponse = "This is a sample response from the bot."; // Replace with your bot's response
    let currentCharIndex = 0;

    const typingInterval = setInterval(() => {
        if (currentCharIndex <= botResponse.length) {
            typingElement.innerHTML = Bot is typing: ${botResponse.substring(0, currentCharIndex)};
            chatBox.scrollTop = chatBox.scrollHeight;
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
            setTimeout(() => {
                chatBox.removeChild(typingElement);
                displayBotMessage(botResponse);
            }, 1000);
        }
    }, 100);
}