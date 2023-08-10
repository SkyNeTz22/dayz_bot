const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let isBotTyping = false;


const randomResponses = [
    "I'm here to assist you!",
    "Feel free to ask me anything!",
    "Let me think...",
    "That's an interesting question!",
    "I'm still learning, but I'll do my best to help!",
];

const greetings = [
    "Greetings, survivor!",
    "Hello there, adventurer!",
    "Salutations! How can I assist you today?",
    "Hey, survivor! Ready to dive into some DayZ knowledge?",
    "Greetings and salutations! What DayZ questions do you have?",
];

const inappropriateKeywords = ["porn", "sex", "racism", "politics", "jew", "nigger", "idiot", "morron", "retard", "cp", "shut up", "stfu", "fuck off", "bite me"];


function getRandomGreeting() {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

function getRandomResponse() {
    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    return randomResponses[randomIndex];
}

async function handleUserInput() {
    if (isBotTyping) {
        return;
    }
    
    const userMessage = userInput.value.trim().toLowerCase();

    // Check for inappropriate keywords
    const containsInappropriateKeyword = inappropriateKeywords.some(keyword => userMessage.includes(keyword));

    if (containsInappropriateKeyword) {
        // Delete the inappropriate message and display a placeholder message
        displayUserMessage("Message deleted", "color: red; font-weight: bold;" );
        userInput.value = ""; // Clear the input field
        isBotTyping = true;
        const inappropriateResponses = [
            "That wasn't very nice...",
            "Oh my, you can't write that!",
            "Wash those fingers!",
            "I'm sorry, but I can't respond to inappropriate content.",
            "Inappropriate content is not welcome here.",
        ];
        const randomInappropriateResponse = inappropriateResponses[Math.floor(Math.random() * inappropriateResponses.length)];

        await simulateBotTyping(50, randomInappropriateResponse);

        await new Promise(resolve => setTimeout(resolve, 1000));
        isBotTyping = false;
        return;
    }

    // Handle greetings
    if (userMessage.includes("hi") || userMessage.includes("hello") || userMessage.includes("hey") || userMessage.includes("zup") || userMessage.includes("what's up")) {
        const randomGreeting = getRandomGreeting();
        displayUserMessage(userMessage);
        await simulateBotTyping(50, randomGreeting);
        await new Promise(resolve => setTimeout(resolve, 1000));
        isBotTyping = false;
        userInput.value = ""; // Clear the input field
        return;
    }





    isBotTyping = true;

    const jsonCategories = ["ammo_questions", "general_questions", "guns_questions", "sickness_questions"];
    const jsonKeywords = ["keywords_ar"];
    const question = userInput.value.trim();

    if (question !== "") {
        displayUserMessage(question);
        userInput.value = "";
        let numberOfLetters = 0;
        try {
            let checkQuestions = await checkJsonQuestions(question, jsonCategories);
            let checkKeywords = false;
            if (checkQuestions.boolValue) {
                numberOfLetters = checkQuestions.intValue;
            } else if (!checkQuestions.boolValue) {
                checkKeywords = await checkJsonKeywords(question, jsonKeywords);
                if (checkKeywords.boolValue) {
                    numberOfLetters = checkKeywords.intValue;
                }
            }
            if (!checkQuestions.boolValue && !checkKeywords.boolValue) {
                const randomResponse = getRandomResponse();
				numberOfLetters = countLetters(randomResponse);
				await new Promise(resolve => setTimeout(resolve, 70 * numberOfLetters));
                await simulateBotTyping(50, randomResponse);
				await new Promise(resolve => setTimeout(resolve, 1000));

            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
		await new Promise(resolve => setTimeout(resolve, 1000));
        if (numberOfLetters != 0) {
            await new Promise(resolve => setTimeout(resolve, 70 * numberOfLetters));
        }
        isBotTyping = false;
    }
}
sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
        handleUserInput(); // Call the handleUserInput function
    }
});

