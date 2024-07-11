// Tree manipulation functions using jQuery

$(document).ready(function () {
    let nodeCounter = 0;

    // Function to generate a unique ID
    function generateUniqueId() {
        nodeCounter++;
        return `node-${nodeCounter}`;
    }

    // Function to add a child node
    function addChildNode(parentId, text) {
        const newId = generateUniqueId();
        const newNode = {
            id: newId,
            text: text,
            children: [],
            properties: {},
        };

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
    function addSiblingNodeBelow(siblingId, text) {
        const newId = generateUniqueId();
        const newNode = {
            id: newId,
            text: text,
            children: [],
            properties: {},
        };

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
    function addSiblingNodeAbove(siblingId, text) {
        const newId = generateUniqueId();
        const newNode = {
            id: newId,
            text: text,
            children: [],
            properties: {},
        };

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
        for (let child of node.children) {
            const found = findNodeById(id, child);
            if (found) return found;
        }
        return null;
    }

    // Helper function to find the parent of a node
    function findParentNode(id, node = window.AJ_GPT.taskTree, parent = null) {
        console.log(node);
        if (node.id === id) {
            return parent;
        }
        for (let child of node.children) {
            const found = findParentNode(id, child, node);
            if (found) return found;
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

    // Mock API call for task division
    function mockApiCallForTaskDivision(task) {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock response
                resolve({
                    default: [
                        {
                            text: "Subtask 1 for " + task,
                            properties: { priority: "High" },
                        },
                        {
                            text: "Subtask 2 for " + task,
                            properties: { priority: "Medium" },
                        },
                        {
                            text: "Subtask 3 for " + task,
                            properties: { priority: "Low" },
                        },
                    ],
                    custom: [
                        {
                            text: "Custom Subtask A for " + task,
                            properties: { type: "Research" },
                        },
                        {
                            text: "Custom Subtask B for " + task,
                            properties: { type: "Implementation" },
                        },
                    ],
                });
            }, 1000); // 1 second delay to simulate API call
        });
    }

    // Function to create subnodes based on task division
    async function createSubnodesFromTaskDivision(
        nodeId,
        useCustomOption = false
    ) {
        var is_root = nodeId == "root";
        var parentNode = null;
        if (!is_root) {
            parentNode = findNodeById(nodeId);
            if (!parentNode) {
                console.error("Parent node not found");
                return false;
            }
        }

        try {
            const apiResponse = window.AJ_GPT.serverCalls.subDivideTask(
                parentNode.id,
                parentNode.text,
                parentNode.properties,
                function (response) {
                    //   alert(response.response)
                    resp_json = JSON.parse(response.data);
                    subtasks = resp_json["task_steps"];
                    subtasks.forEach((subtask) => {
                        const newChildId = addChildNode(
                            nodeId,
                            subtask.summary
                        );
                        if (newChildId) {
                            addProperty(
                                newChildId,
                                "taskDivisionType",
                                useCustomOption ? "custom" : "default"
                            );
                            // Object.entries(subtask.properties).forEach(
                            //     ([key, value]) => {
                            //         addProperty(newChildId, key, value);
                            //     }
                            // );
                        }
                    });

                    updateTreeView();
                },
                function (xhr, status, error) {}
            );
            // const subtasks = useCustomOption
            //     ? apiResponse.custom
            //     : apiResponse.default;

            return true;
        } catch (error) {
            console.error("Error in task division:", error);
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
    window.AJ_GPT.treeDataManipulation = treeDataManipulation;
});
