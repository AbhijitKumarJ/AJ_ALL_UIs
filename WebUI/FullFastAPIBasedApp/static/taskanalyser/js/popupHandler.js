$(document).ready(function () {
    const modal = new bootstrap.Modal(document.getElementById("authModal"));
    let isRegistering = false;
    let isLoggedIn = false;
    let user_id=1;
    let persona="Programmer";
    $("#lnkLogin,#openAuthModal").click(() => modal.show());

    $("#toggleRegister").click(function () {
        isRegistering = !isRegistering;
        $("#personaField").toggleClass("hidden");
        $(this).text(
            isRegistering
                ? "Already registered? Log in"
                : "Not registered? Sign up"
        );
        $("#authModalLabel").text(
            isRegistering ? "Registration" : "Authentication"
        );
    });

    function updateLoggedInUIState() {
        if (isLoggedIn) {
            $("#divLoggedIn").removeClass("hidden");
            $("#divNotLoggedIn").addClass("hidden");
        } else {
            $("#divLoggedIn").addClass("hidden");
            $("#divNotLoggedIn").removeClass("hidden");
        }
    }

    $("#loginForm").submit(function (e) {
        e.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        persona = $("#persona").val() || persona;

        // Simulated authentication
        if (isRegistering) {
            console.log("Registering:", { username, password, persona });
            window.serverCalls.register(username, password, persona, function(resp){

            }, function(){
                
            });
            // Here you would typically send a registration request to your server
        } else {
            console.log("Logging in:", { username, password });
            if (username == "a" && password == "a") {
                isLoggedIn = true;

                window.serverCalls.login(username, password, function(response){
                    if (response.status === "success") {
                        alert('Login successful!');
                        console.log('User data:', response.data);
                        user_id=response.data.id,
                        persona=response.data.persona
                    } else {
                        alert('Login failed: ' + response.message);
                    }
                }, function(){

                });

                // Simulated successful authentication
                $('#loginForm').addClass('hidden');
                $("#topicSelection").removeClass("hidden");

                // Simulated topic fetching
                setTimeout(() => {
                    // const topics = [
                    //     "Create an html, jquery, css based front end for an ecommerce website", 
                    //     "Create a FastAPI implementation to handle login, transactions,reports management for ecommerce website", 
                    //     "Create an angular front end for for an ecommerce website."];
                
                    const topics = [
                        {id:1, topic_name:"General"},
                        {id:2, topic_name:"Web application"}, 
                        {id:3, topic_name:"Native desktop application"}, 
                        {id:4, topic_name:"Native mobile application"},
                        {id:5, topic_name:"Hybrid mobile application"}
                    ];
                        
                    $("#topicDropdown").empty();
                    topics.forEach((topic) => {
                        $("#topicDropdown").append(
                            `<option value="${topic.id.toString()}">${topic.topic_name}</option>`
                        );
                    });
                    // $("#topicDropdown").prepend(
                    //     '<option value="0" selected>Choose a topic</option>'
                    // );
                }, 1000);
            } else {
                window.alert("In correct credentials");
            }
            // Here you would typically send a login request to your server
        }
    });

    $("#startSession").click(function () {
        const selectedTopic = $("#topicDropdown").val();
        const newTopic = $("#newTopic").val();
        const topic = selectedTopic || newTopic;
        var session_name="test session";
        if (topic) {
            console.log("Starting session with topic:", topic);
            // Here you would typically send a request to your server to start a new session
            window.serverCalls.createSession(user_id, parseInt(topic), session_name, function(resp){

            }, function(){
                
            });
            modal.hide();
            updateLoggedInUIState();
        } else {
            alert("Please select a topic");
        }
    });
});

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
