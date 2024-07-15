window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.api = {
    listModels: async function (url, success_callback, error_callback) {
            let msg = {
                ollama_host: url
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
            // async function() {
            //     return new Promise((resolve) => {
            //         setTimeout(() => {
            //             resolve(['GPT-4', 'BERT', 'CodeLlama', 'Stable Diffusion', 'Whisper', 'LLaMA', 'DALL-E', 'T5', 'RoBERTa']);
            //         }, 500);
            //     });
            // }       
                        
    },

    pullModel: async function(name) {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: `Model ${name} pulled successfully` });
            }, 1500);
        });
    },

    deleteModel: async function(name) {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: `Model ${name} deleted successfully` });
            }, 1000);
        });
    },

    generateCompletion: async function(url, model, prompt, stream = false, success_callback, error_callback) {
        // Simulated API call
        if (stream) {
            // return new ReadableStream({
            //     start(controller) {
            //         const responses = prompt.split(' ').map(word => word + ' ');
            //         let i = 0;
            //         const interval = setInterval(() => {
            //             if (i < responses.length) {
            //                 controller.enqueue(responses[i]);
            //                 i++;
            //             } else {
            //                 clearInterval(interval);
            //                 controller.close();
            //             }
            //         }, 100);
            //     }
            // });
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
            // return new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve({ success: true, completion: `Completion for "${prompt}" using ${model}` });
            //     }, 1000);
            // });
        }
    },

    createModel: async function(name, config) {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: `Model ${name} created successfully` });
            }, 1500);
        });
    },

    updateModel: async function(name, config) {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: `Model ${name} updated successfully` });
            }, 1000);
        });
    },

    getModelcategories: async function(){
        var modelcategories=[
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
            "internlm2"
        ];
        return modelcategories;
    },

    getCategoryModels: async function(category){

        return ['qwen2-1.5b'];
    }
};
