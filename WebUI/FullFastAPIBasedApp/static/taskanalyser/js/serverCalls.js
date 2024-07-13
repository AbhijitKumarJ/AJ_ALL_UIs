// This file contains functions for making server calls
$(function () {
    
    function simulateApiCall(task, options = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("API call options:", options);
                const subtasks = [
                    `Subtask 1 of "${task}"`,
                    `Subtask 2 of "${task}"`,
                    `Subtask 3 of "${task}"`,
                ];
                resolve(subtasks);
            }, 500);
        });
    }

    function getTopics(username, password, success_callback, error_callback) {
        let msg = {
            username: username,
            password: password,
        };
        $.ajax({
            url: "/master/get_topics",
            type: "GET",
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

    function getUserProjects(user_id, success_callback, error_callback) {
        $.ajax({
            url: "/user/get_user_projects/" + user_id.toString(),
            type: "GET",
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

    function getUserSessions(user_id, success_callback, error_callback) {
        $.ajax({
            url: "/user/get_user_sessions/" + user_id.toString(),
            type: "GET",
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

    function login_user(username, password, success_callback, error_callback) {
        let msg = {
            username: username,
            password: password,
        };
        $.ajax({
            url: "/user/login_user",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(msg),
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

    function register_user(
        username,
        password,
        persona,
        success_callback,
        error_callback
    ) {
        let msg = {
            username: username,
            password: password,
            persona: persona,
        };
        $.ajax({
            url: "/user/register_user",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(msg),
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

    function createSession(
        user_id,
        topic_id,
        sub_topic_id,
        project_id,
        project_name,
        project_desc,
        session_name,
        success_callback,
        error_callback
    ) {
        let msg = {
            user_id: user_id,
            topic_id: topic_id,
            sub_topic_id: sub_topic_id,
            project_id: project_id,
            project_name: project_name,
            project_desc: project_desc,
            session_name: session_name,
        };
        $.ajax({
            url: "/user/create_user_session",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(msg),
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


    function createPrompt(
        task_type,
        is_root,
        task_summary,
        task_description,
        project_desc,
        parent_task_desc,
        siblings_desc,
        options = {}
    ) {

        var taskLeafNode=window.AJ_GPT.llm_prompts[task_type[0]];
        for (let index = 1; index < task_type.length; index++) {
            taskLeafNode = taskLeafNode[task_type[index]];            
        }

        

        var content = "";
        if (is_root) {
            content=taskLeafNode.Task.replace('{{Task_Summary}}', task_summary);
            content=content.replace('{{Task_Description}}', task_description);            
        }
        else
        {
            content=taskLeafNode.SubTask.replace('{{Task_Summary}}', task_summary);
            content=content.replace('{{Task_Description}}', task_description);
            content=content.replace('{{Project_Context}}', project_desc);
            content=content.replace('{{Parent_Task}}', parent_task_desc);
            content=content.replace('{{Sibling_Tasks}}', siblings_desc);            
        }

        console.log(content)


        // let chatMessage = {
        //     user_id: "abhijit",
        //     session_name: "random thoughts1",
        //     session_folder: "",
        //     message: JSON.stringify(prompt),
        //     timestamp: new Date().toISOString(),
        // };
        
        prompt = [
            // {
            //     role: "system",
            //     content:
            //         "You are an expert assistant. Please provide responses to user queries in step by step manner as json object which has one property for summary, another for description and last one as task_steps which should be child json array with each element having two properties namely summary, description",
            // },
            {
                role: "user",
                content: content
            }
        ];

        return prompt;
    }

    function subDivideTask(
        task_type,
        is_root,
        task_summary,
        task_description,
        project_desc,
        parent_task_desc,
        siblings_desc,
        options = {},
        success_callback,
        error_callback
    ) {
        prompt = createPrompt(
            task_type,
            is_root,
            task_summary,
            task_description,
            project_desc,
            parent_task_desc,
            siblings_desc,
            options
        );


        let chatMessage = {
            prompt: JSON.stringify(prompt),
            provider: "Groq",
            model: "llama3-70b-8192",
        };

        $.ajax({
            url: "/task/get_sub_tasks",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(chatMessage),
            success: function (response) {
                console.log(response);
                success_callback(response, chatMessage);
                //simulateBotResponse(response.message);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + xhr.responseJSON.error);
                error_callback(xhr, status, error);
            },
        });
    }

    function saveTaskTree(taskTree) {
        // In a real application, this would make an API call to save the task tree on the server
        console.log("Saving task tree:", taskTree);
        return Promise.resolve({ success: true });
    }

    function loadTaskTree() {
        // In a real application, this would make an API call to load the task tree from the server
        return Promise.resolve({ id: "root", text: "Root Task", children: [] });
    }

    function get_chat_response(user_message, success_callback, error_callback) {
        prompt = [
            {
                role: "system",
                content:
                    "You are an expert assistant. Please provide responses to user queries in step by step manner as json object which has one property for summary, another for description and last one as task steps which should be child json array with each element having two properties namely summary, description",
            },
            {
                role: "user",
                content:
                    "Please provide step by step actions to accomplish this task: " +
                    user_message,
            },
        ];

        // let chatMessage = {
        //     user_id: "abhijit",
        //     session_name: "random thoughts1",
        //     session_folder: "",
        //     message: JSON.stringify(prompt),
        //     timestamp: new Date().toISOString(),
        // };

        let chatMessage = {
            prompt: JSON.stringify(prompt),
            provider: "Ollama",
            model: "",
        };

        $.ajax({
            url: "/task/get_sub_tasks",
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

    serverCalls = {};

    serverCalls.getTopics = getTopics;
    serverCalls.getUserProjects = getUserProjects;
    serverCalls.getUserSessions = getUserSessions;
    serverCalls.register_user = register_user;
    serverCalls.login_user = login_user;
    serverCalls.createSession = createSession;
    serverCalls.subDivideTask = subDivideTask;
    serverCalls.saveTaskTree = saveTaskTree;
    serverCalls.loadTaskTree = loadTaskTree;
    serverCalls.get_chat_response = get_chat_response;
    window.AJ_GPT.serverCalls = serverCalls;
});
