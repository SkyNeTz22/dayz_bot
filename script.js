const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// i added this two rows below
const GOOGLE_API_KEY = "AIzaSyBg3v0HTwv-TEPIOsTYge4VziKm5GV7tS0";
const GOOGLE_CUSTOM_SEARCH_ID = "93ef247daff724aaf";


sendBtn.addEventListener("click", handleUserInput);

function handleUserInput() {
	const jsonCategories = ["ammo_questions", "general_questions", "guns_questions", "sickness_questions"];
	const jsonKeywords = ["keywords_ar"];
    const question = userInput.value.trim();
	if (question !== "") {
		displayUserMessage(question);
		simulateBotTyping(100);
		let checkQuestions = checkJsonQuestions(question, jsonCategories);
		let checkKeywords = false;
		if (!checkQuestions) {
			checkKeywords = checkJsonKeywords(question, jsonKeywords);
		}
		//if (!checkKeywords) {
		//	searchGoogle(question);
		//}
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

// and i added this part below here, first part is google, next part is bot typing look-alike

async function searchGoogle(question) {
	try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${question}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CUSTOM_SEARCH_ID}`);
        if (response.ok) {
            const data = await response.json();
            const firstResult = data.items && data.items[0];
            const botResponse = firstResult ? `Google: ${firstResult.snippet}` : "No results found.";
            
            displayBotMessage(botResponse); // Display the bot's response in the chat box
        } else {
            console.error("API request failed:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function simulateBotTyping(delayForWords) {
    const typingElement = document.createElement("div");
    typingElement.classList.add("bot-message", "bot-typing");
    chatBox.appendChild(typingElement);

    const botResponse = "Bot is writing..."; // Replace with your bot's response
    let currentCharIndex = 0;

    const typingInterval = setInterval(() => {
        if (currentCharIndex <= botResponse.length) {
            typingElement.innerHTML = `<span style="color: gold;">Bot is typing: ${botResponse.substring(0, currentCharIndex)}</span>`;
            chatBox.scrollTop = chatBox.scrollHeight;
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
            if (typingElement.parentElement === chatBox) {
                chatBox.removeChild(typingElement);
                displayBotMessage(botResponse);
            }
        }
    }, delayForWords);
}

function checkJsonQuestions(question, jsonCategories) { 
	// Load the JSON file
	for (const category of jsonCategories) {
		fetch(category + ".json")
		.then((response) => response.json())
		.then((jsonArray) => {
			for (const jsonField of jsonArray) {
			matchFound = false;
			// Check if question matches any question inside the json file
				if (question.toLowerCase() === jsonField["question"].toLowerCase()) {
					displayBotMessage(jsonField["answer"]);
					// Match found => break and get out of loop.
					return true;
				}
			}
			
		})
		.catch((error) => {
			console.error("Error loading or parsing JSON:", error);
		});
	}
	return false;
}

function checkJsonKeywords(question, keywordsCategories) {
	// Load the JSON file
	for (const keyword of keywordsCategories) {
		fetch(keyword + ".json")
		.then((response) => response.json())
		.then((jsonArray) => {
			for (const jsonField of jsonArray) {
			// Check if question matches any question inside the json file
				if (question.toLowerCase().includes(jsonField["keyword"].toLowerCase())) {
					displayBotMessage(jsonField["answer"]);
					// Match found => break and get out of loop.
					return true;	
				}
			}	
		})
		.catch((error) => {
			console.error("Error loading or parsing JSON:", error);
		});
	}
	return false;
}