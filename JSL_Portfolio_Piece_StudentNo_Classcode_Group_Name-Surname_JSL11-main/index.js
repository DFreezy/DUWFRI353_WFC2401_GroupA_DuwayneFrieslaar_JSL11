
alert('Hello')

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/


// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM
const elements = {
  showSideBarBtn: document.querySelector('show-side-bar-btn'),
  sidebar: document.querySelector('.side-bar'),
  boardsnavlinksdiv: document.querySelector('.boards-nav-links-div'),
  sidebarbottom: document.querySelector('.side-bar-bottom'),
  hidesidebardiv: document.querySelector('.hide-side-bar-div'),
  stickyheader: document.querySelector('.sticky-header'),
  headernamediv: document.querySelector('.header-name-div'),
  headerboard: document.querySelector('.header-board-name'),
  dropdownBtn: document.querySelector('.dropdownBtn'),
  iconchevrondown: document.querySelector('.icon-chevron-down'),
  primarybtn: document.querySelector('.primary-btn'),
  editbtn: document.querySelector('.edit-btn'),
  editBtnsDiv: document.querySelector('.editBtnsDiv'),
  editBtns: document.querySelector('.editBtns'),
  container: document.querySelector('.container'),
  cardcolumnmain: document.querySelector('.card-column-main'),
  columnDiv: document.querySelectorAll('.column-div'),
  columnheaddiv: document.querySelectorAll('.column-head-div'),
  dot: document.querySelectorAll('.dot'),
  columnHeader: document.querySelectorAll('.columnHeader'),
  taskscontainer: document.querySelectorAll('.tasks-container'),
  modalWindow: document.querySelector('.modal-window'),
  modaltitle: document.querySelector('.modal-title'),
  inputdiv: document.querySelectorAll('.input-div'),
  labelmodalwindow: document.querySelectorAll('.label-modal-window'),
  modalinput: document.querySelectorAll('.modal-input'),
  buttongroup: document.querySelectorAll('.button-group'),
  submitbtn: document.querySelectorAll('.submit-btn'),
  edittaskmodalwindow: document.querySelector('.edit-task-modal-window'),
  edittaskform: document.querySelector('.edit-task-form'),
  edittaskdiv: document.querySelectorAll('.edit-task-div'),
  tasktitleinput: document.querySelectorAll('.task-title-input'),
  editbtn: document.querySelectorAll('.edit-btn'),
};



let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; 
    elements.headerboard.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener('click', function()  { 
      elements.headerboard.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
    });
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board = boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDiv.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status = status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);
    }),
      // Listen for a click event on each task and open a modal
      taskElement.addEventListener('click', function() { 
        openEditTaskModal(tasks);
      }),

      tasksContainer.appendChild(taskElement);
    })
  };



function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').foreach(btn => { 
    
    if(btn.textContent === boardName) {
      btn.add('active') 
    }
    else {
      btn.remove('active'); 
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(); 
}



function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', function(){toggleModal(false, elements.editTaskModal)});

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener('click', function(){toggleSidebar(false)});
  elements.showSideBarBtn.addEventListener('click', function(){toggleSidebar(true)});

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modal-window.addEventListener('submit',  (event) => {
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
  const addNewTaskButton = document.getElementById('add-new-task-btn');
  event.preventDefault(); 

  //Assign user input to the task object
  const task = {
    // Populate task properties here based on user input
  };
  
  const newTask = createNewTask(task);
  
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(true);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    event.target.reset();
    refreshTasksUI();
  }
}



function toggleSidebar(show) {
    elements.sidebar.style.display = show ? 'block' : 'none';
  }


function toggleTheme() {
 
}



function openEditTaskModal(task) {
  // Set task details in modal inputs
  

  // Get button elements from the task modal


  // Call saveTaskChanges upon click of Save Changes button
 

  // Delete task using a helper function and close the task modal


  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  

  // Create an object with the updated task details


  // Update task using a hlper functoin
 

  // Close the modal and refresh the UI to reflect the changes

  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});


function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}

