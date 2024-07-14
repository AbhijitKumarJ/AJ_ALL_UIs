window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.models = {
    currentModel: null,

    initialize: function() {
        this.loadModels();
        this.setupEventListeners();
        this.displayUserInfo();
        window.AJ_GPT.ui.updateNavigation();
    },

    loadModels: async function() {
        try {
            const models = await window.AJ_GPT.api.listModels();
            this.displayModels(models);
        } catch (error) {
            console.error('Error loading models:', error);
            window.AJ_GPT.ui.showToast('Error loading models', 'error');
        }
    },

    displayModels: function(models) {
        const modelsContainer = document.getElementById('modelsList');
        modelsContainer.innerHTML = models.map(model => `
            <div class="col">
                <div class="card model-card h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-light">${model}</h5>
                        <p class="card-text flex-grow-1">A powerful language model for various tasks.</p>
                        <div class="model-actions mt-auto">
                            <button class="btn btn-primary btn-sm chat-btn" data-model="${model}" title="Chat">
                                <i class="fas fa-comment"></i>
                            </button>
                            <button class="btn btn-secondary btn-sm edit-btn" data-model="${model}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-btn" data-model="${model}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    setupEventListeners: function() {
        document.getElementById('pullModelBtn').addEventListener('click', this.handlePullModel.bind(this));
        document.getElementById('modelsList').addEventListener('click', this.handleModelAction.bind(this));
        document.getElementById('sendMessage').addEventListener('click', this.sendMessage.bind(this));
        document.getElementById('saveModelChanges').addEventListener('click', this.saveModelChanges.bind(this));
    },

    handlePullModel: async function() {
        const modelName = prompt('Enter the name of the model to pull:');
        if (modelName) {
            try {
                const result = await window.AJ_GPT.api.pullModel(modelName);
                window.AJ_GPT.ui.showToast(result.message, 'success');
                this.loadModels();
            } catch (error) {
                console.error('Error pulling model:', error);
                window.AJ_GPT.ui.showToast('Error pulling model', 'error');
            }
        }
    },

    handleModelAction: function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const model = target.dataset.model;
        if (target.classList.contains('chat-btn')) {
            this.openChatModal(model);
        } else if (target.classList.contains('edit-btn')) {
            this.openEditModal(model);
        } else if (target.classList.contains('delete-btn')) {
            this.deleteModel(model);
        }
    },

    openChatModal: function(model) {
        this.currentModel = model;
        document.getElementById('chatModalLabel').textContent = `Chat with ${model}`;
        document.getElementById('chatMessages').innerHTML = '';
        new bootstrap.Modal(document.getElementById('chatModal')).show();
    },

    sendMessage: async function() {
        const userMessage = document.getElementById('userMessage').value.trim();
        if (!userMessage) return;

        this.appendMessage('user', userMessage);
        document.getElementById('userMessage').value = '';

        try {
            const response = await window.AJ_GPT.api.generateCompletion(this.currentModel, userMessage);
            this.appendMessage('model', response.completion);
        } catch (error) {
            console.error('Error generating completion:', error);
            window.AJ_GPT.ui.showToast('Error generating response', 'error');
        }
    },

    appendMessage: function(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'model-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    openEditModal: function(model) {
        document.getElementById('modelName').value = model;
        document.getElementById('modelConfig').value = JSON.stringify({ model: model }, null, 2);
        new bootstrap.Modal(document.getElementById('editModelModal')).show();
    },

    saveModelChanges: async function() {
        const modelName = document.getElementById('modelName').value;
        const modelConfig = JSON.parse(document.getElementById('modelConfig').value);

        try {
            const result = await window.AJ_GPT.api.updateModel(modelName, modelConfig);
            window.AJ_GPT.ui.showToast(result.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('editModelModal')).hide();
            this.loadModels();
        } catch (error) {
            console.error('Error updating model:', error);
            window.AJ_GPT.ui.showToast('Error updating model', 'error');
        }
    },

    deleteModel: async function(model) {
        if (confirm(`Are you sure you want to delete the model "${model}"?`)) {
            try {
                const result = await window.AJ_GPT.api.deleteModel(model);
                window.AJ_GPT.ui.showToast(result.message, 'success');
                this.loadModels();
            } catch (error) {
                console.error('Error deleting model:', error);
                window.AJ_GPT.ui.showToast('Error deleting model', 'error');
            }
        }
    },

    displayUserInfo: function() {
        const currentSession = window.AJ_GPT.utils.getFromLocalStorage('currentSession');
        if (currentSession) {
            document.getElementById('userInfo').textContent = `Logged in as ${currentSession.username} (${currentSession.personaName})`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AJ_GPT.models.initialize();
});
