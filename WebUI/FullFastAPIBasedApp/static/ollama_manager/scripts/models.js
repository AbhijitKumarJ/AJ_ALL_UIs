window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.models = {
    currentModel: null,
    modelcategories: { names: [], descriptions: [] },
    categoryModels: [],

    initialize: function () {
        window.AJ_GPT.models.loadModels();
        window.AJ_GPT.models.setupEventListeners();
        window.AJ_GPT.models.displayUserInfo();
        window.AJ_GPT.ui.updateNavigation();
    },

    loadModels: async function () {
        try {
            var models = await window.AJ_GPT.api.listModels(
                "",
                function (response) {
                    window.AJ_GPT.models.displayModels(response.models);
                },
                function (xhr, status, error) {}
            );
        } catch (error) {
            console.error("Error loading models:", error);
            window.AJ_GPT.ui.showToast("Error loading models", "error");
        }
    },

    displayModels: function (models) {
        var modelsContainer = document.getElementById("modelsList");
        modelsContainer.innerHTML = models
            .map(
                (model) => `
            <div class="col">
                <div class="card model-card h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-light">${
                            model.name
                        } (${Math.round(model.size / (1024 * 1024))} MB)</h5>
                        <p class="card-text flex-grow-1">${JSON.stringify(
                            model.details
                        )}</p>
                        <div class="model-actions mt-auto">
                            <button class="btn btn-primary btn-sm chat-btn" data-model="${
                                model.name
                            }" title="Chat">
                                <i class="fas fa-comment"></i>
                            </button>
                            <button class="btn btn-secondary btn-sm edit-btn" data-model="${
                                model.name
                            }" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-btn" data-model="${
                                model.name
                            }" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
            )
            .join("");
    },

    // [
    //     {
    //         "name": "qwen2:1.5b",
    //         "model": "qwen2:1.5b",
    //         "modified_at": "2024-07-02T22:09:58.82476146+05:30",
    //         "size": 934964102,
    //         "digest": "f6daf2b25194025ae2d5288f2afd041997ce48116807a3b612c1a96b09bec03a",
    //         "details": {
    //             "parent_model": "",
    //             "format": "gguf",
    //             "family": "qwen2",
    //             "families": [
    //                 "qwen2"
    //             ],
    //             "parameter_size": "1.5B",
    //             "quantization_level": "Q4_0"
    //         }
    //     },
    //     {
    //         "name": "nomic-embed-text:latest",
    //         "model": "nomic-embed-text:latest",
    //         "modified_at": "2024-05-15T16:20:04.120512748+05:30",
    //         "size": 274302450,
    //         "digest": "0a109f422b47e3a30ba2b10eca18548e944e8a23073ee3f3e947efcf3c45e59f",
    //         "details": {
    //             "parent_model": "",
    //             "format": "gguf",
    //             "family": "nomic-bert",
    //             "families": [
    //                 "nomic-bert"
    //             ],
    //             "parameter_size": "137M",
    //             "quantization_level": "F16"
    //         }
    //     },
    //     {
    //         "name": "crewaitinyllama:latest",
    //         "model": "crewaitinyllama:latest",
    //         "modified_at": "2024-05-13T18:58:07.328013469+05:30",
    //         "size": 1170782017,
    //         "digest": "c6e31e7b2e89196d566005d4171af15302d858e1aa391bbb8b5b8689fd43e0f5",
    //         "details": {
    //             "parent_model": "",
    //             "format": "gguf",
    //             "family": "llama",
    //             "families": [
    //                 "llama"
    //             ],
    //             "parameter_size": "1.1B",
    //             "quantization_level": "Q8_0"
    //         }
    //     },
    //     {
    //         "name": "phi3mini4kinstructq4:latest",
    //         "model": "phi3mini4kinstructq4:latest",
    //         "modified_at": "2024-05-13T02:55:49.743953747+05:30",
    //         "size": 2318919465,
    //         "digest": "ca4020004285b291b94ab9ea84fb93ff6a4c121be57839ccba798091a4b305e1",
    //         "details": {
    //             "parent_model": "",
    //             "format": "gguf",
    //             "family": "llama",
    //             "families": [
    //                 "llama"
    //             ],
    //             "parameter_size": "3.8B",
    //             "quantization_level": "Q4_K_M"
    //         }
    //     }
    // ]

    setupEventListeners: function () {
        document
            .getElementById("ddlPullModelCategory")
            .addEventListener(
                "change",
                window.AJ_GPT.models.onModelCategoryChange
            );
        document
            .getElementById("pullModelBtn")
            .addEventListener("click", window.AJ_GPT.models.showPullModal);
        document
            .getElementById("btnPullModelSubmit")
            .addEventListener("click", window.AJ_GPT.models.handlePullModel);
        document
            .getElementById("modelsList")
            .addEventListener("click", window.AJ_GPT.models.handleModelAction);
        document
            .getElementById("sendMessage")
            .addEventListener("click", window.AJ_GPT.models.sendMessage);
        document
            .getElementById("saveModelChanges")
            .addEventListener("click", window.AJ_GPT.models.saveModelChanges);
    },

    onModelCategoryChange: function () {
        let modelcategories = window.AJ_GPT.models.modelcategories;
        var modelcategory = $("#ddlPullModelCategory").val();
        var modelDesc = "";
        for (let index = 0; index < modelcategories.names.length; index++) {
            if (modelcategories.names[index] == modelcategory) {
                modelDesc = modelcategories.descriptions[index];
                break;
            }
        }

        $("#lblPullModelCategoryDesc").html(modelDesc);
        $("#ancPullModelCategoryDesc").attr(
            "onclick",
            "window.open('https://ollama.com/library/" +
                $("#ddlPullModelCategory").val() +
                "')"
        );
    },

    showPullModal: async function () {
        new bootstrap.Modal(document.getElementById("ollamaPullModal")).show();
        if (window.AJ_GPT.models.modelcategories.names.length == 0)
            window.AJ_GPT.models.modelcategories =
                await window.AJ_GPT.api.getModelcategories();

        var catsddl = document.getElementById("ddlPullModelCategory");
        catsddl.innerHTML =
            `<option value="$">  ---Select---  </option>` +
            window.AJ_GPT.models.modelcategories.names
                .map((modelcategory) => {
                    return `<option value="${modelcategory}">${modelcategory}</option>`;
                })
                .join("");
    },

    handlePullModel: async function () {
        var modelName = document
            .getElementById("txtPullModelName")
            .value.trim();
        if (modelName) {
            try {
                let fullResponse = "";
                var result = await window.AJ_GPT.api.pullModel(
                    modelName,
                    function (response) {
                        fullResponse += response + "\n";
                        $("#pullLogs").text(fullResponse);
                        if (response == "Stream completed") {
                            //window.AJ_GPT.ui.showToast(result.message, "success");
                            window.AJ_GPT.models.loadModels();
                        }
                    }
                );
            } catch (error) {
                console.error("Error pulling model:", error);
                window.AJ_GPT.ui.showToast("Error pulling model", "error");
            }
        }
    },

    handleModelAction: function (event) {
        var target = event.target.closest("button");
        if (!target) return;

        var model = target.dataset.model;
        if (target.classList.contains("chat-btn")) {
            window.AJ_GPT.models.openChatModal(model);
        } else if (target.classList.contains("edit-btn")) {
            window.AJ_GPT.models.openEditModal(model);
        } else if (target.classList.contains("delete-btn")) {
            window.AJ_GPT.models.deleteModel(model);
        }
    },

    openChatModal: function (model) {
        window.AJ_GPT.models.currentModel = model;
        document.getElementById(
            "chatModalLabel"
        ).textContent = `Chat with ${model}`;
        document.getElementById("chatMessages").innerHTML = "";
        new bootstrap.Modal(document.getElementById("chatModal")).show();
    },

    sendMessage: async function () {
        var userMessage = document.getElementById("userMessage").value.trim();
        if (!userMessage) return;

        window.AJ_GPT.models.appendMessage("user", userMessage);
        document.getElementById("userMessage").value = "";

        try {
            var response = await window.AJ_GPT.api.generateCompletion(
                "",
                window.AJ_GPT.models.currentModel,
                userMessage,
                false,
                function (response) {
                    window.AJ_GPT.models.appendMessage("model", response);
                },
                function (xhr, status, error) {}
            );
        } catch (error) {
            console.error("Error generating completion:", error);
            window.AJ_GPT.ui.showToast("Error generating response", "error");
        }
    },

    appendMessage: function (sender, message) {
        var chatMessages = document.getElementById("chatMessages");
        var messageElement = document.createElement("div");
        messageElement.classList.add(
            "chat-message",
            sender === "user" ? "user-message" : "model-message"
        );
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    openEditModal: function (model) {
        document.getElementById("modelName").value = model;
        document.getElementById("modelConfig").value = JSON.stringify(
            { model: model },
            null,
            2
        );
        new bootstrap.Modal(document.getElementById("editModelModal")).show();
    },

    saveModelChanges: async function () {
        var modelName = document.getElementById("modelName").value;
        var modelConfig = JSON.parse(
            document.getElementById("modelConfig").value
        );

        try {
            var result = await window.AJ_GPT.api.updateModel(
                modelName,
                modelConfig
            );
            window.AJ_GPT.ui.showToast(result.message, "success");
            bootstrap.Modal.getInstance(
                document.getElementById("editModelModal")
            ).hide();
            window.AJ_GPT.models.loadModels();
        } catch (error) {
            console.error("Error updating model:", error);
            window.AJ_GPT.ui.showToast("Error updating model", "error");
        }
    },

    deleteModel: async function (model) {
        if (confirm(`Are you sure you want to delete the model "${model}"?`)) {
            try {
                var result = await window.AJ_GPT.api.deleteModel(model);
                window.AJ_GPT.ui.showToast(result.message, "success");
                window.AJ_GPT.models.loadModels();
            } catch (error) {
                console.error("Error deleting model:", error);
                window.AJ_GPT.ui.showToast("Error deleting model", "error");
            }
        }
    },

    displayUserInfo: function () {
        var currentSession =
            window.AJ_GPT.utils.getFromLocalStorage("currentSession");
        if (currentSession) {
            document.getElementById(
                "userInfo"
            ).textContent = `Logged in as ${currentSession.username} (${currentSession.personaName})`;
        }
    },
};

document.addEventListener("DOMContentLoaded", () => {
    window.AJ_GPT.models.initialize();
});
