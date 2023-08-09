const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// i added this two rows below


let isBotTyping = false;
async function handleUserInput() {
    if (isBotTyping) {
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
            await simulateBotTyping(50, " is writing...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            let checkQuestions = await checkJsonQuestions(question, jsonCategories);
			let checkKeywords = false;
			if(checkQuestions.boolValue) {
				numberOfLetters = checkQuestions.intValue;
			} else if (!checkQuestions.boolValue) {
				checkKeywords = await checkJsonKeywords(question, jsonKeywords);
				if (checkKeywords.boolValue) {
					numberOfLetters = checkKeywords.intValue;
				}
			}
            if (!checkQuestions.boolValue && !checkKeywords.boolValue) {
                await simulateBotTyping(50, " is thinking...");
                
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
		await new Promise(resolve => setTimeout(resolve, 1000));
		if (numberOfLetters != 0) {
			await new Promise(resolve => setTimeout(resolve, 50 * numberOfLetters));
		}
        isBotTyping = false;
    }
}
sendBtn.addEventListener("click", handleUserInput);

function displayUserMessage(message) {
    const userMessage = `<div class="user-message" style="color: white;"><strong>Creature</strong>: ${message}</div>`;
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
        for (const category of jsonCategories) {
            const response = await fetch(category + ".json");
            const jsonArray = await response.json();
			console.log(category);
            for (const jsonField of jsonArray) {
				console.log(jsonField["question"]);
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


async function checkJsonKeywords(question, keywordsCategories) {
    try {
		for (const keyword of keywordsCategories) {
			const response = await fetch(keyword + ".json");
			const jsonArray = await response.json();
			for (const jsonField of jsonArray) {
				const keywordRegex = new RegExp(`\\b${jsonField["keyword"]}\\b`, 'i');
				if (keywordRegex.test(question)) {
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
    return false; // No matches found in keywords
}

function countLetters(sentence) {
	let numberOfLetters = 0;
	for (const letter in sentence) {
		numberOfLetters++;
	}
	return numberOfLetters;
}



// test - need to find the answer in json

function askBot(question) {
    userInput.value = question;
    handleUserInput();
}