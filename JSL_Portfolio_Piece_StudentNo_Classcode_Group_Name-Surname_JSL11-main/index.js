// TASK: import helper functions from utils
// TASK: import initialData


/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage

import {
  createNewTask,
  deleteTask,
  getTasks,
  patchTask,
  putTask
} from "./utils/taskFunctions.js";
// TASK: import initialData
import { initialData } from "./initialData.js";

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
// TASK: Get elements from the DOM
const elements = {
  editTaskModal: document.querySelector('.edit-task-modal-window'),
  modalWindow: document.querySelector('.modal-window'),
  themeSwitch: document.querySelector('#switch'),
  showSideBarBtn: document.querySelector('#show-side-bar-btn'),
  hideSideBarBtn: document.querySelector('#hide-side-bar-btn'),
  filterDiv: document.querySelectorAll('#filterDiv'),
  columnDivs: document.querySelectorAll('.card-column-main'), // Use querySelectorAll to select multiple elements
  headerBoardName: document.querySelector('#boards-nav-links-div'),
 toggleDiv:document.querySelectorAll('.toggle-div'),
 headineSidePanel: document.getElementById('headline-sidepanel')
};

console.log(elements.editTaskModal)






let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks()
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; 
    elements.headerBoardName.innerHTML = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ""; // Clears the container
  boards.forEach((board) => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {
      // Corrected click event listener syntax
      headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; // Corrected assignment syntax
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });
}



// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task) => task.board === boardName);

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
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-div");
        taskElement.textContent = task.title;
        taskElement.setAttribute("data-task-id", task.id);

        // Listen for a click event on each task and open a modal
        taskElement.addEventListener("click", () => {
          // Corrected click event listener syntax
          openEditTaskModal(task);
        });

        tasksContainer.appendChild(taskElement);
      });
  });
}



function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(headerBoardName) { 
    document.querySelectorAll('#edit-board-btn').forEach(btn => { 
      if(btn.textContent === headerBoardName) {
        btn.classList.add('active'); // Use classList.add to add a class
      } else {
        btn.classList.remove('active'); // Use classList.remove to remove a class
      }
    })
  }


  function addTaskToUI(task) {
    const column = document.querySelector(
      `.column-div[data-status="${task.status}"]`
    ); // Corrected string interpolation
    if (!column) {
      console.error(`Column not found for status: ${task.status}`);
      return;
    }
  
    let tasksContainer = column.querySelector('.tasks-container');
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
  
function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', function() { toggleModal(false, elements.editTaskModal)});

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
     elements.filterDiv.style.display = 'none'; // Also hide the filter overlay ....fixed
 
  });

/*****************************************SideBar******************************************************************** */

  // Clicking outside the modal to close it
filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false)); // Corrected event listener syntax
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));
  
  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener

const createNewTaskBtn = document.getElementById('add-new-task-btn')



  createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit', (event) => {
    addTask(event)
  });
}
// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 


const titleInput = document.getElementById('title-input')
const description = document.getElementById('desc-input')
const status = document.querySelector('#select-status');





  //Assign user input to the task object
  const task = {
    title: titleInput.value,
    description: description.value,
    status: status.value,
  };
  
  
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}

function toggleSidebar(show) {
  const sidebar = document.getElementById("side-bar-div");
  //sidebar.style.display = show ? 'block' : 'none';
  if (show) {
    sidebar.style.display = "block";
    elements.showSideBarBtn.style.display = "none";
  } else {
    sidebar.style.display = "none";
    elements.showSideBarBtn.style.display = "block";
  }
}

//Sidebar

function toggleTheme() {
  const body = document.body;
  // Toggle between light and dark themes by toggling the 'dark-theme' class on the body
  body.classList.toggle("dark-theme");

  body.classList.toggle("light-theme");
}
//Theme

function openEditTaskModal(task) {
  // Set task details in modal inputs
  // Assuming there are input elements in the edit task modal to set task details
  
  // Get button elements from the task modal
  const saveChangesBtn = document.getElementById("save-task-changes-btn"); // Assuming there's a button with id 'save-changes-btn' in the modal
  
  // Call saveTaskChanges upon click of Save Changes button
  saveChangesBtn.addEventListener('click', function() {
    saveTaskChanges(task.id); // Assuming task.id is the unique identifier for the task
  });
  //const deleteTaskBtn = document.getElementById('delete-task-btn')
  // Delete task using a helper function and close the task modal
  deleteTask.addEventListener("click", () => {
    deleteTask(task.id);
    toggleModal(false, elements.editTaskModal); // Close the edit task modal
  });

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

  toggleModal(true, elements.editTaskModal); // Show the edit task modal

//OpenTaskModal


function saveTaskChanges(taskId) {
  // Get new user inputs
  const updatedTitle = document.getElementById("edit-task-title-input").value; // Assuming there's an input element with id 'task-title'
  const updatedDescription = document.getElementById("edit-task-desc-input").value; // Assuming there's an input element with id 'task-description'
  const updatedStatus = document.getElementById("edit-select-status").value; // Assuming there's an input element with id 'task-status'

  // Create an object with the updated task details
  const updatedTask = {
    id: taskId,
    title: updatedTitle,
    description: updatedDescription,
    status: updatedStatus
  };

  // Update task using a helper function
  updatedTask(updatedTask); // Assuming updateTask is a function that updates the task with the provided details

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal); // Close the modal
  refreshTasksUI(); // Refresh the UI to reflect the changes
}
//Saving changes

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem("light-theme") === "enabled";
  document.body.classList.toggle("light-theme", isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
  displayBoards(); // Call the displayBoards function
}
//initiallize systems