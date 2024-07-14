window.AJ_GPT = window.AJ_GPT || {};
window.AJ_GPT.utils = {
    saveToLocalStorage: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    getFromLocalStorage: function(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return null;
        }
    },

    exportConfig: function() {
        const config = {
            personas: this.getFromLocalStorage('personas'),
            globalSettings: this.getFromLocalStorage('globalSettings'),
            currentSession: this.getFromLocalStorage('currentSession')
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ollama_dashboard_config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importConfig: function(data) {
        try {
            const config = JSON.parse(data);
            if (config.personas) this.saveToLocalStorage('personas', config.personas);
            if (config.globalSettings) this.saveToLocalStorage('globalSettings', config.globalSettings);
            if (config.currentSession) this.saveToLocalStorage('currentSession', config.currentSession);
            return true;
        } catch (error) {
            console.error('Error importing configuration:', error);
            return false;
        }
    }
};
