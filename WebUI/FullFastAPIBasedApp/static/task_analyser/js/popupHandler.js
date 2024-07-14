$(document).ready(function () {
    const modal = new bootstrap.Modal(document.getElementById("authModal"));

    $("#lnkLogin,#openAuthModal").click(() => modal.show());

    $("#toggleRegister").click(function () {
        isRegistering = !isRegistering;
        $("#personaField").toggleClass("hidden");
        $(this).text(
            window.AJ_GPT.userData.isRegistering
                ? "Already registered? Log in"
                : "Not registered? Sign up"
        );
        $("#authModalLabel").text(
            window.AJ_GPT.userData.isRegistering
                ? "Registration"
                : "Authentication"
        );
    });

    function updateLoggedInUIState() {
        if (window.AJ_GPT.userData.isLoggedIn) {
            $("#divLoggedIn").removeClass("hidden");
            $("#divNotLoggedIn").addClass("hidden");

            $('#txtCurrentProject').val(window.AJ_GPT.userData.projectName);
            $('#txtCurrentProjectDesc').val(window.AJ_GPT.userData.projectDesc);
            $('#taskInput').val(window.AJ_GPT.userData.projectDesc);
        } else {
            $("#divLoggedIn").addClass("hidden");
            $("#divNotLoggedIn").removeClass("hidden");
            $('#txtCurrentProject').val('');
            $('#txtCurrentProjectDesc').val('');
            $('#taskInput').val('');
        }
    }

    function populateTopics(topics) {
        $("#ddlTopic").empty();

        topics.forEach((topic) => {
            $("#ddlTopic").append(
                `<option value="${topic.id.toString()}">${
                    topic.topic_name
                }</option>`
            );
        });

        $("#ddlTopic")[0].selectedIndex = 0;
    }

    function populateSubTopics(subTopics, topicId) {
        $("#ddlSubTopic").empty();

        $("#ddlSubTopic").append(
            `<option value="${subTopics[0].id.toString()}">${
                subTopics[0].sub_topic_name
            }</option>`
        );

        if (topicId > 0) {
            let filteredSubTopics = subTopics.filter(
                (x) => x.topic_id == topicId
            );
            for (let index = 0; index < filteredSubTopics.length; index++) {
                $("#ddlSubTopic").append(
                    `<option value="${filteredSubTopics[
                        index
                    ].id.toString()}">${
                        filteredSubTopics[index].sub_topic_name
                    }</option>`
                );
            }
        }

        $("#ddlSubTopic")[0].selectedIndex = 0;
    }

    function populateUserProjects(userProjects, subTopicId) {
        $("#ddlUserProject").empty();

        $("#ddlUserProject").append(
            `<option value="0"> ---Select--- </option>`
        );

        if (subTopicId > 0) {
            let filteredUserProjects = userProjects.filter(
                (x) => x.sub_topic_id == subTopicId
            );
            for (let index = 0; index < filteredUserProjects.length; index++) {
                $("#ddlUserProject").append(
                    `<option value="${filteredUserProjects[
                        index
                    ].id.toString()}">${
                        filteredUserProjects[index].project_name
                    }</option>`
                );
            }
        }

        $("#ddlUserProject")[0].selectedIndex = 0;
    }


    $("#loginForm").submit(function (e) {
        e.preventDefault();

        let userName = $("#username").val();
        let password = $("#password").val();
        let userPersona = $("#persona").val() || window.AJ_GPT.userData.userPersona;

        if (window.AJ_GPT.userData.isRegistering) {
            console.log("Registering:", { username, password, persona });
            registerUser(userName, password, userPersona);
        } else {
            console.log("Logging in:", { username, password });
            loginUser(userName, password);
        }
    });
    
    $("#ddlTopic").on("change", function () {
        let selected_topic_id = parseInt($("#ddlTopic").val() ?? "0");
        populateSubTopics(window.AJ_GPT.subTopics, selected_topic_id);
        window.AJ_GPT.userData.topicName = $("#ddlTopic")[0].selectedOptions[0].text;
    });

    $("#ddlSubTopic").on("change", function () {
        let selected_sub_topic_id = parseInt(
            $("#ddlSubTopic").val() ?? "0"
        );
        populateUserProjects(
            window.AJ_GPT.userData.userProjects,
            selected_sub_topic_id
        );
        window.AJ_GPT.userData.subTopicName = $("#ddlSubTopic")[0].selectedOptions[0].text;
    });

    $("#ddlUserProject").on("change", function () {
        let selectedOption=$("#ddlUserProject")[0].selectedOptions[0];

        let elUserProject$=$('#txtUserProject');
        let elUserProjectDesc$=$('#txtUserProjectDesc');

        if(selectedOption.value=='0')
            {
                window.AJ_GPT.userData.projectId=0;
                window.AJ_GPT.userData.projectName = "";
                window.AJ_GPT.userData.projectDesc="";
                elUserProject$.val('');
                elUserProjectDesc$.val('');

                elUserProject$.attr('readonly', false);
                elUserProjectDesc$.attr('readonly', false);
            }
            else
            {
                window.AJ_GPT.userData.projectId=parseInt(selectedOption.value);
                selectedProject=
                window.AJ_GPT.userData.userProjects.filter(x=>x.id==window.AJ_GPT.userData.projectId)[0];
                window.AJ_GPT.userData.projectName = selectedProject.project_name;
                window.AJ_GPT.userData.projectDesc=selectedProject.project_desc;

                elUserProject$.val(window.AJ_GPT.userData.projectName);
                elUserProjectDesc$.val(window.AJ_GPT.userData.projectDesc);

                elUserProject$.attr('readonly', true);
                elUserProjectDesc$.attr('readonly', true);
            }
    });

    $("#startSession").click(function () {
        var selectedTopic = parseInt($("#ddlTopic").val());
        var selectedSubTopic = parseInt($("#ddlSubTopic").val());
        var selectedProject = parseInt($("#ddlUserProject").val());
        var newProject = $("#txtUserProject").val().trim();
        var newProjectDesc = $("#txtUserProjectDesc").val().trim();
        if (selectedProject == 0) {
            if (newProject == "") {
                alert("Please select a project or give a new project name");
                return;
            }
            window.AJ_GPT.userData.projectName=newProject;
            window.AJ_GPT.userData.projectDesc=newProjectDesc;            
        }
        var session_name = $("#txtUserSession").val().trim();
        if (session_name) {
            console.log("Starting session :", session_name);
            // Here you would typically send a request to your server to start a new session
            createSession(
                window.AJ_GPT.userData.userId,
                selectedTopic,
                selectedSubTopic,
                selectedProject,
                newProject,
                newProjectDesc,
                session_name
            );
        } else {
            alert("Please enter a purpose for this session");
        }
    });

    function onLoginSuccess(response) {
        window.AJ_GPT.userData.isLoggedIn = true;
        window.AJ_GPT.userData.userId = response.data.id;
        window.AJ_GPT.userData.userName = response.data.username;
        window.AJ_GPT.userData.userPersona = response.data.persona;

        // Simulated successful authentication
        $("#loginForm").addClass("hidden");
        $("#topicSelection").removeClass("hidden");

        populateTopics(window.AJ_GPT.topics);

        populateSubTopics(window.AJ_GPT.subTopics, 0);

        getUserProjects();

        getUserSessions();
    }


    function getUserProjects() {
        window.AJ_GPT.serverCalls.getUserProjects(
            window.AJ_GPT.userData.userId,
            function (response) {
                if (response.status === "success") {
                    console.log("projects:", response.data);
                    window.AJ_GPT.userData.userProjects = response.data;
                } else {
                    alert("Error: " + response.message);
                }
            },
            function () {
                alert("Failed: " + response.message);
            }
        );
    }

    function getUserSessions() {
        window.AJ_GPT.serverCalls.getUserSessions(
            window.AJ_GPT.userData.userId,
            function (response) {
                if (response.status === "success") {
                    console.log("sessions:", response.data);
                    window.AJ_GPT.userData.userSessions = response.data.db;
                } else {
                    alert("Error: " + response.message);
                }
            },
            function () {
                alert("Failed: " + response.message);
            }
        );
    }

    function onSessionStart(response) {
        window.AJ_GPT.userData.sessionId = response.data.id;
        window.AJ_GPT.userData.sessionName=response.data.Session_Name
        window.AJ_GPT.userData.sessionDesc=response.data.Session_Folder
        window.AJ_GPT.userData.projectId = response.data.project_id;
        window.AJ_GPT.userData.topicId = response.data.topic_id;
        window.AJ_GPT.userData.subTopicId = response.data.sub_topic_id;
        
        selectedSubTopics=window.AJ_GPT.subTopics.filter(x=>x.id==window.AJ_GPT.userData.subTopicId);
        console.log(selectedSubTopics);

        window.AJ_GPT.userData.taskType=selectedSubTopics[0].task_type;
        // window.AJ_GPT.userData.projectName = response.data.project_name;
        // window.AJ_GPT.userData.projectDesc = response.data.project_desc;

        modal.hide();

        updateLoggedInUIState();
    }


    function loginUser(userName, password) {
        window.AJ_GPT.serverCalls.login_user(
            userName,
            password,
            function (response) {
                if (response.status === "success") {
                    //alert("Login successful!");
                    console.log("User data:", response.data);
                    onLoginSuccess(response);
                } else {
                    alert("Login failed: " + response.message);
                }
            },
            function () {}
        );
    }

    function registerUser(userName, password, userPersona) {
        window.AJ_GPT.serverCalls.register_user(
            userName,
            password,
            userPersona,
            function (resp) {
                if (response.status === "success") {
                    alert("Registration successful!");
                    console.log("User data:", response.data);
                    onLoginSuccess(response);
                } else {
                    alert("Registration failed: " + response.message);
                }
            },
            function () {
                alert("Registration failed: " + response.message);
            }
        );
    }

    function createSession(
        user_id,
        selectedTopic,
        selectedSubTopic,
        selectedProject,
        newProject,
        newProjectDesc,
        session_name
    ) {
        window.AJ_GPT.serverCalls.createSession(
            user_id,
            selectedTopic,
            selectedSubTopic,
            selectedProject,
            newProject,
            newProjectDesc,
            session_name,
            function (response) {
                if (response.status === "success") {
                    alert("Session created successful!");
                    console.log("User Session data:", response.data);
                    onSessionStart(response);
                } else {
                    alert("Session creation failed: " + response.message);
                }
            },
            function () {}
        );
    }

});
