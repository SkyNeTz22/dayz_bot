const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

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