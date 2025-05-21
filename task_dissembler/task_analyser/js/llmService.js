window.AJ_GPT.llmService = {};

/**
 * Creates a prompt for the LLM based on the task type and other context.
 * Similar to the old createPrompt in serverCalls.js.
 *
 * @param {string[]} task_type - Array of strings indicating task type (e.g., ['UI', 'Angular']).
 * @param {boolean} is_root - Whether this is the root task.
 * @param {string} task_summary - Summary of the current task.
 * @param {string} task_description - Detailed description of the current task.
 * @param {string} project_desc - Description of the overall project.
 * @param {string} parent_task_desc - Description of the parent task.
 * @param {string} siblings_desc - Description of sibling tasks.
 * @returns {object[]} The structured prompt for the LLM (e.g., [{ role: "user", content: "..." }]).
 */
function createPrompt(task_type, is_root, task_summary, task_description, project_desc, parent_task_desc, siblings_desc) {
    let taskLeafNode = window.AJ_GPT.llm_prompts;
    let prompt_template = "";
    let foundTemplate = true;

    if (task_type && task_type.length > 0) {
        for (let i = 0; i < task_type.length; i++) {
            if (taskLeafNode && taskLeafNode[task_type[i]]) { // Check if taskLeafNode is not undefined
                taskLeafNode = taskLeafNode[task_type[i]];
            } else {
                foundTemplate = false;
                break;
            }
        }
        if (foundTemplate && taskLeafNode) { // Check if taskLeafNode is not undefined
            prompt_template = is_root ? taskLeafNode.Task : taskLeafNode.SubTask;
        } else {
            foundTemplate = false; // If taskLeafNode became undefined
        }
    } else {
        foundTemplate = false; // No task_type specified or empty array
    }

    if (!foundTemplate || !prompt_template) {
        console.warn("Specific prompt template not found for task_type:", task_type, "is_root:", is_root, ". Falling back to General prompt.");
        if (window.AJ_GPT.llm_prompts && window.AJ_GPT.llm_prompts.General) { // Check if General exists
             prompt_template = is_root ? window.AJ_GPT.llm_prompts.General.Task : window.AJ_GPT.llm_prompts.General.SubTask;
        }
        if (!prompt_template) { // Ultimate fallback
            prompt_template = "Please subdivide the following task:\nTask Summary: {{Task_Summary}}\nTask Description: {{Task_Description}}";
            if (!is_root) {
                 if (project_desc) prompt_template += "\nProject Context: {{Project_Context}}";
                 if (parent_task_desc) prompt_template += "\nParent Task: {{Parent_Task}}";
                 if (siblings_desc) prompt_template += "\nSibling Tasks: {{Sibling_Tasks}}";
            }
            prompt_template += "\nReturn the subtasks as a JSON array of objects, each with at least 'text' and 'description' fields.";
            console.error("Ultimate fallback prompt used for task_type:", task_type, "is_root:", is_root);
        }
    }
    
    let prompt_string = prompt_template;
    // Ensure prompt_string is a string before calling replace
    if (typeof prompt_string !== 'string') {
        console.error("Prompt template is not a string. Task_type:", task_type, "is_root:", is_root, "Template:", prompt_template);
        // Fallback to a very basic prompt if the template is somehow not a string
        prompt_string = "Please subdivide the task: {{Task_Summary}}. Description: {{Task_Description}}.";
    }

    prompt_string = prompt_string.replace(/{{Task_Summary}}/g, task_summary || "");
    prompt_string = prompt_string.replace(/{{Task_Description}}/g, task_description || "");
    prompt_string = prompt_string.replace(/{{Project_Context}}/g, project_desc || "N/A");
    prompt_string = prompt_string.replace(/{{Parent_Task}}/g, parent_task_desc || "N/A");
    prompt_string = prompt_string.replace(/{{Sibling_Tasks}}/g, siblings_desc || "N/A");

    // console.log("Using prompt template for task_type:", task_type, "is_root:", is_root);
    // console.log("Constructed prompt string:", prompt_string);

    return [{ role: "user", content: prompt_string }];
}

