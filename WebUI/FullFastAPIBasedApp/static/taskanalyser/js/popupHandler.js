// This file contains functions for handling the subdivision popup

// let currentSubdivideNodeId = null;

// function openSubdividePopup(nodeId) {
//     currentSubdivideNodeId = nodeId;
//     document.getElementById('subdividePopup').style.display = 'block';
// }

// function closeSubdividePopup() {
//     document.getElementById('subdividePopup').style.display = 'none';
//     currentSubdivideNodeId = null;
// }

// function handleSubdivideSubmit() {
//     const option1 = document.getElementById('subdivideOption1').value;
//     const option2 = document.getElementById('subdivideOption2').value;
//     subdivideNode(currentSubdivideNodeId, { option1, option2 });
//     closeSubdividePopup();
// }

// // Add event listeners for popup buttons
// document.getElementById('subdivideSubmit').addEventListener('click', handleSubdivideSubmit);
// document.getElementById('subdivideCancel').addEventListener('click', closeSubdividePopup);

$(function () {
    // Global variables to store modal instances
    var editNodeModal, addNodeModal;

    // Initialize modals and tree view when the document is ready
    editNodeModal = new bootstrap.Modal(
        document.getElementById("editNodeModal")
    );
    addNodeModal = new bootstrap.Modal(document.getElementById("addNodeModal"));
    // // Function to render the tree view
    // function renderTreeView() {
    //     const treeHtml = generateTreeHtml(treeData);
    //     $('#treeView').html(treeHtml);
    // }

    // // Recursive function to generate HTML for the tree
    // function generateTreeHtml(node) {
    //     let html = `<div class="ms-3">
    //         <span>${node.text}</span>
    //         <button class="btn btn-sm btn-outline-primary" onclick="showEditNodeModal('${node.id}')">Edit</button>
    //         <button class="btn btn-sm btn-outline-success" onclick="showAddNodeModal('${node.id}')">Add Child</button>
    //     `;
    //     if (node.children && node.children.length > 0) {
    //         html += node.children.map(child => generateTreeHtml(child)).join('');
    //     }
    //     html += '</div>';
    //     return html;
    // }

    // Function to show the edit node modal
    function showEditNodeModal(nodeId) {
        const node = treeDataManipulation.findNodeById(nodeId);
        if (node) {
            $("#editNodeId").val(nodeId);
            $("#editNodeText").val(node.text);
            $("#editNodeProperties").val(
                JSON.stringify(node.properties, null, 2)
            );
            editNodeModal.show();
        }
    }

    // Function to save edited node
    function saveEditNode() {
        const nodeId = $("#editNodeId").val();
        const newText = $("#editNodeText").val();
        let newProperties;

        try {
            newProperties = JSON.parse($("#editNodeProperties").val());
        } catch (e) {
            alert("Invalid JSON in properties");
            return;
        }

        if (
            treeDataManipulation.updateNodeData(nodeId, newText, newProperties)
        ) {
            editNodeModal.hide();
        }
    }

    let add_type = "";
    // Function to show the add node modal
    function showAddNodeModal(parentId = "", addType) {
        add_type = addType;

        $("#addNodeParent").val(parentId);
        addNodeModal.show();
    }

    // Function to save new node
    function saveAddNode() {
        const parentId = $("#addNodeParent").val();
        const newText = $("#addNodeText").val();
        let newProperties;
        try {
            newProperties = JSON.parse($("#addNodeProperties").val());
        } catch (e) {
            alert("Invalid JSON in properties");
            return;
        }

        if (add_type == "Add_Child") {
            const newNodeId = treeDataManipulation.addChildNode(
                parentId,
                newText
            );
            if (newNodeId) {
                treeDataManipulation.updateNodeData(
                    newNodeId,
                    null,
                    newProperties
                );
                addNodeModal.hide();
                add_type = "";
                //renderTreeView();
            }
        } else if (add_type == "Add_Sibling_Up") {
            const newNodeId = treeDataManipulation.addSiblingNodeAbove(
                parentId,
                newText
            );
            if (newNodeId) {
                treeDataManipulation.updateNodeData(
                    newNodeId,
                    null,
                    newProperties
                );
                addNodeModal.hide();
                add_type = "";
                //renderTreeView();
            }
        } else if (add_type == "Add_Sibling_Down") {
            const newNodeId = treeDataManipulation.addSiblingNodeBelow(
                parentId,
                newText
            );
            if (newNodeId) {
                treeDataManipulation.updateNodeData(
                    newNodeId,
                    null,
                    newProperties
                );
                addNodeModal.hide();
                add_type = "";
                //renderTreeView();
            }
        }
    }

    $("#btnSaveAddNode").on("click", saveAddNode);

    $("#btnSaveEditNode").on("click", saveEditNode);

    //renderTreeView();
    popupHandler = {};
    popupHandler.showAddNodeModal = showAddNodeModal;
    popupHandler.showEditNodeModal = showEditNodeModal;
    window.popuphandler = popupHandler;
});
