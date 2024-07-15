window.AJ_GPT = {};

window.AJ_GPT.taskTree = { id: "root", text: "", desc: "", children: [], properties: {} };

var userProjects = [
    // {
    //     id: 0,
    //     user_id:0,
    //     topic_id:0,
    //     sub_topic_id:0,
    //     project_name: "",
    //     project_desc: "",
    // }

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

window.AJ_GPT.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") ?? '{"id":0,"":"Guest", "persona":"Default"}');
// {
//     "persona": "Programmer",
//     "id": 1,
//     "username": "a"
//   }

window.AJ_GPT.userData = {
    isRegistering: false,
    isLoggedIn: window.AJ_GPT.loggedInUser.id>0,
    userId: window.AJ_GPT.loggedInUser.id,
    userName: window.AJ_GPT.loggedInUser.username,
    userPersona: window.AJ_GPT.loggedInUser.persona,
    userProjects: userProjects,
    userSessions: [],
    topicId: 0,
    topicName:"",
    subTopicId: 0,
    subTopicName:"",
    projectId: 0,
    projectName: "",
    projectDesc: "",
    taskType: [],
};

window.AJ_GPT.topics = [
    { id: 0, topic_name: " ---Select--- " },
    { id: 1, topic_name: "General" },
    { id: 2, topic_name: "Web Application UI" },
    { id: 3, topic_name: "Rest API" },
    { id: 4, topic_name: "Database" },
    { id: 5, topic_name: "Native desktop application" },
    { id: 6, topic_name: "Native mobile application" },
    { id: 7, topic_name: "Hybrid mobile application" },
];

window.AJ_GPT.subTopics = [
    { id: 0, topic_id: 0, sub_topic_name: " ---Select--- " , task_type:[]},
    { id: 1, topic_id: 1, sub_topic_name: "General", task_type:['General'] },
    { id: 2, topic_id: 2, sub_topic_name: "Angular Web Application UI", task_type:['UI','Angular'] },
    { id: 3, topic_id: 2, sub_topic_name: "React Web Application UI", task_type:['UI','React'] },
    {
        id: 4,
        topic_id: 2,
        sub_topic_name: "Jquery bootstrap Web Application UI", task_type:['UI','JQuery'],
    },
    { id: 5, topic_id: 3, sub_topic_name: "Python FastAPI", task_type:['API','Python','FastAPI'] },
    { id: 6, topic_id: 3, sub_topic_name: ".Net Web API", task_type:['API','CSharp','WebAPI'] },
    { id: 7, topic_id: 3, sub_topic_name: "Nodejs API", task_type:['API','NodeJs','API'] },
    { id: 8, topic_id: 4, sub_topic_name: "sqlite", task_type:['DB','Sqlite'] },
    { id: 9, topic_id: 4, sub_topic_name: "mysql", task_type:['DB','MySql'] },
    {
        id: 10,
        topic_id: 5,
        sub_topic_name: "Tkinter Native desktop application",
        task_type:[]
    },
    {
        id: 11,
        topic_id: 6,
        sub_topic_name: "General Native mobile application", 
        task_type:[]
    },
    {
        id: 12,
        topic_id: 7,
        sub_topic_name: "General Hybrid mobile application",
        task_type:[]
    },
];
