window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.api = {
    listModels: async function (url, success_callback, error_callback) {
        let msg = {
            ollama_host: url,
        };
        $.ajax({
            url: "/ollama/list_models",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(msg),
            success: function (response) {
                console.log(response);
                success_callback(response);
                //simulateBotResponse(response.message);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + xhr.responseJSON.error);
                error_callback();
            },
        });
    },

    connectWebSocket: function (url, command, wsOutputHandler) {
        //var url='ws://localhost:8000/ws/terminal';
        const socket = new WebSocket(url);

        socket.onopen = function (e) {
            wsOutputHandler("Open", "Connected to server\n");
            socket.send(command);
        };

        socket.onmessage = function (event) {
            wsOutputHandler("Message", event.data);
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                wsOutputHandler(
                    "Close",
                    `Connection closed cleanly, code=${event.code} reason=${event.reason}\n`
                );
            } else {
                wsOutputHandler("Close", "Connection died\n");
            }
            setTimeout(
                () => connectWebSocket(url, command, wsOutputHandler),
                1000
            );
        };

        socket.onerror = function (error) {
            wsOutputHandler("Error", `Error: ${error.message}\n`);
        };

        return socket;
    },

    terminalCommand: function (command, wsOutputHandler) {
        var commandurl = "ws://localhost:8000/ws/terminal";
        commandsocket = window.AJ_GPT.api.connectWebSocket(
            commandurl,
            command,
            wsOutputHandler
        );
        return commandsocket;
    },

    interruptCommand: function (wsOutputHandler) {
        var commandurl = "ws://localhost:8000/ws/interrupt";
        commandsocket = window.AJ_GPT.api.connectWebSocket(
            commandurl,
            "interrupt",
            wsOutputHandler
        );
        return commandsocket;
    },

    deleteModel: async function (name, url, success_callback, error_callback) {
        let msg = {
            ollama_config: {
                ollama_host: url,
            },
            model: name,
        };
        $.ajax({
            url: "/ollama/delete_model",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(msg),
            success: function (response) {
                console.log(response);
                success_callback(response);
                //simulateBotResponse(response.message);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + xhr.responseJSON.error);
                error_callback();
            },
        });
    },

    generateCompletion: async function (
        url,
        model,
        prompt,
        stream = false,
        success_callback,
        error_callback
    ) {
        // Simulated API call
        if (stream) {
            let msg = {
                ollama_config: {
                    ollama_host: url,
                },
                model: model,
                prompt: prompt,
                stream: true,
            };
            $.ajax({
                url: "/ollama/generate",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(msg),
                success: function (response) {
                    console.log(response);
                    success_callback(response);
                    //simulateBotResponse(response.message);
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + xhr.responseJSON.error);
                    error_callback();
                },
            });
        } else {
            let msg = {
                ollama_config: {
                    ollama_host: url,
                },
                model: model,
                prompt: prompt,
                stream: false,
            };
            $.ajax({
                url: "/ollama/generate",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(msg),
                success: function (response) {
                    console.log(response);
                    success_callback(response);
                    //simulateBotResponse(response.message);
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + xhr.responseJSON.error);
                    error_callback();
                },
            });
        }
    },

    createModel: async function (
        name,
        modelfile,
        url,
        success_callback,
        error_callback
    ) {
        let msg = {
            ollama_config: {
                ollama_host: url,
            },
            name: name,
            modelfile: modelfile,
        };
        $.ajax({
            url: "/ollama/create_model",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(msg),
            success: function (response) {
                console.log(response);
                success_callback(response);
                //simulateBotResponse(response.message);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + xhr.responseJSON.error);
                error_callback();
            },
        });
    },

    updateModel: async function (name, config) {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: `Model ${name} updated successfully`,
                });
            }, 1000);
        });
    },

    getModelcategories: async function () {
        var modelcategories = [
            "gemma2",
            "llama3",
            "qwen2",
            "deepseek-coder-v2",
            "phi3",
            "aya",
            "mistral",
            "mixtral",
            "codegemma",
            "command-r",
            "command-r-plus",
            "llava",
            "gemma",
            "qwen",
            "llama2",
            "codellama",
            "dolphin-mixtral",
            "llama2-uncensored",
            "nomic-embed-text",
            "deepseek-coder",
            "phi",
            "dolphin-mistral",
            "orca-mini",
            "mistral-openorca",
            "dolphin-llama3",
            "mxbai-embed-large",
            "starcoder2",
            "zephyr",
            "llama2-chinese",
            "yi",
            "llava-llama3",
            "nous-hermes2",
            "vicuna",
            "wizard-vicuna-uncensored",
            "tinyllama",
            "starcoder",
            "codestral",
            "wizardlm2",
            "openchat",
            "tinydolphin",
            "openhermes",
            "wizardcoder",
            "stable-code",
            "codeqwen",
            "neural-chat",
            "wizard-math",
            "stablelm2",
            "all-minilm",
            "phind-codellama",
            "dolphincoder",
            "granite-code",
            "nous-hermes",
            "sqlcoder",
            "starling-lm",
            "llama3-gradient",
            "falcon",
            "deepseek-llm",
            "yarn-llama2",
            "llama3-chatqa",
            "orca2",
            "xwinlm",
            "solar",
            "wizardlm",
            "samantha-mistral",
            "dolphin-phi",
            "stable-beluga",
            "bakllava",
            "wizardlm-uncensored",
            "medllama2",
            "snowflake-arctic-embed",
            "yarn-mistral",
            "moondream",
            "nous-hermes2-mixtral",
            "llama-pro",
            "meditron",
            "codeup",
            "deepseek-v2",
            "nexusraven",
            "everythinglm",
            "magicoder",
            "llava-phi3",
            "stablelm-zephyr",
            "codebooga",
            "mistrallite",
            "wizard-vicuna",
            "duckdb-nsql",
            "megadolphin",
            "goliath",
            "notux",
            "open-orca-platypus2",
            "falcon2",
            "notus",
            "dbrx",
            "glm4",
            "alfred",
            "codegeex4",
            "internlm2",
        ];

        var modelcatDesc = [
            "Google Gemma 2 is now available in 2 sizes, 9B and 27B.",
            "Meta Llama 3: The most capable openly available LLM to date",
            "Qwen2 is a new series of large language models from Alibaba group",
            "An open-source Mixture-of-Experts code language model that achieves performance comparable to GPT4-Turbo in code-specific tasks.",
            "Phi-3 is a family of lightweight 3B (Mini) and 14B (Medium) state-of-the-art open models by Microsoft.",
            "Aya 23, released by Cohere, is a new family of state-of-the-art, multilingual models that support 23 languages. ",
            "The 7B model released by Mistral AI, updated to version 0.3.",
            "A set of Mixture of Experts (MoE) model with open weights by Mistral AI in 8x7b and 8x22b parameter sizes.",
            "CodeGemma is a collection of powerful, lightweight models that can perform a variety of coding tasks like fill-in-the-middle code completion, code generation, natural language understanding, mathematical reasoning, and instruction following.",
            "Command R is a Large Language Model optimized for conversational interaction and long context tasks.",
            "Command R+ is a powerful, scalable large language model purpose-built to excel at real-world enterprise use cases.",
            "🌋 LLaVA is a novel end-to-end trained large multimodal model that combines a vision encoder and Vicuna for general-purpose visual and language understanding. Updated to version 1.6.",
            "Gemma is a family of lightweight, state-of-the-art open models built by Google DeepMind. Updated to version 1.1",
            "Qwen 1.5 is a series of large language models by Alibaba Cloud spanning from 0.5B to 110B parameters",
            "Llama 2 is a collection of foundation language models ranging from 7B to 70B parameters.",
            "A large language model that can use text prompts to generate and discuss code.",
            "Uncensored, 8x7b and 8x22b fine-tuned models based on the Mixtral mixture of experts models that excels at coding tasks. Created by Eric Hartford.",
            "Uncensored Llama 2 model by George Sung and Jarrad Hope.",
            "A high-performing open embedding model with a large token context window.",
            "DeepSeek Coder is a capable coding model trained on two trillion code and natural language tokens.",
            "Phi-2: a 2.7B language model by Microsoft Research that demonstrates outstanding reasoning and language understanding capabilities.",
            "The uncensored Dolphin model based on Mistral that excels at coding tasks. Updated to version 2.8.",
            "A general-purpose model ranging from 3 billion parameters to 70 billion, suitable for entry-level hardware.",
            "Mistral OpenOrca is a 7 billion parameter model, fine-tuned on top of the Mistral 7B model using the OpenOrca dataset.",
            "Dolphin 2.9 is a new model with 8B and 70B sizes by Eric Hartford based on Llama 3 that has a variety of instruction, conversational, and coding skills.",
            "State-of-the-art large embedding model from mixedbread.ai",
            "StarCoder2 is the next generation of transparently trained open code LLMs that comes in three sizes: 3B, 7B and 15B parameters. ",
            "Zephyr is a series of fine-tuned versions of the Mistral and Mixtral models that are trained to act as helpful assistants.",
            "Llama 2 based model fine tuned to improve Chinese dialogue ability.",
            "Yi 1.5 is a high-performing, bilingual language model.",
            "A LLaVA model fine-tuned from Llama 3 Instruct with better scores in several benchmarks.",
            "The powerful family of models by Nous Research that excels at scientific discussion and coding tasks.",
            "General use chat model based on Llama and Llama 2 with 2K to 16K context sizes.",
            "Wizard Vicuna Uncensored is a 7B, 13B, and 30B parameter model based on Llama 2 uncensored by Eric Hartford.",
            "The TinyLlama project is an open endeavor to train a compact 1.1B Llama model on 3 trillion tokens.",
            "StarCoder is a code generation model trained on 80+ programming languages.",
            "Codestral is Mistral AI’s first-ever code model designed for code generation tasks.",
            "State of the art large language model from Microsoft AI with improved performance on complex chat, multilingual, reasoning and agent use cases.",
            "A family of open-source models trained on a wide variety of data, surpassing ChatGPT on various benchmarks. Updated to version 3.5-0106.",
            "An experimental 1.1B parameter model trained on the new Dolphin 2.8 dataset by Eric Hartford and based on TinyLlama.",
            "OpenHermes 2.5 is a 7B model fine-tuned by Teknium on Mistral with fully open datasets.",
            "State-of-the-art code generation model",
            "Stable Code 3B is a coding model with instruct and code completion variants on par with models such as Code Llama 7B that are 2.5x larger.",
            "CodeQwen1.5 is a large language model pretrained on a large amount of code data.",
            "A fine-tuned model based on Mistral with good coverage of domain and language.",
            "Model focused on math and logic problems",
            "Stable LM 2 is a state-of-the-art 1.6B and 12B parameter language model trained on multilingual data in English, Spanish, German, Italian, French, Portuguese, and Dutch.",
            "Embedding models on very large sentence level datasets.",
            "Code generation model based on Code Llama.",
            "A 7B and 15B uncensored variant of the Dolphin model family that excels at coding, based on StarCoder2.",
            "A family of open foundation models by IBM for Code Intelligence",
            "General use models based on Llama and Llama 2 from Nous Research.",
            "SQLCoder is a code completion model fined-tuned on StarCoder for SQL generation tasks",
            "Starling is a large language model trained by reinforcement learning from AI feedback focused on improving chatbot helpfulness.",
            "This model extends LLama-3 8B's context length from 8k to over 1m tokens.",
            "An advanced language model crafted with 2 trillion bilingual tokens.",
            "An extension of Llama 2 that supports a context of up to 128k tokens.",
            "A large language model built by the Technology Innovation Institute (TII) for use in summarization, text generation, and chat bots.",
            "A model from NVIDIA based on Llama 3 that excels at conversational question answering (QA) and retrieval-augmented generation (RAG).",
            "Conversational model based on Llama 2 that performs competitively on various benchmarks.",
            "Orca 2 is built by Microsoft research, and are a fine-tuned version of Meta's Llama 2 models.  The model is designed to excel particularly in reasoning.",
            "A compact, yet powerful 10.7B large language model designed for single-turn conversation.",
            "General use model based on Llama 2.",
            "A companion assistant trained in philosophy, psychology, and personal relationships. Based on Mistral.",
            "2.7B uncensored Dolphin model by Eric Hartford, based on the Phi language model by Microsoft Research.",
            "Llama 2 based model fine tuned on an Orca-style dataset. Originally called Free Willy.",
            "BakLLaVA is a multimodal model consisting of the Mistral 7B base model augmented with the LLaVA  architecture.",
            "Uncensored version of Wizard LM model ",
            "Fine-tuned Llama 2 model to answer medical questions based on an open source medical dataset. ",
            "A suite of text embedding models by Snowflake, optimized for performance.",
            "moondream2 is a small vision language model designed to run efficiently on edge devices.",
            "An extension of Mistral to support context windows of 64K or 128K.",
            "The Nous Hermes 2 model from Nous Research, now trained over Mixtral.",
            "An expansion of Llama 2 that specializes in integrating both general language understanding and domain-specific knowledge, particularly in programming and mathematics.",
            "Open-source medical large language model adapted from Llama 2 to the medical domain.",
            "A strong, economical, and efficient Mixture-of-Experts language model.",
            "Great code generation model based on Llama2.",
            "Nexus Raven is a 13B instruction tuned model for function calling tasks. ",
            "Uncensored Llama2 based model with support for a 16K context window.",
            "A new small LLaVA model fine-tuned from Phi 3 Mini.",
            "🎩 Magicoder is a family of 7B parameter models trained on 75K synthetic instruction data using OSS-Instruct, a novel approach to enlightening LLMs with open-source code snippets.",
            "A lightweight chat model allowing accurate, and responsive output without requiring high-end hardware.",
            "A high-performing code instruct model created by merging two existing code models.",
            "MistralLite is a fine-tuned model based on Mistral with enhanced capabilities of processing long contexts.",
            "Wizard Vicuna is a 13B parameter model based on Llama 2 trained by MelodysDreamj.",
            "7B parameter text-to-SQL model made by MotherDuck and Numbers Station.",
            "MegaDolphin-2.2-120b is a transformation of Dolphin-2.2-70b created by interleaving the model with itself.",
            "A language model created by combining two fine-tuned Llama 2 70B models into one.",
            "A top-performing mixture of experts model, fine-tuned with high-quality data.",
            "Merge of the Open Orca OpenChat model and the Garage-bAInd Platypus 2 model. Designed for chat and code generation.",
            "Falcon2 is an 11B parameters causal decoder-only model built by TII and trained over 5T tokens.",
            "A 7B chat model fine-tuned with high-quality data and based on Zephyr.",
            "DBRX is an open, general-purpose LLM created by Databricks.",
            "A strong multi-lingual general language model with competitive performance to Llama 3.",
            "A robust conversational model designed to be used for both chat and instruct use cases.",
            "A versatile model for AI software development scenarios, including code completion.",
            "InternLM2.5 is a 7B parameter model tailored for practical scenarios with outstanding reasoning capability.",
        ];
        return { names: modelcategories, descriptions: modelcatDesc };
    },

    getCategoryModels: async function (category) {
        return ["qwen2-1.5b"];
    },
};
