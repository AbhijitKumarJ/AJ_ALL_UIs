# Task Dissembler (Static Site Version)

This project provides functionality for dissembling, managing, and visualizing tasks in a hierarchical structure. It allows users to break down complex tasks into smaller, manageable sub-tasks and view them as an interactive flowchart.

This version operates as a **fully static website**, requiring no backend. Large Language Model (LLM) interactions for task breakdown are configured and performed directly in your browser.

## Features

*   **Hierarchical Task Management:** Create, edit, and organize tasks and sub-tasks.
*   **Flowchart Visualization:** View your task structure as an interactive flowchart.
*   **Client-Side LLM Integration:** Configure and use LLMs (e.g., Groq, OpenAI, Ollama, or other compatible endpoints) directly from the frontend for AI-assisted task breakdown.
*   **JSON Data Persistence:**
    *   **Export:** Save your entire task tree, including LLM configuration (provider, model, custom endpoint, task type - API key is NOT saved), to a JSON file.
    *   **Import:** Load your task tree and LLM configuration from a previously exported JSON file.
*   **Configurable Prompts:** Task breakdown behavior can be customized via `task_analyser/js/prompts.js` (requires manual editing).

## Usage

1.  **Open the Application:**
    *   Simply open the `task_analyser/index.html` file in a modern web browser.

2.  **Configure LLM Provider (First-Time Setup):**
    *   Before you can use the AI-assisted task breakdown, you need to configure your LLM provider:
        *   **LLM Provider:** Select your provider (e.g., "Groq", "OpenAI", "Ollama").
        *   **Model Name:** Enter the specific model name you wish to use (e.g., "llama3-70b-8192", "gpt-4").
        *   **API Key:** Enter your API key for the selected provider. **This key is stored in your browser's session only and is NOT saved in exported JSON files.**
        *   **API Endpoint (if "Other" is selected):** If you choose "Other (Manual Endpoint)", you must provide the full API URL for chat completions.
    *   This configuration is stored in your browser but will be lost if you clear your site data or switch browsers. Use the Export/Import JSON functionality to save and restore configurations along with your task data.

3.  **Creating/Dissembling Tasks:**
    *   Enter an overall task summary in the main input field.
    *   Click "Start dissembling :)" to initiate the task breakdown using the configured LLM.
    *   Interact with the flowchart nodes to further subdivide tasks, edit text, or add properties.

4.  **Saving Your Work (Export JSON):**
    *   Click the "Export JSON" button.
    *   A `task_tree.json` file will be downloaded. This file contains your current task flowchart and your LLM configuration settings (excluding the API key). Store this file safely.

5.  **Loading Your Work (Import JSON):**
    *   Click the "Import JSON" button.
    *   Select a previously exported `task_tree.json` file.
    *   The flowchart and your saved LLM configuration (provider, model, endpoint, task type) will be loaded into the application. You will need to re-enter your API key if you wish to use the LLM features.

## Customization

*   **LLM Prompts:** The prompts used to interact with the LLM for task breakdown are defined in `task_analyser/js/prompts.js`. Advanced users can modify these prompts to tailor the AI's behavior. The `taskType` loaded from the imported JSON (or defaulted to `['General']`) determines which set of prompts is used.

## Technical Notes

*   This project was derived from the `task_analyser` component of the `FullFastAPIBasedApp` and has been refactored to remove backend dependencies.
*   All operations, including LLM calls, are performed client-side. Ensure your browser has the necessary permissions if interacting with local LLM instances like Ollama (e.g., network access to `localhost`).
