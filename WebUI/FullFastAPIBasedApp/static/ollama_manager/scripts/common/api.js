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
    }
};
