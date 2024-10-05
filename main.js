document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskTableBody = document.getElementById("taskTableBody");
  const notification = document.getElementById("notification");

  // Load tasks from localStorage
  loadTasks();

  // Add new task
  addTaskButton.addEventListener("click", () => {
    const taskValue = taskInput.value.trim();
    if (taskValue) {
      addTask(taskValue);
      taskInput.value = "";
      showNotification("Task added successfully!");
    }
  });

  function addTask(task) {
    const taskRow = document.createElement("tr");
    taskRow.innerHTML = `
            <td>${task}</td>
            <td class="status">Pending</td>
            <td>
                <button class="complete-button">Complete</button>
                <button class="delete-button">Delete</button>
            </td>
        `;

    // Event listeners for buttons
    taskRow.querySelector(".complete-button").addEventListener("click", () => {
      const statusCell = taskRow.querySelector(".status");
      statusCell.textContent = "Completed";
      taskRow.querySelector("td:first-child").classList.add("completed");
      showNotification("Task marked as completed!");
      saveTasks();
    });

    taskRow.querySelector(".delete-button").addEventListener("click", () => {
      taskRow.remove();
      showNotification("Task deleted successfully!");
      saveTasks();
    });

    taskTableBody.appendChild(taskRow);
    saveTasks();
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      addTask(task.name);
      if (task.completed) {
        const taskRow = taskTableBody.lastChild;
        taskRow.querySelector(".status").textContent = "Completed";
        taskRow.querySelector("td:first-child").classList.add("completed");
      }
    });
  }

  function addTask(task) {
    const taskRow = document.createElement("tr");
    taskRow.innerHTML = `
        <td>${task}</td>
        <td class="status">Pending</td>
        <td>
            <button class="edit-button">Edit</button>
            <button class="complete-button">Complete</button>
            <button class="delete-button">Delete</button>
        </td>
    `;

    // Event listener for "Complete" button
    taskRow.querySelector(".complete-button").addEventListener("click", () => {
      const statusCell = taskRow.querySelector(".status");
      statusCell.textContent = "Completed";
      taskRow.querySelector("td:first-child").classList.add("completed");
      showNotification("Task marked as completed!");
      saveTasks();
    });

    // Event listener for "Delete" button
    taskRow.querySelector(".delete-button").addEventListener("click", () => {
      taskRow.remove();
      showNotification("Task deleted successfully!");
      saveTasks();
    });

    // Event listener for "Edit" button
    taskRow.querySelector(".edit-button").addEventListener("click", () => {
      const taskCell = taskRow.querySelector("td:first-child");
      const taskText = taskCell.textContent;
      taskCell.innerHTML = `<input type="text" class="edit-input" value="${taskText}">`;

      const editInput = taskCell.querySelector(".edit-input");
      editInput.focus();

      // Save the edited task when the input loses focus or when pressing Enter
      editInput.addEventListener("blur", () => {
        saveEditedTask(taskRow, editInput.value);
      });
      editInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveEditedTask(taskRow, editInput.value);
        }
      });
    });

    taskTableBody.appendChild(taskRow);
    saveTasks();
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskTableBody tr").forEach((row) => {
      const taskName = row.querySelector("td:first-child").textContent;
      const status = row.querySelector(".status").textContent;
      tasks.push({
        name: taskName,
        completed: status === "Completed",
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove("hidden");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  }
});
