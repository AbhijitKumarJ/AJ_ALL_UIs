window.AJ_GPT.llm_prompts={
    UI:{
        React:{
            Task:"",
            SubTask:""
        },
        Angular:{
            Task:"",
            SubTask:""
        },
        JQuery:{
            Task:"",
            SubTask:""
        }
    },
    API:{
        Python:{
            FastAPI:{
                Task:"",
                SubTask:""
            },
            Flask:{
                Task:"",
                SubTask:""
            },
        },
        CSharp:{
            WebAPI:{
                Task:"",
                SubTask:""
            }
        },
        NodeJs:{
            API:{
                Task:"",
                SubTask:""
            }
        }
    },
    DB:{
        Sqlite:{
            Task:"",
            SubTask:""
        },
        MySql:{
            Task:"",
            SubTask:""
        }
    },
}

window.AJ_GPT.llm_prompts.UI.Angular.Task=`
You are an expert in Angular development and project management. I need you to break down the task of "Frontend UI Development using Angular" into its main high-level components. Please provide the first-level nodes of this task breakdown.



[Task Summary]
{{Task_Summary}}



[Task Description]
{{Task_Description}}



Use the [Task Summary] and [Task Description] provided by user to formulate task specific break down applying all the given conditions.

For each first-level node, include the following properties:

1. id: A unique identifier for the node
2. text: A brief, descriptive title for the task
3. description: A more detailed explanation of what the task entails
4. level: Should be 1 for all first-level nodes
5. is_actionable: Boolean (true/false) indicating if this node represents an action item or just a category
6. execution_category: The type of task (e.g., "planning", "development", "testing", "documentation")
7. state: The current status ("not_started", "in_progress", "completed")
8. needs_revision: Boolean indicating if the task needs to be reviewed or updated
9. llm_prompt: A suggested prompt to generate subtasks or get more details about this task
10. associated_files: List of files that are related to this task
11. estimated_time: An approximate time to complete this task
12. dependencies: List of tasks (if any) that need to be completed before this one can start
13. assigned_to: The role responsible for this task
14. review_required: Boolean indicating if the task output needs review
15. priority: Task priority ("high", "medium", "low")
16. complexity: Task difficulty ("simple", "moderate", "complex")
17. tags: Array of relevant keywords
18. acceptance_criteria: List of criteria that define task completion
19. resources: Links or references to helpful documentation or tools
20. subtask_strategy: Approach for breaking down this task further

Please provide the result as a JSON array, where each object in the array represents a first-level node with all the properties listed above.

Focus on creating a comprehensive but manageable set of first-level tasks that cover all major aspects of Angular frontend UI development, including but not limited to project setup, component development, routing, state management, API integration, testing, and deployment.
`;

window.AJ_GPT.llm_prompts.UI.Angular.SubTask=`
You are an expert in Angular development and project management. We are working on a frontend UI development project using Angular. I need you to break down a specific task into its subtasks. Here's the context and the task to break down:


[Project Context]
{{Project_Context}}



[Parent Task]
{{Parent_Task}}



[Sibling Tasks]
{{Sibling_Tasks}}



[Task to Break Down]
{{Task_Summary}}}



[Task Description]
{{Task_Description}}



Please provide the next level of subtasks for the [Task to Break Down] using [Task Description] to get more details on task. 

For each subtask, include the following properties:

1. id: A unique identifier for the subtask
2. text: A brief, descriptive title for the subtask
3. description: A more detailed explanation of what the subtask entails
4. level: The level of this subtask (parent task level + 1)
5. is_actionable: Boolean (true/false) indicating if this subtask represents an action item
6. execution_category: The type of task (e.g., "development", "testing", "documentation")
7. state: The current status ("not_started")
8. needs_revision: Boolean (initially set to false)
9. llm_prompt: A suggested prompt to generate further subtasks or get more details
10. associated_files: List of files that are likely to be related to this subtask
11. estimated_time: An approximate time to complete this subtask
12. dependencies: List of other subtasks (if any) that need to be completed before this one
13. assigned_to: The role responsible for this subtask
14. review_required: Boolean indicating if the subtask output needs review
15. priority: Subtask priority ("high", "medium", "low")
16. complexity: Subtask difficulty ("simple", "moderate", "complex")
17. tags: Array of relevant keywords
18. acceptance_criteria: List of criteria that define subtask completion
19. resources: Links or references to helpful documentation or tools
20. subtask_strategy: Approach for potentially breaking down this subtask further

Please provide the result as a JSON array, where each object in the array represents a subtask with all the properties listed above.

Focus on creating a comprehensive but manageable set of subtasks that directly contribute to completing the [Task to Break Down]. Ensure that the subtasks are specific, actionable, and aligned with Angular development best practices.

Remember to consider the following in your breakdown:
1. The specific requirements of the [Task to Break Down]
2. The context provided by the [Parent Task] and [Sibling Tasks]
3. The overall project context
4. Standard Angular development workflows and best practices
5. Potential dependencies between subtasks

Aim to provide 3-7 subtasks unless the complexity of the [Task to Break Down] clearly warrants more or fewer.
`;


window.AJ_GPT.llm_prompts.UI.React.Task=``;
window.AJ_GPT.llm_prompts.UI.React.SubTask=``;

window.AJ_GPT.llm_prompts.UI.JQuery.Task=``;
window.AJ_GPT.llm_prompts.UI.JQuery.SubTask=``;