function displayUserMessage(message, style = "") {
    const userMessage = `<div class="user-message" style="color: white;"><strong>Creature</strong>: <span style="${style}">${message}</span></div>`;
    chatBox.innerHTML += userMessage;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayBotMessage(message) {
    const botMessage =`<div class="bot-message">
    <img src="bot.png" alt="Robot" class="bot-avatar">
    <span class="bot-text">${message}</span>
</div>`;
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


async function simulateBotTyping(delayForWords, botResponse) {
    const typingElement = document.createElement("div");
    typingElement.classList.add("bot-message", "bot-typing");
    chatBox.appendChild(typingElement);
    let currentCharIndex = 0;

    const typingInterval = setInterval(() => {
        if (currentCharIndex <= botResponse.length) {
            typingElement.innerHTML = `<span class="typing-color">${botResponse.substring(0, currentCharIndex)}</span>`;
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

async function checkJsonQuestions(question, jsonCategories) {
    try {
	    let bestMatch = { occurrences: 0, answer: null };
        for (const category of jsonCategories) {
            const response = await fetch("./" + category + ".json");
            const jsonArray = await response.json();
            for (const jsonField of jsonArray) {
                const occurrences = checkQuestionMatch(question, jsonField["question"]);
                if (occurrences > bestMatch.occurrences) {
                    bestMatch.occurrences = occurrences;
                    bestMatch.answer = jsonField["answer"];
                } else if (jsonField["question"].toLowerCase().includes(question)) {
                    // Handle the case where the question contains the specified keyword
                    simulateBotTyping(50, jsonField["answer"]);
                    let numberOfLetters = countLetters(jsonField["answer"]);
                    const result = [numberOfLetters, true];
                    result.intValue = result[0];
                    result.boolValue = result[1];
                    return result; // Match found => return true immediately + letter count
                }
            }
			response.close;
        }
		if (bestMatch.answer !== null) {
            simulateBotTyping(50, bestMatch.answer);
            let numberOfLetters = countLetters(bestMatch.answer);
            const result = [numberOfLetters, true];
            result.intValue = result[0];
            result.boolValue = result[1];
            return result; // Match found => return true immediately + letter count
        }
    } catch (error) {
        console.error("Error loading or parsing JSON:", error);
        return false; // Return false in case of error
    }
    return false; // No matches found in questions
}


async function checkJsonKeywords(question, keywordsCategories) {
    try {
		for (const keyword of keywordsCategories) {
			const response = await fetch("./" + keyword + ".json");
			const jsonArray = await response.json();
			for (const jsonField of jsonArray) {
				const keywordRegex = new RegExp(`\\b${jsonField["keyword"]}\\b`, 'i');
				if (keywordRegex.test(question)) {
					simulateBotTyping(50, jsonField["answer"]);
					let numberOfLetters = countLetters(jsonField["answer"]);
					const result = [numberOfLetters, true];
					result.intValue = result[0];
					result.boolValue = result[1];
					return result; // Match found => return true immediately + letter count
				}
			}
		}
    } catch (error) {
        console.error("Error loading or parsing JSON:", error);
        return false; // Return false in case of error
    }
    return false; // No matches found in keywords
}

// test - need to find the answer in json

function askBot(question) {
    userInput.value = question;
    handleUserInput();
}

// Helper function to check occurrences of words
function checkQuestionMatch(userQuestion, jsonQuestion) {
    const userWords = userQuestion.toLowerCase().split(" ");
    const jsonWords = jsonQuestion.toLowerCase().split(" ");

    let occurrences = 0;

    userWords.forEach(userWord => {
        if (jsonWords.includes(userWord)) {
            occurrences++;
        }
    });

    return occurrences;
}

// Helper function to count letters
function countLetters(sentence) {
	let numberOfLetters = 0;
	for (const letter in sentence) {
		numberOfLetters++;
	}
	return numberOfLetters;
}