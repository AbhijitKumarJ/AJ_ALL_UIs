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
        const jsonString = JSON.stringify(window.AJ_GPT.taskTree, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'task_tree.json';
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
                    window.AJ_GPT.taskTree = JSON.parse(content);
                    renderFlowchart();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Invalid JSON file');
                }
            }
            reader.readAsText(file);
        }
        input.click();
    }



    $('#submitTask').on("click", createInitialFlowchart);
    $('#exportJson').on("click", exportJson);
    $('#importJson').on("click", importJson);
});
