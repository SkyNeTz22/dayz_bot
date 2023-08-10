const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const randomResponses = [
    "I'm here to assist you. If I fail to do so, please use the \"REPORT\" button so the issue can be fixed!",
    "That's an interesting question for which I do not have an answer yet. Please submit any questions you didn't have an answer for so that we can fix it using the \"REPORT\" button!",
    "I'm still learning, but I'll do my best to help. If I am not providing the correct answer for your question, please report it using the \"REPORT\" button!",
];
const greetings = [
    "Greetings, survivor!",
    "Hello there, adventurer!",
    "Welcome, traveler! How can I assist you today?",
    "Hey, survivor! Ready to dive into some DayZ knowledge?",
    "Greetings! What DayZ questions do you have?",
];
const inappropriateKeywords = ["porn", "sex", "racism", "politics", "jew", "nigger", "idiot", "morron", "retard", "cp", "shut up", "stfu", "fuck off", "bite me", "suck my dick", "dick", "pussy", "nigga", "nigg", "N word", "dickhead", "motherfucker", "dick head", "mother fucker", "asshole", "bastard", "moron", "idiot"];
let isBotTyping = false;

// Function to get random greeting from the array
function getRandomGreeting() {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

// Get to get random response from the array
function getRandomResponse() {
    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    return randomResponses[randomIndex];
}

window.onload = function () {
	simulateBotTyping(50, getRandomGreeting());
	new Promise(resolve => setTimeout(resolve, 1000));
}

// Function for menu questions
function askBot(question) {
    userInput.value = question;
    handleUserInput();
}

// Main function to handle user input
async function handleUserInput() {
    if (isBotTyping) {
        return;
    }
    const userMessage = userInput.value.trim().toLowerCase();
    // Check for inappropriate keywords
    const containsInappropriateKeyword = inappropriateKeywords.some(keyword => userMessage.toLowerCase().includes(keyword.toLowerCase()));
    if (containsInappropriateKeyword) {
        // Delete the inappropriate message and display a placeholder message
        displayUserMessage("Message deleted", "color: red; font-weight: bold;" );
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
    const jsonKeywords = ["keywords_ar", "keywords_sickness"];
    const question = userInput.value.trim();
	// Look for answers based on question
    if (question !== "") {
        displayUserMessage(question);
        userInput.value = "";
        let numberOfLetters = 0;
        try {
			// First check questions
			let checkQuestions = await checkJsonQuestions(question, jsonCategories);
            let checkQuestionsWordsOccurences = false;
            let checkKeywords = false;
			if (checkQuestions.boolValue) {
				numberOfLetters = checkQuestions.intValue;
			} else {
				checkQuestionsWordsOccurences = await checkJsonQuestionsWordsOccurences(question, jsonCategories);
				if (checkQuestionsWordsOccurences.boolValue) {
					numberOfLetters = checkQuestionsWordsOccurences.intValue;
				} else {
					// if questions aren't found, look for keywords
					checkKeywords = await checkJsonKeywords(question, jsonKeywords);
					if (checkKeywords.boolValue) {
						numberOfLetters = checkKeywords.intValue;
					}
				}
            }
            if (!checkQuestions.boolValue && !checkQuestionsWordsOccurences.boolValue && !checkKeywords.boolValue) {
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
sendBtn.addEventListener("click", handleUserInput);				// sendBtn click
userInput.addEventListener("keydown", function(event) {			// userInput enter key
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
        handleUserInput(); // Call the handleUserInput function
    }
});

// Function to display user input after enter/click
function displayUserMessage(message, style = "") {
    const userMessage = `<div class="user-message" style="color: white;"><strong>Creature</strong>: <span style="${style}">${message}</span></div>`;
    chatBox.innerHTML += userMessage;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to display output
function displayBotMessage(message) {
    const botMessage =`<div class="bot-message">
    <img src="bot.png" alt="Robot" class="bot-avatar">
    <span class="bot-text">${message}</span>
</div>`;
    chatBox.innerHTML += botMessage;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Functionality to simulate bot typing look-alike
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

// Helper function to match the question directly to avoid multiple operations
async function checkJsonQuestions(question, jsonCategories) {
    try {
        for (const category of jsonCategories) {
            const response = await fetch(category + ".json");
            const jsonArray = await response.json();
            for (const jsonField of jsonArray) {
                if (question.toLowerCase() === jsonField["question"].toLowerCase()) {
                    simulateBotTyping(50, jsonField["answer"]);
					let numberOfLetters = countLetters(jsonField["answer"]);
					const result = [numberOfLetters, true];
					result.intValue = result[0];
					result.boolValue = result[1];
					return result; // Match found => return true immediately
                }
            }
        }
    } catch (error) {
        console.error("Error loading or parsing JSON:", error);
        return false; // Return false in case of error
    }
    return false; // No matches found in questions
}

// Helper function to go through all questions
async function checkJsonQuestionsWordsOccurences(question, jsonCategories) {
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
		console.log("Current question: " + question);
		if (bestMatch.answer === null) {
			console.log("Could not find answer in all questions.");
		}
		else {
			console.log("Final answer: " + bestMatch.answer);
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

// Helper function to go through all keywords
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

// Helper function to check occurrences of words
function checkQuestionMatch(userQuestion, jsonQuestion) {
	userQuestion = cleanStringsKeepSpaces(userQuestion);
	jsonQuestion = cleanStringsKeepSpaces(jsonQuestion);
    const userWords = userQuestion.toLowerCase().split(" ");
    const jsonWords = jsonQuestion.toLowerCase().split(" ");
    let occurrences = 0;
    userWords.forEach(userWord => {
        if (jsonWords.includes(userWord)) {
            occurrences++;
        }
    });
	if (occurrences > 0) {
		// console.log(`User words: ${userWords}`);
		// console.log(`JSON words: ${jsonWords}`);
		// console.log(`Occurrences: ${occurrences}`);
		return occurrences;
	}
	else {
		return -1;
	}
}

// Helper function to count letters
function countLetters(sentence) {
	let numberOfLetters = 0;
	for (const letter in sentence) {
		numberOfLetters++;
	}
	return numberOfLetters;
}

// Helper function to clean out strings;
function cleanStringsKeepSpaces(input) {
    // Use a regular expression to replace any characters that are not letters or spaces
    return input.replace(/[^a-zA-Z\s]/g, '');
}