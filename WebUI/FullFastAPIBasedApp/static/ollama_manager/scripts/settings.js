window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.settings = {
    initialize: function() {
        this.loadGlobalSettings();
        this.loadPersonas();
        this.setupEventListeners();
        window.AJ_GPT.ui.updateNavigation();
    },

    loadGlobalSettings: function() {
        const globalSettings = window.AJ_GPT.utils.getFromLocalStorage('globalSettings') || {
            defaultModel: 'GPT-4',
            maxTokens: 2048,
            temperature: 0.7
        };

        document.getElementById('defaultModel').value = globalSettings.defaultModel;
        document.getElementById('maxTokens').value = globalSettings.maxTokens;
        document.getElementById('temperature').value = globalSettings.temperature;
        this.updateTemperatureValue();
    },

    loadPersonas: function() {
        const personas = window.AJ_GPT.utils.getFromLocalStorage('personas') || [
            { id: 'default', name: 'Default', systemPrompt: 'You are a helpful assistant.' },
            { id: 'coder', name: 'Coder', systemPrompt: 'You are an expert programmer.' },
            { id: 'creative', name: 'Creative', systemPrompt: 'You are a creative writer.' }
        ];

        const personasList = document.getElementById('personasList');
        personasList.innerHTML = personas.map(persona => `
            <div class="persona-card" data-id="${persona.id}">
                <h3>${persona.name}</h3>
                <p>${persona.systemPrompt}</p>
                <div class="persona-actions">
                    <button class="btn btn-primary btn-sm edit-persona-btn">Edit</button>
                    <button class="btn btn-danger btn-sm delete-persona-btn">Delete</button>
                </div>
            </div>
        `).join('');
    },

    setupEventListeners: function() {
        document.getElementById('globalSettingsForm').addEventListener('submit', this.saveGlobalSettings.bind(this));
        document.getElementById('temperature').addEventListener('input', this.updateTemperatureValue.bind(this));
        document.getElementById('addPersonaBtn').addEventListener('click', () => this.openPersonaModal());
        document.getElementById('savePersonaBtn').addEventListener('click', this.savePersona.bind(this));
        document.getElementById('personasList').addEventListener('click', this.handlePersonaAction.bind(this));
    },

    updateTemperatureValue: function() {
        const temperature = document.getElementById('temperature').value;
        document.getElementById('temperatureValue').textContent = temperature;
    },

    saveGlobalSettings: function(event) {
        event.preventDefault();
        const globalSettings = {
            defaultModel: document.getElementById('defaultModel').value,
            maxTokens: parseInt(document.getElementById('maxTokens').value),
            temperature: parseFloat(document.getElementById('temperature').value)
        };

        window.AJ_GPT.utils.saveToLocalStorage('globalSettings', globalSettings);
        window.AJ_GPT.ui.showToast('Global settings saved successfully', 'success');
    },

    openPersonaModal: function(personaId = null) {
        const modalTitle = document.getElementById('personaModalLabel');
        const personaForm = document.getElementById('personaForm');
        
        if (personaId) {
            const personas = window.AJ_GPT.utils.getFromLocalStorage('personas');
            const persona = personas.find(p => p.id === personaId);
            modalTitle.textContent = 'Edit Persona';
            personaForm.elements.personaId.value = persona.id;
            personaForm.elements.personaName.value = persona.name;
            personaForm.elements.systemPrompt.value = persona.systemPrompt;
        } else {
            modalTitle.textContent = 'Add New Persona';
            personaForm.reset();
            personaForm.elements.personaId.value = '';
        }

        new bootstrap.Modal(document.getElementById('personaModal')).show();
    },

    savePersona: function() {
        const personaForm = document.getElementById('personaForm');
        const personaId = personaForm.elements.personaId.value;
        const personaName = personaForm.elements.personaName.value;
        const systemPrompt = personaForm.elements.systemPrompt.value;

        let personas = window.AJ_GPT.utils.getFromLocalStorage('personas') || [];

        if (personaId) {
            // Edit existing persona
            const index = personas.findIndex(p => p.id === personaId);
            if (index !== -1) {
                personas[index] = { id: personaId, name: personaName, systemPrompt };
            }
        } else {
            // Add new persona
            const newId = 'persona_' + Date.now();
            personas.push({ id: newId, name: personaName, systemPrompt });
        }

        window.AJ_GPT.utils.saveToLocalStorage('personas', personas);
        this.loadPersonas();
        bootstrap.Modal.getInstance(document.getElementById('personaModal')).hide();
        window.AJ_GPT.ui.showToast('Persona saved successfully', 'success');
    },

    handlePersonaAction: function(event) {
        const target = event.target;
        const personaCard = target.closest('.persona-card');
        if (!personaCard) return;

        const personaId = personaCard.dataset.id;

        if (target.classList.contains('edit-persona-btn')) {
            this.openPersonaModal(personaId);
        } else if (target.classList.contains('delete-persona-btn')) {
            this.deletePersona(personaId);
        }
    },

    deletePersona: function(personaId) {
        if (confirm('Are you sure you want to delete this persona?')) {
            let personas = window.AJ_GPT.utils.getFromLocalStorage('personas') || [];
            personas = personas.filter(p => p.id !== personaId);
            window.AJ_GPT.utils.saveToLocalStorage('personas', personas);
            this.loadPersonas();
            window.AJ_GPT.ui.showToast('Persona deleted successfully', 'success');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AJ_GPT.settings.initialize();
});
