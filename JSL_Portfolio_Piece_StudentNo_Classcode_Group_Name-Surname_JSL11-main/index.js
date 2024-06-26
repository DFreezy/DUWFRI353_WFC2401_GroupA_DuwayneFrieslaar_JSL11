//✅ import helper functions from utils
//✅ import initialData

import {
  getTasks,
  createNewTask,
  patchTask,
  putTask,
  deleteTask,
} from "./utils/taskFunctions.js";
import { initialData } from "./initialData.js";

/*************************************************************************************************************************************************
 * FIXED BUGS ✅
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(initialData));
    localStorage.setItem("showSideBar", "true");
  } else {
    console.log("Data already exists in localStorage");
  }
}
initializeData();

//✅ Get elements from the DOM
const elements = {
  // Navigation Sidebar elements
  sideModal: document.querySelector(".side-bar"),
  boardsLinks: document.getElementById("boards-nav-links-div"),
  themeChanger: document.getElementById("switch"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  headerBoardName: document.getElementById("header-board-name"),
  columnDivs: document.querySelectorAll(".column-div"),
  filterDiv: document.getElementById("filterDiv"),
  createNewTaskBtn: document.getElementById("add-new-task-btn"),
  modalWindow: document.getElementById("new-task-modal-window"),
  editTaskModal: document.querySelector(".edit-task-modal-window"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  deleteTaskBtn: document.getElementById("delete-task-btn"),
};

let activeBoard = "";

// Extracts unique board names from tasks
//✅ FIX BUGS
//////////////////////////////////////////////////////FETCH&DISPLAYBOARDSANDTASKSFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard : boards[0];
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
//✅ Fix Bugs
///////////////////////////////////////////////////DISPLAYBOARDSFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function displayBoards(boards) {
  const boardsLink = document.getElementById("boards-nav-links-div");
  boardsLink.innerHTML = ""; // Clears the container
  boards.forEach((board) => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {
      // Use 'addEventListener' to attach click event listener
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; // Corrected assignment syntax
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsLink.appendChild(boardElement);
  });
}

// Filters tasks corresponding to the board name and displays them on the DOM.
//✅ Fix Bugs
////////////////////////////////////////////////FILTERANDDISPLAYTASKSBYBOARDFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task) => task.board === boardName); // Use strict equality operator '===' instead of assignment '='

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks
      .filter((task) => task.status === status)
      .forEach((task) => {
        // Use strict equality operator '===' instead of assignment '='
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-div");
        taskElement.textContent = task.title;
        taskElement.setAttribute("data-task-id", task.id);

        // Listen for a click event on each task and open a modal
        taskElement.addEventListener("click", () => {
          // Use 'addEventListener' instead of 'click' and remove '=>' arrow function
          openEditTaskModal(task);
        });

        tasksContainer.appendChild(taskElement);
      });
  });
}
///////////////////////////////////////////////REFRESHTASKUIFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
//✅ Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach((btn) => {
    if (btn.textContent === boardName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}
///////////////////////////////////////////////////ADDTASKTOUI\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function addTaskToUI(task) {
  const column = document.querySelector(
    '.column-div[data-status="${task.status}"]'
  );
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    console.warn(
      `Tasks container not found for status: ${task.status}, creating one.`
    );
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute("data-task-id", task.id);

  tasksContainer.appendChild(taskElement);
}
///////////////////////////////////////////////////SETUPEVENTLISTENER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  cancelEditBtn.addEventListener("click", () =>
    toggleModal(false, elements.editTaskModal)
  );

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  cancelAddTaskBtn.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeChanger.addEventListener("change", toggleTheme);
 

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener("click", () => {
    toggleModal(true);
    elements.filterDiv.style.display = "block"; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener("submit", (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
//✅ Fix bugs
///////////////////////////////////////////TOGGLEMODALFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none"; // ✅Fixed ternary operator syntax
}

/*************************************************************************************************************************************************
 *✅ COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/
////////////////////////////////////////////////ADDTASKFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function addTask(event) {
  event.preventDefault();

  //✅ Assign user input to the task object
  const task = {
    title: document.getElementById("title-input").value,
    description: document.getElementById("desc-input").value,
    status: document.getElementById("select-status").value,
  };

  const newTask = createNewTask(task);
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    newTask.board = activeBoard;
    initialData.push(newTask);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
    localStorage.setItem('tasks',JSON.stringify(initialData))
    refreshTasksUI();
  }
}
/////////////////////////////////////////////////////togglesidebarfunction\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function toggleSidebar(show) {
  if (show) {
    // console.log("show sidebar button clicked");
    elements.sideModal.style.display = "block"; // Display the sidebar
    elements.showSideBarBtn.style.display = "none";
  } else {
    elements.sideModal.style.display = "none"; // Change "now" to "none"
    elements.showSideBarBtn.style.display = "block";
  }
}
toggleSidebar(true);
//////////////////////////////////////////////TOGGLETHEMEFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function toggleTheme() {
  // Get a reference to the document body
  const body = document.body;

  // Toggle between light and dark theme classes on the body
  body.classList.toggle("light-theme");
  body.classList.toggle("dark-theme");

  // Check if the current theme is light or dark
  const isLightTheme = body.classList.contains("light-theme");

  // Store the theme preference in local storage
  localStorage.setItem("theme", isLightTheme ? "light" : "dark");
}
////////////////////////////////////////////////////OPENEDITTASKMODALFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function openEditTaskModal(task) {
  // Set task details in modal inputs
  const titleInput = document.getElementById("edit-task-title-input");
  const descInput = document.getElementById("edit-task-desc-input");
  const statusSelect = document.getElementById("edit-select-status");

  // Get button elements from the task modal
  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  // Call saveTaskChanges upon click of Save Changes button
  const saveTaskChangesBtn = document.getElementById("save-task-changes-btn");
  const deleteTaskBtn = document.getElementById("delete-task-btn");

  saveTaskChangesBtn.addEventListener("click", () => {
    saveTaskChanges(task.id);
    // No need to reload the page, just refresh the UI
    refreshTasksUI();
    toggleModal(false, elements.editTaskModal);
  });

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener("click", () => {
    deleteTask(task.id);
    // No need to reload the page, just refresh the UI
    refreshTasksUI();
    toggleModal(false, elements.editTaskModal);
  });

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}
///////////////////////////////////////////////////SAVETASKCHANGES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Function to save changes to a task
function saveTaskChanges(taskId) {
  // Get new user inputs
  const updatedTitle = document.getElementById("edit-task-title-input").value;
  const updatedDescription = document.getElementById("edit-task-desc-input").value;
  const updatedStatus = document.getElementById("edit-select-status").value;

  // Get the tasks from local storage
  let tasks = getTasks();

  // Check if a task with the same ID already exists
  const existingTask = tasks.findIndex(task => task.id === taskId);

  if (existingTask !== -1) {
    // If the task already exists, update its properties
    tasks[existingTask].title = updatedTitle;
    tasks[existingTask].description = updatedDescription;
    tasks[existingTask].status = updatedStatus;
  } else {
    // If the task doesn't exist, create a new task object
    const newTask = {
      id: taskId,
      title: updatedTitle,
      description: updatedDescription,
      status: updatedStatus
    };

    // Add the new task to the tasks array
    tasks.push(newTask);
  }

  // Save the updated tasks array back to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Call putTask to update the task in your storage mechanism
  putTask(taskId, tasks[existingTask]);

  // Refresh the UI to reflect the changes
  refreshTasksUI();

  // Close the modal
  toggleModal(false, elements.editTaskModal);
}

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  init(); // init is called after the DOM is fully loaded
});
////////////////////////////////////////////////////////////INITFUNCTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  toggleSidebar(showSidebar);
  const LightTheme = localStorage.getItem("light-theme") === "enabled";
  document.body.classList.toggle("light-theme", LightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}