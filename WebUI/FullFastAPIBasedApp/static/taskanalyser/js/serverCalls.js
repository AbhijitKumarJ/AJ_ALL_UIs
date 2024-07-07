// This file contains functions for making server calls

function simulateApiCall(task, options = {}) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('API call options:', options);
            const subtasks = [
                `Subtask 1 of "${task}"`,
                `Subtask 2 of "${task}"`,
                `Subtask 3 of "${task}"`
            ];
            resolve(subtasks);
        }, 500);
    });
}

function subdivideTask(taskId, taskText, options = {}, success_callback, error_callback) {

    prompt=[
        {"role":"system", "content":"You are an expert assistant. Please provide responses to user queries in step by step manner as json object which has one property for summary, another for description and last one as task steps which should be child json array with each element having two properties namely summary, description"},
        {"role":"user", "content":"Please provide step by step actions to accomplish this task: " + taskText}
    ]

    let chatMessage = {
        user_id: "abhijit",
        session_name:"random thoughts1",
        session_folder:"",
        message: JSON.stringify(prompt),
        timestamp: new Date().toISOString()
    };
    $.ajax({
        url: "/get_task_steps",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(chatMessage),
        success: function (response) {
            console.log(response);
            success_callback(response);
            //simulateBotResponse(response.message);
        },
        error: function (xhr, status, error) {
            console.log("Error: " + xhr.responseJSON.error);
            error_callback();
        },
    });
}

function saveTaskTree(taskTree) {
    // In a real application, this would make an API call to save the task tree on the server
    console.log('Saving task tree:', taskTree);
    return Promise.resolve({ success: true });
}

function loadTaskTree() {
    // In a real application, this would make an API call to load the task tree from the server
    return Promise.resolve({ id: 'root', text: 'Root Task', children: [] });
}
