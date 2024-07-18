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
            .getElementById("createModelBtn")
            .addEventListener("click", window.AJ_GPT.models.showCreateModel);

        document
            .getElementById("btnPullModelSubmit")
            .addEventListener("click", window.AJ_GPT.models.handlePullModel);      
        document
            .getElementById("btnCreateModelSubmit")
            .addEventListener("click", window.AJ_GPT.models.handleCreateModel);         
        document
            .getElementById("btnStopPullModelSubmit")
            .addEventListener("click", window.AJ_GPT.models.handleStopPullModel);   
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

    showCreateModel: async function () {
        new bootstrap.Modal(document.getElementById("createModelModal")).show();
        $("#txtCreateModelName").val('newllama');
        $('#txtCreateModelConfig').val('FROM llama3\nSYSTEM You are mario from Super Mario Bros.');
    },

    handleCreateModel: async function () {
        var modelName = document
            .getElementById("txtCreateModelName")
            .value.trim();

        var modelConfig = document
            .getElementById("txtCreateModelConfig")
            .value.trim();
        if (modelName && modelConfig) {
            try {
                var result = await window.AJ_GPT.api.createModel(
                    modelName,
                    modelConfig,
                    "",
                    function (response) {
                        window.AJ_GPT.ui.showToast(response.status, "success");
                        window.AJ_GPT.models.loadModels();
                    },
                    function (xhr, status, error) {
                        console.error("Error creating model:", error);
                        window.AJ_GPT.ui.showToast("Error creating model", "error");
                    }
                );
            } catch (error) {
                console.error("Error creating model:", error);
                window.AJ_GPT.ui.showToast("Error creating model", "error");
            }
        }
    },

    showPullModal: async function () {
        new bootstrap.Modal(document.getElementById("ollamaPullModal")).show();
        $("#pullLogs").text('');
        $('#txtPullModelName').val('');
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

    fullResponse: "",

    handleStopPullModel: async function(){
        try {
            var result = await window.AJ_GPT.api.interruptCommand(
                function (eventType, eventData) {
                    fullResponse += eventData + "\n";
                    $("#pullLogs").text(fullResponse);
                    if (eventType == "Close") {
                        alert('done');
                    }
                }
            );
        } catch (error) {
            console.error("Error pulling model:", error);
            window.AJ_GPT.ui.showToast("Error pulling model", "error");
        }
    },

    handlePullModel: async function () {
        var modelName = document
            .getElementById("txtPullModelName")
            .value.trim();
        if (modelName) {
            try {
                fullResponse = "";
                var result = await window.AJ_GPT.api.terminalCommand(
                    "ollama pull " + modelName,
                    function (eventType, eventData) {
                        fullResponse += eventData + "\n";
                        $("#pullLogs").text(fullResponse);
                        if (eventType == "Close") {
                            alert('done')
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
                var result = await window.AJ_GPT.api.deleteModel(
                    model, 
                    "",
                    function(response) {
                        window.AJ_GPT.ui.showToast(response.status, "success");
                        window.AJ_GPT.models.loadModels();
                    },
                    function (xhr, status, error) {
                        console.error("Error deleting model:", error);
                        window.AJ_GPT.ui.showToast("Error deleting model", "error");
                    }
                );
                
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
