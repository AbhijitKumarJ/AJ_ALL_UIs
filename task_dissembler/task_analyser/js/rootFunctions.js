// This file contains functions for initializing the application

$(function () {

    function createInitialFlowchart() {
        const task = $('#taskInput').val();

        if (task.trim() === '') return;

        window.AJ_GPT.taskTree = window.AJ_GPT.treeDataManipulation.getNewNode('root', task, "Please try to create as many subtasks as possible which are quite reasonable and practical for the accomplishment of task", null);
        window.AJ_GPT.renderFlowchart();
        window.AJ_GPT.treeDataManipulation.createSubnodesFromTaskDivision('root', false)
    }

    function exportJson() {
        const dataToExport = {
            taskTree: window.AJ_GPT.taskTree,
            llmConfig: {
                provider: window.AJ_GPT.userData.llmProvider,
                modelName: window.AJ_GPT.userData.llmModelName,
                apiEndpoint: window.AJ_GPT.userData.llmApiEndpoint, // Save endpoint
                taskType: window.AJ_GPT.userData.taskType
                // API key is intentionally not saved
            }
        };
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'task_tree.json'; // Keeping filename as task_tree.json
        a.click();
        URL.revokeObjectURL(url);
    }

    function importJson() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = readerEvent => {
                try {
                    const content = readerEvent.target.result;
                    const importedData = JSON.parse(content);

                    if (importedData.taskTree && importedData.llmConfig) {
                        // New format with taskTree and llmConfig
                        window.AJ_GPT.taskTree = importedData.taskTree;
                        window.AJ_GPT.userData.llmProvider = importedData.llmConfig.provider || 'Groq';
                        window.AJ_GPT.userData.llmModelName = importedData.llmConfig.modelName || 'llama3-70b-8192';
                        window.AJ_GPT.userData.llmApiEndpoint = importedData.llmConfig.apiEndpoint || '';
                        window.AJ_GPT.userData.taskType = importedData.llmConfig.taskType || ['General'];

                        // Update UI elements
                        $('#llmProvider').val(window.AJ_GPT.userData.llmProvider);
                        $('#llmModelName').val(window.AJ_GPT.userData.llmModelName);
                        $('#llmApiEndpoint').val(window.AJ_GPT.userData.llmApiEndpoint);
                        $('#llmApiKey').val(''); // Clear API key field

                    } else {
                        // Old format (just the task tree)
                        window.AJ_GPT.taskTree = importedData;
                        // Set default LLM config for old format imports
                        window.AJ_GPT.userData.llmProvider = 'Groq';
                        window.AJ_GPT.userData.llmModelName = 'llama3-70b-8192';
                        window.AJ_GPT.userData.llmApiEndpoint = '';
                        window.AJ_GPT.userData.taskType = ['General'];
                        
                        // Update UI elements with defaults
                        $('#llmProvider').val(window.AJ_GPT.userData.llmProvider);
                        $('#llmModelName').val(window.AJ_GPT.userData.llmModelName);
                        $('#llmApiEndpoint').val(window.AJ_GPT.userData.llmApiEndpoint);
                        $('#llmApiKey').val('');
                    }
                    
                    window.AJ_GPT.renderFlowchart(); // Update flowchart view
                    $('#llmProvider').trigger('change'); // Trigger change to update endpoint visibility

                } catch (error) {
                    console.error('Error parsing JSON or processing imported data:', error);
                    alert('Invalid JSON file or error processing data.');
                }
            }
            reader.readAsText(file);
        }
        input.click();
    }

    $('#submitTask').on("click", createInitialFlowchart);
    $('#exportJson').on("click", exportJson);
    $('#importJson').on("click", importJson);

    // Event Listener for llmProvider change
    $('#llmProvider').on('change', function() {
        // Assuming the llmApiEndpoint input field is directly inside a div.col-md-6
        // If the value is "Other (Manual Endpoint)", show the container of llmApiEndpoint, otherwise hide it.
        const apiEndpointContainer = $('#llmApiEndpoint').closest('.col-md-6'); 
        if ($(this).val() === 'Other (Manual Endpoint)') {
            apiEndpointContainer.show();
        } else {
            apiEndpointContainer.hide();
        }
    });
    // Trigger it once on load to set initial state
    // Also, ensure current values from window.AJ_GPT.userData are populated on load
    if (window.AJ_GPT && window.AJ_GPT.userData) {
        $('#llmProvider').val(window.AJ_GPT.userData.llmProvider || 'Groq');
        $('#llmModelName').val(window.AJ_GPT.userData.llmModelName || 'llama3-70b-8192');
        $('#llmApiKey').val(window.AJ_GPT.userData.llmApiKey || ''); // Should be empty by default
        $('#llmApiEndpoint').val(window.AJ_GPT.userData.llmApiEndpoint || '');
    }
    $('#llmProvider').trigger('change');

});
