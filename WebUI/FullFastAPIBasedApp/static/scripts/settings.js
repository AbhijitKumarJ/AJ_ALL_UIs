window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
window.AJ_GPT.AppSettings = JSON.parse(localStorage.getItem('app_settings'));

window.AJ_GPT.settingsUI = {
    // providers: {
    //     ollama: {
    //         models: ['llama2', 'mistral', 'vicuna'],
    //         settings: ['temperature', 'max_tokens', 'top_p', 'top_k']
    //     },
    //     groq: {
    //         models: ['mixtral-8x7b-32768', 'llama2-70b-4096'],
    //         settings: ['temperature', 'max_tokens', 'top_p']
    //     },
    //     openai: {
    //         models: ['gpt-3.5-turbo', 'gpt-4'],
    //         settings: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty']
    //     }
    // },

    initialize: function() {
        window.AJ_GPT.settingsUI.loadGlobalSettings();
        window.AJ_GPT.settingsUI.setupEventListeners();
    },

    loadGlobalSettings: function() {
        // const globalSettings = window.AJ_GPT.settingsUI.getFromLocalStorage('globalSettings') || {
        //     defaultProvider: 'ollama',
        //     globalHyperparameters: {},
        //     providerSettings: {}
        // };

        document.getElementById('defaultProvider').value = window.AJ_GPT.AppSettings.default_provider;
        
        window.AJ_GPT.settingsUI.renderGlobalHyperparameters(window.AJ_GPT.AppSettings.default_inference_hp_settings);
        window.AJ_GPT.settingsUI.renderProviderSettings(window.AJ_GPT.AppSettings.models);
    },

    renderGlobalHyperparameters: function(globalHyperparameters) {
        const container = document.getElementById('globalHyperparameters');
        container.innerHTML = '<h3>Global Default Hyperparameters</h3>';

        // const allSettings = new Set();
        // Object.values(window.AJ_GPT.AppSettings.models).forEach(provider => {
        //     provider.forEach(model => allSettings.add(model["inference_hp_settings"] || {}));
        // });
        for (const [setting, value] of Object.entries(globalHyperparameters)) {
            container.appendChild(window.AJ_GPT.settingsUI.createHyperparameterInput(setting, value, 'global'));
        }
    },

    renderProviderSettings: function(providerSettings) {
        const container = document.getElementById('providerSettings');
        container.innerHTML = '';

        window.AJ_GPT.AppSettings.providers.forEach(provider => {
            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.innerHTML = `
                <div class="card-header collapse-toggle" data-bs-toggle="collapse" data-bs-target="#${provider}Settings">
                    <h2 class="mb-0">${provider.charAt(0).toUpperCase() + provider.slice(1)} Settings</h2>
                </div>
                <div id="${provider}Settings" class="collapse">
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="${provider}DefaultModel" class="form-label">Default Model</label>
                            <select class="form-select" id="${provider}DefaultModel" name="${provider}DefaultModel">
                                ${window.AJ_GPT.AppSettings.models[provider].map(model => 
                                    `<option value="${model.name}">${model.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div id="${provider}Models"></div>
                    </div>
                </div>
            `;
            container.appendChild(card);

            const defaultModel = window.AJ_GPT.AppSettings["default_" + provider.toLowerCase() + "_model"];
            document.getElementById(`${provider}DefaultModel`).value = defaultModel;

            window.AJ_GPT.settingsUI.renderModelSettings(provider, window.AJ_GPT.AppSettings.default_inference_hp_settings);
        });
    },

    renderModelSettings: function(provider, defaultSettings) {
        const container = document.getElementById(`${provider}Models`);
        container.innerHTML = '';

        window.AJ_GPT.AppSettings.models[provider].forEach(model => {
            const modelDiv = document.createElement('div');
            modelDiv.className = 'model-settings mb-3';
            modelDiv.innerHTML = `
                <h4 class="collapse-toggle" data-bs-toggle="collapse" data-bs-target="#${provider}${model.name}Settings">
                    ${model.name} Settings
                </h4>
                <div id="${provider}${model.name}Settings" class="collapse">
                    <!-- Hyperparameters will be added here -->
                </div>
            `;
            container.appendChild(modelDiv);

            const settingsContainer = document.getElementById(`${provider}${model.name}Settings`);
            Object.keys(defaultSettings).forEach(setting => {
                const value = window.AJ_GPT.AppSettings.models[provider][model.name]?.[setting] || defaultSettings[setting];
                settingsContainer.appendChild(window.AJ_GPT.settingsUI.createHyperparameterInput(setting, value, `${provider}.${model.name}`));
            });
        });
    },

    createHyperparameterInput: function(setting, value, prefix) {
        const div = document.createElement('div');
        div.className = 'mb-3';
        div.innerHTML = `
            <label for="${prefix}.${setting}" class="form-label">
                ${setting.replace('_', ' ').charAt(0).toUpperCase() + setting.replace('_', ' ').slice(1)}
            </label>
            <input type="range" class="form-range" id="${prefix}.${setting}" name="${prefix}.${setting}"
                   min="0" max="1" step="0.01" value="${value}">
            <span id="${prefix}.${setting}Value">${value}</span>
        `;

        const input = div.querySelector('input');
        const valueSpan = div.querySelector('span');
        input.addEventListener('input', (e) => {
            valueSpan.textContent = e.target.value;
        });

        return div;
    },

    // getDefaultValue: function(setting) {
    //     switch(setting) {
    //         case 'temperature': return 0.7;
    //         case 'max_tokens': return 2048;
    //         case 'top_p': return 1;
    //         case 'top_k': return 50;
    //         case 'frequency_penalty': return 0;
    //         case 'presence_penalty': return 0;
    //         default: return 0;
    //     }
    // },

    setupEventListeners: function() {
        document.getElementById('defaultProvider').addEventListener('change', (e) => {
            // You might want to add some logic here if needed when changing the default provider
        });

        document.getElementById('globalSettingsForm').addEventListener('submit', window.AJ_GPT.settingsUI.saveGlobalSettings.bind(window.AJ_GPT.settingsUI));
    },

    saveGlobalSettings: function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const globalSettings = {
            defaultProvider: formData.get('defaultProvider'),
            globalHyperparameters: {},
            providerSettings: {}
        };

        for (let [key, value] of formData.entries()) {
            if (key.startsWith('global.')) {
                globalSettings.globalHyperparameters[key.split('.')[1]] = parseFloat(value);
            } else if (key.includes('.')) {
                const [provider, model, setting] = key.split('.');
                if (!globalSettings.providerSettings[provider]) {
                    globalSettings.providerSettings[provider] = { models: {} };
                }
                if (!globalSettings.providerSettings[provider].models[model]) {
                    globalSettings.providerSettings[provider].models[model] = {};
                }
                globalSettings.providerSettings[provider].models[model][setting] = parseFloat(value);
            } else if (key.endsWith('DefaultModel')) {
                const provider = key.replace('DefaultModel', '');
                if (!globalSettings.providerSettings[provider]) {
                    globalSettings.providerSettings[provider] = {};
                }
                globalSettings.providerSettings[provider].defaultModel = value;
            }
        }

        window.AJ_GPT.settingsUI.saveToLocalStorage('globalSettings', globalSettings);
        window.AJ_GPT.settingsUI.showToast('Global settings saved successfully', 'success');
    },

    getFromLocalStorage: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    saveToLocalStorage: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    showToast: function(message, type) {
        // Create a toast element
        const toastElement = document.createElement('div');
        toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');

        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        // Create a toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }

        // Add the toast to the container
        toastContainer.appendChild(toastElement);

        // Initialize the toast
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Remove the toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function () {
            toastElement.remove();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AJ_GPT.settingsUI.initialize();
});