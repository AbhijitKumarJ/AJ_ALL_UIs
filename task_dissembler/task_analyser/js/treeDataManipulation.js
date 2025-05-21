// Tree manipulation functions using jQuery

$(document).ready(function () {
    let nodeCounter = 0;

    // Function to generate a unique ID
    function generateUniqueId() {
        nodeCounter++;
        return `node-${nodeCounter}`;
    }

    function getNewNode(id, text, desc, prompt_and_response) {
        var taskobj = {
            id: id,
            text: text,
            description: desc,
            // level: 1,
            // is_actionable: false,
            // execution_category: "planning",
            // state: "not_started",
            // needs_revision: false,
            // llm_prompt: "",
            // associated_files: [],
            // estimated_time: "2 days",
            // dependencies: [],
            // assigned_to: "User",
            // review_required: false,
            // priority: "medium",
            // complexity: "simple",
            // tags: [],
            // acceptance_criteria: [],
            // resources: [],
            // subtask_strategy: "",
            children: [],
            properties: {},
            prompts_and_responses: [],
        };
        if (prompt_and_response) {
            taskobj.prompts_and_responses.push(prompt_and_response);
        }
        return taskobj;
    }

    // Function to add a child node
    function addChildNode(parentId, text, node_desc, prompt_and_response) { // Changed 'desc' to 'node_desc' to avoid conflict
        const newId = generateUniqueId();
        const newNode = getNewNode(newId, text, node_desc, prompt_and_response);

        const parentNode = findNodeById(parentId);
        if (parentNode) {
            parentNode.children.push(newNode);
            updateTreeView();
            return newId;
        } else {
            console.error("Parent node not found");
            return null;
        }
    }

    // Function to add a sibling node below
    function addSiblingNodeBelow(siblingId, text, node_desc, prompt_and_response) { // Changed 'desc' to 'node_desc'
        const newId = generateUniqueId();
        const newNode = getNewNode(newId, text, node_desc, prompt_and_response);

        const siblingNode = findNodeById(siblingId);
        if (siblingNode) {
            const parentNode = findParentNode(siblingId);
            if (parentNode) {
                const siblingIndex = parentNode.children.findIndex(
                    (child) => child.id === siblingId
                );
                parentNode.children.splice(siblingIndex + 1, 0, newNode);
                updateTreeView();
                return newId;
            } else {
                console.error("Parent of sibling node not found");
                return null;
            }
        } else {
            console.error("Sibling node not found");
            return null;
        }
    }

    // Function to add a sibling node above
    function addSiblingNodeAbove(siblingId, text, node_desc, prompt_and_response) { // Changed 'desc' to 'node_desc'
        const newId = generateUniqueId();
        const newNode = getNewNode(newId, text, node_desc, prompt_and_response);

        const siblingNode = findNodeById(siblingId);
        if (siblingNode) {
            const parentNode = findParentNode(siblingId);
            if (parentNode) {
                const siblingIndex = parentNode.children.findIndex(
                    (child) => child.id === siblingId
                );
                parentNode.children.splice(siblingIndex, 0, newNode);
                updateTreeView();
                return newId;
            } else {
                console.error("Parent of sibling node not found");
                return null;
            }
        } else {
            console.error("Sibling node not found");
            return null;
        }
    }

    // Function to add a property to a node
    function addProperty(nodeId, key, value) {
        const node = findNodeById(nodeId);
        if (node) {
            node.properties[key] = value;
            updateTreeView();
            return true;
        } else {
            console.error("Node not found");
            return false;
        }
    }

    // Function to move a node up
    function moveNodeUp(nodeId) {
        const parentNode = findParentNode(nodeId);
        if (parentNode) {
            const nodeIndex = parentNode.children.findIndex(
                (child) => child.id === nodeId
            );
            if (nodeIndex > 0) {
                const temp = parentNode.children[nodeIndex];
                parentNode.children[nodeIndex] =
                    parentNode.children[nodeIndex - 1];
                parentNode.children[nodeIndex - 1] = temp;
                updateTreeView();
                return true;
            }
        }
        return false;
    }

    // Function to move a node down
    function moveNodeDown(nodeId) {
        const parentNode = findParentNode(nodeId);
        if (parentNode) {
            const nodeIndex = parentNode.children.findIndex(
                (child) => child.id === nodeId
            );
            if (nodeIndex < parentNode.children.length - 1) {
                const temp = parentNode.children[nodeIndex];
                parentNode.children[nodeIndex] =
                    parentNode.children[nodeIndex + 1];
                parentNode.children[nodeIndex + 1] = temp;
                updateTreeView();
                return true;
            }
        }
        return false;
    }

    // Function to move a node to parent level
    function moveNodeToParentLevel(nodeId) {
        const node = findNodeById(nodeId);
        const parentNode = findParentNode(nodeId);
        const grandparentNode = findParentNode(parentNode.id);

        if (node && parentNode && grandparentNode) {
            // Remove node from its current parent
            parentNode.children = parentNode.children.filter(
                (child) => child.id !== nodeId
            );

            // Add node to grandparent's children
            const parentIndex = grandparentNode.children.findIndex(
                (child) => child.id === parentNode.id
            );
            grandparentNode.children.splice(parentIndex + 1, 0, node);

            updateTreeView();
            return true;
        }
        return false;
    }

    // Function to delete a node
    function deleteNode(nodeId) {
        const parentNode = findParentNode(nodeId);
        if (parentNode) {
            parentNode.children = parentNode.children.filter(
                (child) => child.id !== nodeId
            );
            updateTreeView();
            return true;
        }
        return false;
    }

    // Helper function to find a node by ID
    function findNodeById(id, node = window.AJ_GPT.taskTree) {
        console.log(node);
        if (node.id === id) {
            return node;
        }
        if (node.children) { // Ensure children exist before iterating
            for (let child of node.children) {
                const found = findNodeById(id, child);
                if (found) return found;
            }
        }
        return null;
    }

    // Helper function to find the parent of a node
    function findParentNode(id, node = window.AJ_GPT.taskTree, parent = null) {
        // console.log(node); // Reduced logging for cleaner console
        if (node.id === id) {
            return parent;
        }
        if (node.children) { // Ensure children exist
            for (let child of node.children) {
                const found = findParentNode(id, child, node);
                if (found) return found;
            }
        }
        return null;
    }

    // Function to change node data (text and properties)
    function updateNodeData(nodeId, newText, newProperties) {
        const node = findNodeById(nodeId);
        if (node) {
            if (newText) {
                node.text = newText;
            }
            if (newProperties) {
                // Merge new properties with existing ones
                node.properties = { ...node.properties, ...newProperties };
            }
            updateTreeView();
            return true;
        } else {
            console.error("Node not found");
            return false;
        }
    }

    // Function to create subnodes based on task division
    async function createSubnodesFromTaskDivision(
        nodeId,
        useCustomOption = false
    ) {
        var is_root = nodeId == "root";
        var parentNode = findNodeById(nodeId);
        if (!parentNode) {
            console.error("Parent node not found");
            return false;
        }

        // Determine parent task description
        let parent_task_description = "";
        if (!is_root) {
            parent_task_description = parentNode.properties.description || parentNode.text;
        }

        try {
            // Call the new LLM service
            window.AJ_GPT.llmService.subDivideTaskLLM(
                window.AJ_GPT.userData.taskType,    // task_type
                is_root,                            // is_root
                parentNode.text,                    // task_summary
                parentNode.properties.description || parentNode.text, // task_description
                window.AJ_GPT.userData.projectDesc, // project_desc
                parent_task_description,            // parent_task_desc
                "",                                 // siblings_desc (empty for now)
                parentNode.properties,              // options
                function (llm_content, prompt_sent) { // success_callback
                    try {
                        const subtasks = JSON.parse(llm_content);
                        
                        if (parentNode.prompts_and_responses === undefined) {
                            parentNode.prompts_and_responses = [];
                        }
                        parentNode.prompts_and_responses.push(
                            { prompt: prompt_sent, response: llm_content }
                        );

                        if (Array.isArray(subtasks)) {
                            subtasks.forEach((subtask) => {
                                const newChildId = addChildNode(
                                    nodeId,
                                    subtask.text || subtask.summary || "Untitled Subtask", // Accommodate different possible key names for summary
                                    subtask.desc || subtask.description || "", // Accommodate different possible key names for description
                                    null
                                );
                                if (newChildId) {
                                    addProperty(
                                        newChildId,
                                        "taskDivisionType",
                                        useCustomOption ? "custom" : "default"
                                    );
                                    // Add all properties from the subtask object returned by LLM
                                    Object.entries(subtask).forEach(
                                        ([key, value]) => {
                                            if (key !== 'children') { // Avoid overwriting children array if present
                                                addProperty(newChildId, key, value);
                                            }
                                        }
                                    );
                                    // Ensure 'description' property is set if 'desc' was primary
                                    if (subtask.desc && !subtask.description) {
                                        addProperty(newChildId, "description", subtask.desc);
                                    }
                                }
                            });
                        } else {
                            console.error("LLM response is not an array of subtasks:", subtasks);
                            alert("Error: LLM response was not in the expected format (array of subtasks). Check console for details.");
                        }
                        updateTreeView();
                    } catch (e) {
                        console.error("Error parsing LLM response or processing subtasks:", e);
                        console.error("Raw LLM content:", llm_content);
                        alert("Error: Could not parse the subtasks from LLM response. Check console for details. Raw response: " + llm_content);
                    }
                },
                function (error_message) { // error_callback
                    console.error("LLM API Error in createSubnodesFromTaskDivision:", error_message);
                    alert("Failed to get subtasks from LLM: " + error_message);
                }
            );
            return true;
        } catch (error) {
            console.error("Error calling subDivideTaskLLM:", error);
            return false;
        }
    }

    // Function to prompt user for default or custom task division
    function promptForTaskDivision(nodeId) {
        const useCustomOption = confirm(
            "Do you want to use custom task division? Click OK for custom, Cancel for default."
        );
        createSubnodesFromTaskDivision(nodeId, useCustomOption);
    }

    // Function to update the tree view (placeholder for UI update)
    function updateTreeView() {
        //console.log("Tree structure updated:", JSON.stringify(window.AJ_GPT.taskTree, null, 2));
        // Here you would update your UI to reflect the new tree structure

        window.AJ_GPT.renderFlowchart();
        //saveTaskTree(taskTree);
    }

    // These functions are now available globally
    treeDataManipulation = {};
    treeDataManipulation.findNodeById = findNodeById;
    treeDataManipulation.addChildNode = addChildNode;
    treeDataManipulation.addSiblingNodeBelow = addSiblingNodeBelow;
    treeDataManipulation.addSiblingNodeAbove = addSiblingNodeAbove;
    treeDataManipulation.addProperty = addProperty;
    treeDataManipulation.moveNodeUp = moveNodeUp;
    treeDataManipulation.moveNodeDown = moveNodeDown;
    treeDataManipulation.moveNodeToParentLevel = moveNodeToParentLevel;
    treeDataManipulation.deleteNode = deleteNode;
    treeDataManipulation.updateNodeData = updateNodeData;
    treeDataManipulation.createSubnodesFromTaskDivision =
        createSubnodesFromTaskDivision;
    treeDataManipulation.promptForTaskDivision = promptForTaskDivision;
    treeDataManipulation.getNewNode = getNewNode;
    window.AJ_GPT.treeDataManipulation = treeDataManipulation;
});
