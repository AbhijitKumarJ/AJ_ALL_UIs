document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const inferenceSource = document.getElementById("inference-source");
    const modelSelection = document.getElementById("model-selection");
    const temperatureSlider = document.getElementById("temperature");
    const temperatureValue = document.getElementById("temperature-value");
    const maxTokensSlider = document.getElementById("max-tokens");
    const maxTokensValue = document.getElementById("max-tokens-value");
    const topPSlider = document.getElementById("top-p");
    const topPValue = document.getElementById("top-p-value");

    // Add message to chat
    function addMessage(message, isUser) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", isUser ? "user-message" : "bot-message");
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle user input
    function handleUserInput() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            getChatResponseFromAPI(message);
            userInput.value = "";
        }
    }

    function getChatResponseFromAPI(message) {
        let chatMessage = {
            prompt: message,
            provider: inferenceSource.value,
            model: modelSelection.value
        };
        $.ajax({
            url: "/chat/get_bot_response",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(chatMessage),
            success: function (response) {
                console.log(response);
                addMessage(response.data, false);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + xhr.responseJSON.error);
                addMessage("There seems to be an issue with the bot. Please try again.", false);
            },
        });
    }

    // Event listeners
    sendButton.addEventListener("click", handleUserInput);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleUserInput();
        }
    });

    // Update slider values
    function updateSliderValue(slider, valueElement) {
        slider.addEventListener("input", () => {
            valueElement.textContent = slider.value;
        });
    }

    updateSliderValue(temperatureSlider, temperatureValue);
    updateSliderValue(maxTokensSlider, maxTokensValue);
    updateSliderValue(topPSlider, topPValue);
});