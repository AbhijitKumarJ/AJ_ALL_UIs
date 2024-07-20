window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.personas = {
    initialize: function() {
        this.loadPersonas();
        this.setupEventListeners();
    },

    loadPersonas: function() {
        const personas = this.getFromLocalStorage('personas') || [
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
        document.getElementById('addPersonaBtn').addEventListener('click', () => this.openPersonaModal());
        document.getElementById('savePersonaBtn').addEventListener('click', this.savePersona.bind(this));
        document.getElementById('personasList').addEventListener('click', this.handlePersonaAction.bind(this));
    },

    openPersonaModal: function(personaId = null) {
        const modalTitle = document.getElementById('personaModalLabel');
        const personaForm = document.getElementById('personaForm');
        
        if (personaId) {
            const personas = this.getFromLocalStorage('personas');
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

        const modal = new bootstrap.Modal(document.getElementById('personaModal'));
        modal.show();
    },

    savePersona: function() {
        const personaForm = document.getElementById('personaForm');
        const personaId = personaForm.elements.personaId.value;
        const personaName = personaForm.elements.personaName.value;
        const systemPrompt = personaForm.elements.systemPrompt.value;

        let personas = this.getFromLocalStorage('personas') || [];

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

        this.saveToLocalStorage('personas', personas);
        this.loadPersonas();
        bootstrap.Modal.getInstance(document.getElementById('personaModal')).hide();
        this.showToast('Persona saved successfully', 'success');
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
            let personas = this.getFromLocalStorage('personas') || [];
            personas = personas.filter(p => p.id !== personaId);
            this.saveToLocalStorage('personas', personas);
            this.loadPersonas();
            this.showToast('Persona deleted successfully', 'success');
        }
    },

    getFromLocalStorage: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    saveToLocalStorage: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    showToast: function(message, type) {
        // Implement a toast notification system here
        alert(message);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AJ_GPT.personas.initialize();
});