const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const listItem = document.createElement("li");
    listItem.textContent = taskText;

    taskList.appendChild(listItem);

    taskInput.value = "";
    taskInput.focus();
});
