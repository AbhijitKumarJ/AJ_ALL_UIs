
$(function () {

    // Initialize modals and tree view when the document is ready
    var editNodeModal = new bootstrap.Modal(document.getElementById("editNodeModal"));

    var addNodeModal = new bootstrap.Modal(document.getElementById("addNodeModal"));
    
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
    window.AJ_GPT.popuphandler = popupHandler;
});
