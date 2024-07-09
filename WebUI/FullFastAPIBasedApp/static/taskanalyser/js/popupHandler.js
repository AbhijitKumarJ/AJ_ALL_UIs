$(document).ready(function () {
    const modal = new bootstrap.Modal(document.getElementById("authModal"));
    var isRegistering = false;
    var isLoggedIn = false;
    var user_id=0;
    var topic_id=0;
    var sub_topic_id=0;
    var project_id=0;
    var project_name="";
    var project_desc="";

    const topics = [
        { id: 1, topic_name: "General" },
        { id: 2, topic_name: "Web Application UI" },
        { id: 3, topic_name: "Rest API" },
        { id: 4, topic_name: "Database" },
        { id: 5, topic_name: "Native desktop application" },
        { id: 6, topic_name: "Native mobile application" },
        { id: 7, topic_name: "Hybrid mobile application" },
    ];

    const subTopics = [
        { id: 1, topic_id:1, sub_topic_name: "General" },
        { id: 2, topic_id:2, sub_topic_name: "Angular Web Application UI" },
        { id: 3, topic_id:2, sub_topic_name: "React Web Application UI" },
        { id: 4, topic_id:2, sub_topic_name: "Jquery bootstrap Web Application UI" },
        { id: 5, topic_id:3, sub_topic_name: "Python FastAPI" },
        { id: 6, topic_id:3, sub_topic_name: ".Net Web API" },
        { id: 7, topic_id:3, sub_topic_name: "Nodejs API" },
        { id: 8, topic_id:4, sub_topic_name: "sqlite" },
        { id: 9, topic_id:4, sub_topic_name: "mysql" },
        { id: 10, topic_id:5, sub_topic_name: "Tkinter Native desktop application" },
        { id: 11, topic_id:6, sub_topic_name: "General Native mobile application" },
        { id: 12, topic_id:7, sub_topic_name: "General Hybrid mobile application" }
    ];


    var userProjects = [
        // { 
        //     id: 1, 
        //     sub_topic_id:2, 
        //     project_name: "Modern Web App for an Ecommerce website with login, orders and billing",
        //     project_description:`Need to create a modern looking web application user interface for an ecommerce website. 
        //     This site should have a landing page that shows the company purpose and ways to login and register for customers.
        //     Also, on login it should redirect to customer specific dashboard where he or she can see running orders, completed orders, wishlist, cart etc.
        //     `
        //  },
        //  { 
        //     id: 2, 
        //     sub_topic_id:3, 
        //     project_name: "Modern Web App for an Hotel booking website with login, bookings and billing",
        //     project_description:`Need to create a modern looking web application user interface for a  hotel booking website. 
        //     This site should have a landing page that shows our enterprize purpose with some lucrative views and ways to login and register for customers.
        //     Also, on login it should redirect to customer specific dashboard where he or she can see current bookings, past bookings, suggested hotels etc.
        //     `
        //  }
    ];

    var userSessions=[];


    var persona="Programmer";

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

    function onLoginSuccess(response) {
        isLoggedIn = true;

        user_id = response.data.id;
        persona = response.data.persona;

        // Simulated successful authentication
        $("#loginForm").addClass("hidden");
        $("#topicSelection").removeClass("hidden");

        // const topics = [
        //     "Create an html, jquery, css based front end for an ecommerce website",
        //     "Create a FastAPI implementation to handle login, transactions,reports management for ecommerce website",
        //     "Create an angular front end for for an ecommerce website."];


        $("#ddlTopic").empty();
        topics.forEach((topic) => {
            $("#ddlTopic").append(
                `<option value="${topic.id.toString()}">${
                    topic.topic_name
                }</option>`
            );
        });
        $("#ddlTopic")[0].selectedIndex=0;

        $("#ddlSubTopic").empty();
        $("#ddlSubTopic").append(
            `<option value="${subTopics[0].id.toString()}">${
                subTopics[0].sub_topic_name
            }</option>`
        );
        $("#ddlSubTopic")[0].selectedIndex=0;

        $("#ddlTopic").on('change', function(){
            $("#ddlSubTopic").empty();
            let selected_topic_id=parseInt($("#ddlTopic").val());
            subTopics.filter(x=>x.topic_id==selected_topic_id).forEach((subtopic) => {
                $("#ddlSubTopic").append(
                    `<option value="${subtopic.id.toString()}">${
                        subtopic.sub_topic_name
                    }</option>`
                );
            });
            $("#ddlSubTopic")[0].selectedIndex=0;
        })

        $("#ddlSubTopic").on('change', function(){
            $("#ddlUserProject").empty();
            $("#ddlUserProject").append(
                `<option value="0"> --- </option>`
            );
            let selected_sub_topic_id=parseInt($("#ddlSubTopic").val());
            userProjects.filter(x=>x.sub_topic_id==selected_sub_topic_id).forEach((project) => {
                $("#ddlUserProject").append(
                    `<option value="${project.id.toString()}">${
                        project.project_name
                    }</option>`
                );
            });
            $("#ddlUserProject")[0].selectedIndex=0;
        });

        window.serverCalls.getUserProjects(user_id, function(response){
            if (response.status === "success") {
                console.log("projects:", response.data);
                userProjects=response.data;
            }
            else{
                alert("Error: " + response.message);
            }

        }, function(){
            alert("Failed: " + response.message);
        });
        
        window.serverCalls.getUserSessions(user_id, function(response){
            if (response.status === "success") {
                console.log("sessions:", response.data);
                userSessions=response.data.db;
            }
            else{
                alert("Error: " + response.message);
            }

        }, function(){
            alert("Failed: " + response.message);
        });
    }

    function onSessionStart(response){
        project_id=response.data.id;
        topic_id=response.data.topic_id;
        sub_topic_id=response.data.sub_topic_id;
        project_name=response.data.project_name;
        project_desc=response.data.project_desc;
        modal.hide();
        updateLoggedInUIState();
    }

    $("#loginForm").submit(function (e) {
        e.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        persona = $("#persona").val() || persona;

        // Simulated authentication
        if (isRegistering) {
            console.log("Registering:", { username, password, persona });
            window.serverCalls.register_user(username, password, persona, function(resp){
                if (response.status === "success") {
                    alert("Registration successful!");
                    console.log("User data:", response.data);
                    onLoginSuccess(response);
                }
                else{
                    alert("Registration failed: " + response.message);
                }

            }, function(){
                alert("Registration failed: " + response.message);
            });
            // Here you would typically send a registration request to your server
        } else {
            console.log("Logging in:", { username, password });

            window.serverCalls.login_user(
                username,
                password,
                function (response) {
                    if (response.status === "success") {
                        //alert("Login successful!");
                        console.log("User data:", response.data);
                        onLoginSuccess(response)
                    } else {
                        alert("Login failed: " + response.message);
                    }
                },
                function () {}
            );
        }
    });

    $("#startSession").click(function () {
        var selectedTopic = parseInt($("#ddlTopic").val());       
        var selectedSubTopic = parseInt($("#ddlSubTopic").val());
        var selectedProject = parseInt($("#ddlUserProject").val());
        var newProject = $("#txtUserProject").val().trim();
        var newProjectDesc=$('#txtUserProjectDesc').val();
        if (selectedProject == 0) {
            if (newProject == "") {
                alert("Please select a project or give a new project name");
                return;
            }
        }
        var session_name= $("#txtUserSession").val().trim();
        if (session_name) {
            console.log("Starting session :", session_name);
            // Here you would typically send a request to your server to start a new session
            window.serverCalls.createSession(
                user_id, 
                selectedTopic,
                selectedSubTopic,
                selectedProject,
                newProject,
                newProjectDesc,
                session_name, 
                function(response){
                    if (response.status === "success") {
                        alert("Session created successful!");
                        console.log("User Session data:", response.data);
                        onSessionStart(response)
                    } else {
                        alert("Session creation failed: " + response.message);
                    }
                }, 
                function(){}
            );
        } else {
            alert("Please enter a purpose for this session");
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
