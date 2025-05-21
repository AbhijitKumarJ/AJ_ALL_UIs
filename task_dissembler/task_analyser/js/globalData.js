window.AJ_GPT = {};

window.AJ_GPT.taskTree = { id: "root", text: "", desc: "", children: [], properties: {} };

// Default guest user
window.AJ_GPT.loggedInUser = { id: 0, username: "Guest", persona: "Default" };

window.AJ_GPT.userData = {
    // LLM Configuration
    llmProvider: "Groq", // Default provider
    llmModelName: "llama3-70b-8192", // Default model
    llmApiKey: "",
    llmApiEndpoint: "",

    // User-related data
    isRegistering: false, // Kept for potential future use, though auth is simplified
    isLoggedIn: true, // Default to true as there's no login process
    userId: window.AJ_GPT.loggedInUser.id,
    userName: window.AJ_GPT.loggedInUser.username,
    userPersona: window.AJ_GPT.loggedInUser.persona,
    userProjects: [], // Initialize as empty array
    userSessions: [], // Initialize as empty array
    
    // Project and task context (simplified)
    topicId: 0, // Kept for now, might be removed or repurposed
    topicName: "", // Kept for now
    subTopicId: 0, // Kept for now
    subTopicName: "", // Kept for now
    projectId: 0, // Current project ID, if loaded
    projectName: "", // Current project name, if loaded
    projectDesc: "", // Current project description, if loaded
    
    taskType: ['General'], // Default task type for prompts
};

// Old data related to topics and sub-topics (now removed as per instructions)
// window.AJ_GPT.topics = [ ... ];
// window.AJ_GPT.subTopics = [ ... ];
