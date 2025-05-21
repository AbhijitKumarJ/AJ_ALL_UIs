// This file contains functions for rendering the flowchart
$(function () {
    function renderFlowchart() {
        const flowchart = document.getElementById('flowchart');
        flowchart.innerHTML = '';
        createNode(window.AJ_GPT.taskTree, flowchart, null);
    }

    function createNode(node, parentElement, parentNode) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'task-node';
        nodeElement.innerHTML = `
            <div class="node-content">
                <span class="node-text">${node.text}</span>
                <div class="node-actions">
                    <i class="fas fa-edit action-icon" onclick="popupHandler.showEditNodeModal('${node.id}')" title="Edit"></i>
                    <i class="fas fa-trash action-icon" onclick="treeDataManipulation.deleteNode('${node.id}')" title="Delete"></i>
                    <i class="fas fa-code-branch action-icon" onclick="treeDataManipulation.promptForTaskDivision('${node.id}')" title="Subdivide with options"></i>
                    <i class="fas fa-sitemap action-icon" onclick="treeDataManipulation.createSubnodesFromTaskDivision('${node.id}', false)" title="Subdivide with default options"></i><br/>
                    <i class="fas fa-plus-circle action-icon" onclick="treeDataManipulation.addProperty('${node.id}')" title="Add Property"></i>
                    <i class="fas fa-plus action-icon" onclick="popupHandler.showAddNodeModal('${node.id}', 'Add_Child')" title="Add Child"></i>
                    <i class="fas fa-arrow-up action-icon" onclick="treeDataManipulation.moveNodeUp('${node.id}')" title="Move Up"></i>
                    <i class="fas fa-arrow-down action-icon" onclick="treeDataManipulation.moveNodeDown('${node.id}')" title="Move Down"></i>
                    <i class="fas fa-level-up-alt action-icon" onclick="treeDataManipulation.moveNodeToParentLevel('${node.id}')" title="Move to Parent Level"></i>
                    <i class="fas fa-arrow-circle-up action-icon" onclick="popupHandler.showAddNodeModal('${node.id}', 'Add_Sibling_Up')" title="Add Task Above"></i>
                    <i class="fas fa-arrow-circle-down action-icon" onclick="popupHandler.showAddNodeModal('${node.id}', 'Add_Sibling_Down')" title="Add Task Below"></i>
                </div>
            </div>
        `;
        if (node.properties) {
            const propertiesElement = document.createElement('div');
            propertiesElement.className = 'node-properties mt-2';
            for (const [key, value] of Object.entries(node.properties)) {
                propertiesElement.innerHTML += `<div><strong>${key}:</strong> ${value}</div>`;
            }
            nodeElement.appendChild(propertiesElement);
        }
        parentElement.appendChild(nodeElement);

        if (node.children && node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'node-children';
            node.children.forEach(childNode => createNode(childNode, childrenContainer, node));
            parentElement.appendChild(childrenContainer);
        }
    }

    // window.AJ_GPT.openSubdividePopup=function(nodeid){
    //     treeDataManipulation.createSubnodesFromTaskDivision(nodeid, false);
    // }
    // window.AJ_GPT.subdivideNodeDefault=function(nodeid){
    //     treeDataManipulation.promptForTaskDivision(nodeid);
    // }
    window.AJ_GPT.renderFlowchart = renderFlowchart;
});
