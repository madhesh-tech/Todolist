let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Add Task
function addTask() {

    const input = document.getElementById("taskInput");
    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    const title = input.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        category: category,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    input.value = "";
    document.getElementById("dueDate").value = "";

    displayTasks();
}


// Display Tasks
function displayTasks() {

    const list = document.getElementById("taskList");
    const empty = document.getElementById("emptyMessage");

    const search =
        document.getElementById("searchInput").value.toLowerCase();

    const filter =
        document.getElementById("filter").value;

    const sort =
        document.getElementById("sort").value;

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(search);

        if (!matchesSearch) return false;

        if (filter === "pending")
            return !task.completed;

        if (filter === "completed")
            return task.completed;

        if (filter === "high")
            return task.priority === "High";

        return true;
    });


    // Sorting

    if (sort === "newest") {
        filteredTasks.sort((a, b) => b.id - a.id);
    }

    if (sort === "oldest") {
        filteredTasks.sort((a, b) => a.id - b.id);
    }

    if (sort === "priority") {

        const priorityValue = {
            "High": 3,
            "Medium": 2,
            "Low": 1
        };

        filteredTasks.sort(
            (a, b) =>
                priorityValue[b.priority] -
                priorityValue[a.priority]
        );
    }


    list.innerHTML = "";

    if (filteredTasks.length === 0) {
        empty.style.display = "block";
    } else {
        empty.style.display = "none";
    }


    filteredTasks.forEach(task => {

        const div = document.createElement("div");

        div.className =
            "task " +
            (task.completed ? "completed" : "");

        let dateText = task.dueDate
            ? `📅 ${task.dueDate}`
            : "📅 No deadline";

        div.innerHTML = `

            <input
                type="checkbox"
                class="check"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-content">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-info">

                    <span class="badge">
                        ${task.category}
                    </span>

                    <span class="badge ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>

                    <span class="badge">
                        ${dateText}
                    </span>

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="action-btn edit"
                    onclick="editTask(${task.id})">
                    ✏️
                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteTask(${task.id})">
                    🗑️
                </button>

            </div>
        `;

        list.appendChild(div);
    });

    updateStats();
}


// Complete Task

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    displayTasks();
}


// Delete Task

function deleteTask(id) {

    if (!confirm("Delete this task?")) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}


// Edit Task

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newTitle =
        prompt("Edit your task:", task.title);

    if (newTitle === null) return;

    if (newTitle.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    task.title = newTitle.trim();

    saveTasks();
    displayTasks();
}


// Clear Completed

function deleteCompleted() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    displayTasks();
}


// Statistics

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending =
        total - completed;

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("progress").textContent =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "%";

    document.getElementById("progressBar").style.width =
        percentage + "%";
}


// Local Storage

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// Dark Mode

document.getElementById("themeBtn").onclick = function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        this.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        this.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
};


// Load Theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    document.getElementById("themeBtn").textContent = "☀️";
}


// Initial Display

displayTasks();