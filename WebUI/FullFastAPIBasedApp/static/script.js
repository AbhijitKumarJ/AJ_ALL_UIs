document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const inferenceSource = document.getElementById('inference-source');
    const modelSelection = document.getElementById('model-selection');
    const openAIKey = document.getElementById('openai-key');
    const groqKey = document.getElementById('groq-key');
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');
    const maxTokensSlider = document.getElementById('max-tokens');
    const maxTokensValue = document.getElementById('max-tokens-value');
    const topPSlider = document.getElementById('top-p');
    const topPValue = document.getElementById('top-p-value');

    // Enchanted responses
    const enchantedResponses = [
        "The mystical algorithms have deciphered your query...",
        "Channeling the wisdom of silicon sages...",
        "Consulting the digital oracle for enlightenment...",
        "Unraveling the cosmic code to address your inquiry...",
        "Summoning the spirits of artificial intelligence...",
    ];

    // Add message to chat
    function addMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        
        // Add a magical sparkling effect to bot messages
        if (!isUser) {
            messageElement.style.animation = 'sparkle 1s ease-in-out';
        }

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simulate typing effect for bot messages
    function typeMessage(message, element, index = 0) {
        if (index < message.length) {
            element.textContent += message[index];
            setTimeout(() => typeMessage(message, element, index + 1), 25);
        }
    }

    // Handle user input
    function handleUserInput() {
        const message = userInput.value.trim();
        if (message) {
            getChatResponseFromAPI(message);            
        }
    }

    function getChatResponseFromAPI(message){
        var request = $.ajax({
            url: "/api/chat/get_response",
            method: "POST",
            data: { item:{
                provider:$( "#inference-source" ).val(),
                model: $( "#model-selection" ).val(),
                message: message
            }},
            contentType:"application/json",
            dataType: "json",
            success: function(data){
                console.log(data);
                addMessage(data.data.message, true);
                userInput.value = '';
                simulateBotResponse(data.data.message);
            }
          });           
          request.fail(function( jqXHR, textStatus ) {
            alert( "Request failed: " + textStatus );
          });
    }

    // Simulate bot response
    function simulateBotResponse(userMessage) {
        const loadingMessage = enchantedResponses[Math.floor(Math.random() * enchantedResponses.length)];
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('message', 'bot-message', 'loading');
        chatMessages.appendChild(loadingElement);

        typeMessage(loadingMessage, loadingElement);

        setTimeout(() => {
            chatMessages.removeChild(loadingElement);
            const botMessage = `Greetings, seeker of knowledge! I have pondered your message: "${userMessage}". What arcane insights may I offer in return?`;
            const botElement = document.createElement('div');
            botElement.classList.add('message', 'bot-message');
            chatMessages.appendChild(botElement);
            typeMessage(botMessage, botElement);
        }, 2000);
    }

    // Event listeners
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Update slider values with magical transitions
    function updateSliderValue(slider, valueElement) {
        slider.addEventListener('input', () => {
            valueElement.textContent = slider.value;
            valueElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                valueElement.style.transform = 'scale(1)';
            }, 200);
        });
    }

    updateSliderValue(temperatureSlider, temperatureValue);
    updateSliderValue(maxTokensSlider, maxTokensValue);
    updateSliderValue(topPSlider, topPValue);

    // Magical background effect
    function createMagicalBackground() {
        const magicalBg = document.createElement('div');
        magicalBg.className = 'magical-background';
        document.body.appendChild(magicalBg);

        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            magicalBg.appendChild(star);
        }
    }

    createMagicalBackground();

    // Enchanted input field effect
    userInput.addEventListener('focus', () => {
        userInput.style.boxShadow = '0 0 10px var(--secondary-color)';
    });

    userInput.addEventListener('blur', () => {
        userInput.style.boxShadow = '';
    });

    // Model and source selection effect
    function addSelectionEffect(selectElement) {
        selectElement.addEventListener('change', () => {
            selectElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                selectElement.style.transform = 'scale(1)';
            }, 200);
        });
    }

    addSelectionEffect(inferenceSource);
    addSelectionEffect(modelSelection);

    // API Key security effect
    function addSecurityEffect(inputElement) {
        inputElement.addEventListener('input', () => {
            if (inputElement.value.length > 0) {
                inputElement.style.border = '2px solid var(--secondary-color)';
            } else {
                inputElement.style.border = '';
            }
        });
    }

    addSecurityEffect(openAIKey);
    addSecurityEffect(groqKey);

    // Easter egg: Konami code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.animation = 'rainbow-bg 5s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});
