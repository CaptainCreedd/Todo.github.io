let currentSection = 'today'; // Track the current section
let tasks = JSON.parse(localStorage.getItem('tasks')) || {
  today: [],
  upcoming: [],
  important: [],
  assignment: [],
  other: []
};

// Function to show a section
function showSection(section) {
  currentSection = section;
  document.getElementById('section-title').innerText = `${section.charAt(0).toUpperCase() + section.slice(1)}'s Tasks`;
  displayTasks();
}

// Function to add a task
function addTask() {
  const taskInput = document.getElementById('taskInput').value;
  const taskDate = document.getElementById('taskDate').value;
  const priority = document.getElementById('priorityInput').value;

  if (taskInput === '') {
    alert('Please enter a task.');
    return;
  }

  const newTask = {
    task: taskInput,
    date: taskDate,
    priority: priority,
    completed: false
  };

  // Assign task to the right section based on the date
  if (taskDate && new Date(taskDate) > new Date()) {
    tasks.upcoming.push(newTask);
  } else {
    tasks[currentSection].push(newTask);
  }

  saveTasks();
  displayTasks();
}

// Function to display tasks
function displayTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear existing tasks

  tasks[currentSection].forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        ${task.task} - ${task.date ? task.date : 'No date'}
      </span>
      <span class="priority">${task.priority}</span>
      <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
    `;
    
    // Add long press event for deletion
    taskItem.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // Prevent default context menu
      deleteTask(index);
    });
    
    taskList.appendChild(taskItem);
  });
}

// Function to toggle task completion
function toggleComplete(index) {
  tasks[currentSection][index].completed = !tasks[currentSection][index].completed;
  saveTasks();
  displayTasks();
}

// Function to delete a task
function deleteTask(index) {
  const confirmation = confirm('Are you sure you want to delete this task?');
  if (confirmation) {
    tasks[currentSection].splice(index, 1); // Remove task from array
    saveTasks();
    displayTasks();
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new section
function addNewSection() {
  const newSectionName = prompt("Enter new section name:");
  if (newSectionName) {
    tasks[newSectionName.toLowerCase()] = [];
    const sideMenu = document.querySelector('.side-menu ul');
    const newMenuItem = document.createElement('li');
    newMenuItem.innerHTML = `<a href="#" onclick="showSection('${newSectionName.toLowerCase()}')">${newSectionName}</a>`;
    sideMenu.appendChild(newMenuItem);
  }
}

// Initialize today's section
showSection(currentSection);