window.AJ_GPT.llm_prompts.API.Python.FastAPI.Task=`
You are an expert in Python backend development, specifically using FastAPI, and project management. I need you to break down the task of "Web API Development using FastAPI" into its main high-level components. Please provide the first-level nodes of this task breakdown.



[Task Summary]
{{Task_Summary}}



[Task Description]
{{Task_Description}}



Use the [Task Summary] and [Task Description] provided by user to formulate task specific break down applying all the given conditions.

For each first-level node, include the following properties:

1. id: A unique identifier for the node
2. text: A brief, descriptive title for the task
3. description: A more detailed explanation of what the task entails
4. level: Should be 1 for all first-level nodes
5. is_actionable: Boolean (true/false) indicating if this node represents an action item or just a category
6. execution_category: The type of task (e.g., "planning", "development", "testing", "documentation", "deployment")
7. state: The current status ("not_started", "in_progress", "completed")
8. needs_revision: Boolean indicating if the task needs to be reviewed or updated
9. llm_prompt: A suggested prompt to generate subtasks or get more details about this task
10. associated_files: List of files that are related to this task (e.g., "main.py", "requirements.txt")
11. estimated_time: An approximate time to complete this task
12. dependencies: List of tasks (if any) that need to be completed before this one can start
13. assigned_to: The role responsible for this task (e.g., "Backend Developer", "DevOps Engineer")
14. review_required: Boolean indicating if the task output needs review
15. priority: Task priority ("high", "medium", "low")
16. complexity: Task difficulty ("simple", "moderate", "complex")
17. tags: Array of relevant keywords (e.g., ["FastAPI", "Python", "API", "Backend"])
18. acceptance_criteria: List of criteria that define task completion
19. resources: Links or references to helpful documentation or tools (e.g., FastAPI documentation, Pydantic docs)
20. subtask_strategy: Approach for breaking down this task further (e.g., "feature-based", "layer-based")

Please provide the result as a JSON array, where each object in the array represents a first-level node with all the properties listed above.

Focus on creating a comprehensive but manageable set of first-level tasks that cover all major aspects of FastAPI web API development, including but not limited to:

1. Project setup and configuration
2. API design and planning
3. Database integration (if applicable)
4. Authentication and authorization
5. Core API endpoint implementation
6. Data validation and serialization
7. Error handling and logging
8. Testing (unit, integration, and API tests)
9. Documentation (API docs, Swagger/OpenAPI)
10. Deployment and DevOps considerations
11. Performance optimization
12. Security measures
13. Monitoring and analytics setup

Ensure that the tasks align with FastAPI best practices and common patterns in production-ready web API development. Consider aspects like async programming, dependency injection, and the use of Pydantic for data modeling.
`;

window.AJ_GPT.llm_prompts.API.Python.FastAPI.SubTask=`
You are an expert in Python backend development, specifically using FastAPI, and project management. We are working on a web API development project using FastAPI. I need you to break down a specific task into its subtasks. Here's the context and the task to break down:


[Project Context]
{{Project_Context}}



[Parent Task]
{{Parent_Task}}



[Sibling Tasks]
{{Sibling_Tasks}}



[Task to Break Down]
{{Task_Summary}}}



[Task Description]
{{Task_Description}}



Please provide the next level of subtasks for the [Task to Break Down] using [Task Description] to get more details on task. 

For each subtask, include the following properties:

1. id: A unique identifier for the subtask
2. text: A brief, descriptive title for the subtask
3. description: A more detailed explanation of what the subtask entails
4. level: The level of this subtask (parent task level + 1)
5. is_actionable: Boolean (true/false) indicating if this subtask represents an action item
6. execution_category: The type of task (e.g., "development", "testing", "documentation")
7. state: The current status ("not_started")
8. needs_revision: Boolean (initially set to false)
9. llm_prompt: A suggested prompt to generate further subtasks or get more details
10. associated_files: List of files that are likely to be related to this subtask
11. estimated_time: An approximate time to complete this subtask
12. dependencies: List of other subtasks (if any) that need to be completed before this one
13. assigned_to: The role responsible for this subtask
14. review_required: Boolean indicating if the subtask output needs review
15. priority: Subtask priority ("high", "medium", "low")
16. complexity: Subtask difficulty ("simple", "moderate", "complex")
17. tags: Array of relevant keywords
18. acceptance_criteria: List of criteria that define subtask completion
19. resources: Links or references to helpful documentation or tools
20. subtask_strategy: Approach for potentially breaking down this subtask further

Please provide the result as a JSON array, where each object in the array represents a subtask with all the properties listed above.

Focus on creating a comprehensive but manageable set of subtasks that directly contribute to completing the [Task to Break Down]. Ensure that the subtasks are specific, actionable, and aligned with FastAPI development best practices.

Remember to consider the following in your breakdown:
1. The specific requirements of the [Task to Break Down]
2. The context provided by the [Parent Task] and [Sibling Tasks]
3. The overall project context
4. FastAPI-specific development patterns and best practices
5. Python backend development principles
6. Potential dependencies between subtasks
7. Asynchronous programming considerations
8. API security and performance best practices

Aim to provide 3-7 subtasks unless the complexity of the [Task to Break Down] clearly warrants more or fewer.
`;

window.AJ_GPT.llm_prompts.API.CSharp.Task=``;
window.AJ_GPT.llm_prompts.API.CSharp.SubTask=``;

window.AJ_GPT.llm_prompts.DB.Sqlite.Task=``;
window.AJ_GPT.llm_prompts.DB.Sqlite.SubTask=``;