/**
 * Calls the appropriate LLM API to subdivide a task.
 * Replaces the old subDivideTask AJAX call.
 *
 * @param {string[]} task_type - Task type array.
 * @param {boolean} is_root - If it's a root task.
 * @param {string} task_summary - Task summary.
 * @param {string} task_description - Task description.
 * @param {string} project_desc - Project description.
 * @param {string} parent_task_desc - Parent task description.
 * @param {string} siblings_desc - Sibling tasks description.
 * @param {object} options - Additional options (currently unused but kept for compatibility).
 * @param {function} success_callback - Callback for successful API response.
 * @param {function} error_callback - Callback for API errors.
 */
async function subDivideTaskLLM(task_type, is_root, task_summary, task_description, project_desc, parent_task_desc, siblings_desc, options, success_callback, error_callback) {
    const prompt = createPrompt(task_type, is_root, task_summary, task_description, project_desc, parent_task_desc, siblings_desc);

    const { llmProvider, llmModelName, llmApiKey, llmApiEndpoint } = window.AJ_GPT.userData;

    let endpoint = "";
    let headers = { "Content-Type": "application/json" };
    let body = {};

    try {
        switch (llmProvider) {
            case "Groq":
                endpoint = "https://api.groq.com/openai/v1/chat/completions";
                if (!llmApiKey) {
                    error_callback("Groq API Key is missing.");
                    return;
                }
                headers["Authorization"] = `Bearer ${llmApiKey}`;
                body = { messages: prompt, model: llmModelName };
                break;
            case "OpenAI":
                endpoint = "https://api.openai.com/v1/chat/completions";
                if (!llmApiKey) {
                    error_callback("OpenAI API Key is missing.");
                    return;
                }
                headers["Authorization"] = `Bearer ${llmApiKey}`;
                body = { messages: prompt, model: llmModelName };
                break;
            case "Ollama":
                endpoint = llmApiEndpoint || "http://localhost:11434/api/chat"; // Default if not specified
                body = { messages: prompt, model: llmModelName, stream: false };
                break;
            case "Other (Manual Endpoint)":
                if (!llmApiEndpoint) {
                    error_callback("Manual API Endpoint is missing for 'Other' provider.");
                    return;
                }
                endpoint = llmApiEndpoint;
                // Assuming OpenAI/Groq like structure, API key might be needed depending on the endpoint
                if (llmApiKey) { // Conditionally add API key if provided
                    headers["Authorization"] = `Bearer ${llmApiKey}`; 
                }
                body = { messages: prompt, model: llmModelName };
                break;
            default:
                error_callback(`Unsupported LLM provider: ${llmProvider}`);
                return;
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        if (response.ok) {
            const data = await response.json();
            let content = "";
            // Standard OpenAI/Groq structure
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                content = data.choices[0].message.content;
            } 
            // Ollama structure (non-streaming)
            else if (data.message && data.message.content) {
                content = data.message.content;
            } 
            // Fallback if the structure is unknown but response was OK
            else if (typeof data === 'object') {
                 console.warn("LLM response structure not fully recognized, attempting to find content. Full response:", data);
                 // Try to find some content, this is a guess.
                 if (data.content) content = data.content;
                 else if (data.text) content = data.text;
                 else content = JSON.stringify(data); // Last resort
            } else {
                content = data; // If it's just a string response
            }
            
            if (content) {
                success_callback(content, prompt);
            } else {
                console.error("LLM response content is empty or in an unexpected format:", data);
                error_callback("LLM response content is empty or in an unexpected format. Full response: " + JSON.stringify(data));
            }

        } else {
            const errorData = await response.text(); // Use text() to avoid JSON parse error if response is not JSON
            console.error("LLM API Error:", response.status, errorData);
            error_callback(`LLM API Error: ${response.status} ${response.statusText}. Details: ${errorData}`);
        }
    } catch (error) {
        console.error("Error in subDivideTaskLLM:", error);
        error_callback(`Network or other error during LLM call: ${error.message}`);
    }
}

window.AJ_GPT.llmService.createPrompt = createPrompt;
window.AJ_GPT.llmService.subDivideTaskLLM = subDivideTaskLLM;
