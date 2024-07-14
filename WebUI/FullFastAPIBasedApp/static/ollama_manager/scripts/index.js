window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.login = {
    initialize: function() {
        this.loadPersonas();
        this.setupEventListeners();
        window.AJ_GPT.ui.updateNavigation();
    },

    loadPersonas: function() {
        var personas = window.AJ_GPT.utils.getFromLocalStorage("personas");
        if (personas == null) {
            personas = [
                {
                    id: "default",
                    name: "Default",
                    systemPrompt: "You are a helpful assistant.",
                },
                {
                    id: "coder",
                    name: "Coder",
                    systemPrompt: "You are an expert programmer.",
                },
                {
                    id: "creative",
                    name: "Creative",
                    systemPrompt: "You are a creative writer.",
                },
            ];

            window.AJ_GPT.utils.saveToLocalStorage("personas", personas);
        }
        
        var personaSelect = document.getElementById('personaSelect');
        personaSelect.innerHTML = personas.map(persona => 
            `<option value="${persona.id}">${persona.name}</option>`
        ).join('');
    },

    setupEventListeners: function() {
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('exportConfig').addEventListener('click', window.AJ_GPT.utils.exportConfig.bind(window.AJ_GPT.utils));
        document.getElementById('importConfig').addEventListener('click', this.handleImportClick.bind(this));
        document.getElementById('importFile').addEventListener('change', this.handleFileImport.bind(this));
    },

    handleLogin: function(event) {
        event.preventDefault();
        var username = document.getElementById('username').value;
        var personaId = document.getElementById('personaSelect').value;
        this.startSession(username, personaId);
    },

    startSession: function(username, personaId) {
        var personas = window.AJ_GPT.utils.getFromLocalStorage('personas')??[];
        var selectedPersona = personas.find(p => p.id === personaId);
        
        if (!selectedPersona) {
            window.AJ_GPT.ui.showToast('Selected persona not found', 'error');
            return;
        }

        var sessionData = {
            username: username,
            personaId: personaId,
            personaName: selectedPersona.name,
            startTime: new Date().toISOString()
        };

        window.AJ_GPT.utils.saveToLocalStorage('currentSession', sessionData);
        window.location.href = 'models.html';
    },

    handleImportClick: function() {
        document.getElementById('importFile').click();
    },

    handleFileImport: function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = (e) => {
                var success = window.AJ_GPT.utils.importConfig(e.target.result);
                if (success) {
                    window.AJ_GPT.ui.showToast('Configuration imported successfully', 'success');
                    this.loadPersonas();
                } else {
                    window.AJ_GPT.ui.showToast('Error importing configuration', 'error');
                }
            };
            reader.readAsText(file);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AJ_GPT.login.initialize();
});
