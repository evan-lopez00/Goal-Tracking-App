document.addEventListener('DOMContentLoaded', function() {
    var changesMade = false; // Flag to track changes

    var updateProgress = function() {
        var goals = document.querySelectorAll('.goal');
        goals.forEach(function(goal) {
            var tasksCompleted = goal.querySelectorAll('.task.completed').length;
            var tasksTotal = goal.querySelectorAll('.task').length;
            var progressBar = goal.querySelector('.progress-bar');
            var percentage = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
            progressBar.style.width = percentage + '%';
            progressBar.textContent = 'Progress ' + percentage.toFixed(1) + '%';
            changesMade = true; // Set flag to true when changes are made
        });
    };

    var addTaskListeners = function(task) {
        task.addEventListener('click', function() {
            task.classList.toggle('completed');
            updateProgress();
        });

        // Hover effect for task options
        task.addEventListener('mouseover', function() {
            var options = task.querySelector('.task-options');
            if (options) {
                options.style.display = 'block';
            }
        });

        task.addEventListener('mouseout', function() {
            var options = task.querySelector('.task-options');
            if (options) {
                options.style.display = 'none';
            }
        });

        var optionsMenu = document.createElement('div');
        optionsMenu.className = 'task-options';
        optionsMenu.innerHTML = `
            <div class="update-task">Update Task</div>
            <div class="delete-task">Delete Task</div>
            <div class="rename-task">Rename Task</div>
        `;
        task.appendChild(optionsMenu);

        optionsMenu.querySelector('.delete-task').addEventListener('click', function(event) {
            event.stopPropagation();
            if (confirm('Are you sure you want to delete this task?')) {
                task.remove();
                updateProgress();
            }
        });

        optionsMenu.querySelector('.rename-task').addEventListener('click', function(event) {
            event.stopPropagation();
            var newTaskName = prompt('Enter the new task name:');
            if (newTaskName !== null && newTaskName.trim() !== '') {
                task.querySelector('.task-name').textContent = newTaskName.trim();
                updateProgress();
            }
        });
    };

    var addTaskButtonListeners = function() {
        var addTaskButtons = document.querySelectorAll('.add-task.btn');
        addTaskButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var ul = button.closest('.goal').querySelector('.tasks-list');
                var li = document.createElement('li');
                li.innerHTML = '<span class="task-name">New Task</span>';
                li.classList.add('task');
                ul.appendChild(li);
                addTaskListeners(li);
                updateProgress();
            });
        });
    };

    var addGoalButtonListener = function(addGoalButton) {
    addGoalButton.addEventListener('click', function() {
        // Create a form element
        var form = document.createElement('form');
        form.classList.add('goal-form');
        form.innerHTML = `
            <input type="text" name="goalName" placeholder="Enter Goal Name">
            <input type="text" name="goalNotes" placeholder="Enter Goal Notes">
            <label for="dueDate">Due Date:</label>
            <input type="date" name="dueDate">
            <label for="startDate">Start Date:</label>
            <input type="date" name="startDate">
            <button type="submit">Add Goal</button>
        `;

        // Add form submission event listener
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            var formData = new FormData(form);
            var goalName = formData.get('goalName');
            var goalNotes = formData.get('goalNotes');
            var dueDate = formData.get('dueDate');
            var startDate = formData.get('startDate');
            form.remove();

            createGoal(goalName, goalNotes, dueDate, startDate)

            // Create a new goal element
            var newGoal = document.createElement('div');
            newGoal.classList.add('goal');
            newGoal.innerHTML = `
                <h2>${goalName}</h2>
                <p><strong>Notes:</strong> ${goalNotes}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                <p><strong>Start Date:</strong> ${startDate}</p>
                <ul class="tasks-list">
                    <!-- Tasks will be added dynamically here -->
                </ul>
                <div class="progress">
                    <div class="progress-bar">0%</div>
                </div>
                <div id="${goalName}" class="btn-container">
                    <button id="${goalName}" class="btn btn-primary add-task">Add Task</button>
                    <button id="${goalName}" class="btn btn-primary add-goal">Add Goal</button>
                    <button id="${goalName}" class="btn btn-primary update-goal">Update Goal</button>
                    <button id="${goalName}" class="btn btn-danger delete-goal">Delete Goal</button>
                </div>
            `;
            document.querySelector('.container').appendChild(newGoal);
            //addTaskButtonListeners(); // Update event listeners for newly added "Add Task" buttons
            updateProgress();
            //saveChanges(); // Save changes after adding a new goal
            addDropdownListener(newGoal); // Attach event listeners to the buttons in the new goal
            
            // Attach event listener for the "Add Goal" button in the new goal
        });

        // Append the form to the container
        document.querySelector('.container').appendChild(form);
    });
};



    addTaskButtonListeners();
    // Function to attach event listeners to buttons in a goal
    var attachButtonListeners = function(goal) {
        // Attach event listeners to add task buttons
        var addTaskButtons = goal.querySelectorAll('.add-task');
        addTaskButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Add task functionality
                var ul = button.closest('.goal').querySelector('.tasks-list');
                var li = document.createElement('li');
                li.innerHTML = '<span class="task-name">New Task</span>';
                li.classList.add('task');
                ul.appendChild(li);
                addTaskListeners(li);
                updateProgress();
            });
        });

        // Attach event listeners for other buttons (update, delete, etc.)
        var updateGoalButton = goal.querySelector('.update-goal');
        updateGoalButton.addEventListener('click', function() {
            // Update goal functionality
            var currentGoal = updateGoalButton.closest('.goal').querySelector('h2');
            var goalId = updateGoalButton.getAttribute('id');
            console.log(goalId);
            var newGoalName = prompt("Enter the new goal name:");
            if (newGoalName !== null && newGoalName !== "") {
                updateGoal(goalId, newGoalName);
                currentGoal.textContent = newGoalName;
                updateProgress(); // Update progress after updating goal name
                saveChanges(); // Save changes after updating goal name
            }
        });

        var deleteGoalButton = goal.querySelector('.delete-goal');
        deleteGoalButton.addEventListener('click', function() {

            var goalId = deleteGoalButton.getAttribute('id');
            // Delete goal functionality
            var confirmDelete = confirm("Are you sure you want to delete this goal?");
            if (confirmDelete) {
                deleteGoal(goalId);
                var goal = deleteGoalButton.closest('.goal');
                goal.parentNode.removeChild(goal);
                updateProgress(); // Update progress after deleting goal
                saveChanges(); // Save changes after deleting goal
            }
        });
    };
	
	function deleteGoalListener(button) {
    button.addEventListener('click', function() {
        var goalId = button.getAttribute('id');
        console.log(goalId);
        var confirmDelete = confirm("Are you sure you want to delete this goal?");
        if (confirmDelete) {
            var goal = button.closest('.goal');
            goal.parentNode.removeChild(goal);
            updateProgress(); // Update progress after deleting goal
            saveChanges(); // Save changes after deleting goal
        }
    });
}

    var addDropdownListener = function(goal) {
        var dropdown = goal.querySelector('.dropdown');
        goal.addEventListener('mouseover', function() {
            dropdown.style.display = 'block';
        });
        goal.addEventListener('mouseout', function() {
            dropdown.style.display = 'none';
        });

        // Delegate event listeners for all buttons in the dropdown
        dropdown.addEventListener('click', function(event) {
            var target = event.target;
            if (target.classList.contains('add-task')) {
                var ul = goal.querySelector('.tasks-list');
                var li = document.createElement('li');
                li.innerHTML = '<span class="task-name">New Task</span>';
                li.classList.add('task');
                ul.appendChild(li);
                addTaskListeners(li);
                updateProgress();
            } else if (target.classList.contains('add-goal')) {
                addGoalButtonListener(target);
            } else if (target.classList.contains('update-goal')) {
                updateGoalListener(target);
            } else if (target.classList.contains('delete-goal')) {
                deleteGoalListener(target);
            }
        });
    };

    // Function to save changes as JSON
    function saveChanges() {
        // Collecting data from the page
        const goals = [];

        document.querySelectorAll('.goal').forEach((goalElement) => {
            const goal = {
                title: goalElement.querySelector('h2').textContent,
                tasks: []
            };

            goalElement.querySelectorAll('.task').forEach((taskElement) => {
                goal.tasks.push({
                    description: taskElement.querySelector('.task-name').textContent,
                    completed: taskElement.classList.contains('completed')
                });
            });


            goals.push(goal);
        });

        // Convert data to JSON
        const jsonData = JSON.stringify(goals);

        // Example of saving to local storage, you can adjust this part based on your requirements
        localStorage.setItem('goalsData', jsonData);

        changesMade = false; // Reset flag to false after changes are saved
    }

    // Function to load saved data
    function loadSavedData() {
        const jsonData = localStorage.getItem('goalsData');
        if (jsonData) {
            const goals = JSON.parse(jsonData);
            goal = goals[0];
            // Clear existing goals
            document.querySelector('.container').innerHTML = '';

            
                const newGoal = document.createElement('div');
                newGoal.classList.add('goal');
                newGoal.innerHTML = `
                    <h2>DASHBOARD</h2>
                    <ul class="tasks-list">
                        <!-- Tasks will be added dynamically here -->
                    </ul>
                    <div class="progress">
                        <div class="progress-bar">Progress</div>
                    </div>
                    <!-- Dropdown menu for actions -->
                    <div class="dropdown">
                        <button class="add-task btn">Add Task</button>
                        <button class="add-goal btn">Add Goal</button>
                        <button class="update-goal btn">Update Goal</button>
                        <button id="DASHBOARD" class="delete-goal btn">Delete Goal</button>
                    </div>
                    <button class="clear-btn btn">Clear Tasks</button>
                `;
                const tasksList = newGoal.querySelector('.tasks-list');
                
                document.querySelector('.container').appendChild(newGoal);
                //addTaskButtonListeners(); // Update event listeners for newly added "Add Task" buttons
                updateProgress();
                addDropdownListener(newGoal); // Add dropdown event listener for the new goal
        }
    }

    // Event listener for Save Changes button
    document.querySelector('.save-changes').addEventListener('click', saveChanges);

    // Load saved data when the page is loaded
    loadSavedData();

    // Clear all tasks from a goal
    document.querySelectorAll('.clear-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            var goal = button.closest('.goal');
            if (!goal) {
                console.error("Goal not found for clear button:", button);
                return;
            }
            console.log("Goal found:", goal);
            var tasksList = goal.querySelector('.tasks-list');
            if (!tasksList) {
                console.error("Tasks list not found within the goal:", goal);
                return;
            }
            console.log("Tasks list found:", tasksList);
            tasksList.innerHTML = '';
            updateProgress();
            saveChanges(); // Save changes after clearing tasks
        });
    });

    updateProgress();

    // Listen for beforeunload event
    window.addEventListener('beforeunload', function(event) {
        if (changesMade) {
            // Cancel the event to prevent the browser from leaving the page
            event.preventDefault();
            // Chrome requires the returnValue property to be set
            event.returnValue = ''; 
            // Show confirmation dialog
            return 'You have unsaved changes. Are you sure you want to leave this page?';
        }
    });

    function createGoal(name, notes, due_on, start_on) {
        fetch('/create_goal', {
            'method' : 'POST',
            'headers' : {'Content-Type' : 'application/json'},
            'body' : JSON.stringify({
                name: name,
                notes: notes,
                due_on: due_on,
                start_on: start_on
            }),
        }).then(response => {
                if(response.redirected){
                    window.location = response.url;
                }
                else{
                    console.log("ERROR ERROR")
                }
            }) 
        return 'Successful'
    }

    function fetchExistingGoals() {
        fetch('/retrieveGoals') // Replace with your backend endpoint
            .then(response => response.json())
            .then(data => {
                // Call function to render existing goals
                renderExistingGoals(data);
            })
            .catch(error => console.error('Error fetching existing goals:', error));
    }

    function renderExistingGoals(goals) {

        // Loop through each goal and create HTML elements to display them
        goals.forEach(goal => {
            var goalName = goal['goal_name'];
            var goalID = goal['goal_id'];
            var goalNotes = goal['notes'];
            var dueDate = goal['due_date'];
            var startDate = goal['start_date'];

            var newGoal = document.createElement('div');
            newGoal.classList.add('goal')
            newGoal.innerHTML = `
            <h2>${goalName}</h2>
            <p><strong>Notes:</strong> ${goalNotes}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <ul class="tasks-list">
                <!-- Tasks will be added dynamically here -->
            </ul>
            <div class="progress">
                <div class="progress-bar">0%</div>
            </div>
            <div class="btn-container">
                <button class="btn btn-primary add-task">Add Task</button>
                <button class="btn btn-primary add-goal">Add Goal</button>
                <button id=${goalID} class="btn btn-primary update-goal">Update Goal</button>
                <button id=${goalID} class="btn btn-danger delete-goal">Delete Goal</button>
            </div>
            `;
            
            document.querySelector('.container').appendChild(newGoal);
            //addTaskButtonListeners(); // Update event listeners for newly added "Add Task" buttons
            updateProgress();
            saveChanges(); // Save changes after adding a new goal
            attachButtonListeners(newGoal); // Attach event listeners to the buttons in the new goal
            
            // Attach event listener for the "Add Goal" button in the new goal
            addGoalButtonListener(newGoal.querySelector('.add-goal'));
        });
        document.querySelector('.container').appendChild(form);
    }

    function deleteGoal(goalId) {
        console.log(goalId);
        fetch(`/delete_goal/${goalId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Handle success, such as removing the goal from the UI
                console.log('Goal deleted successfully');
            } else {
                // Handle error
                console.error('Failed to delete goal');
            }
        })
        .catch(error => {
            console.error('Error deleting goal:', error);
        })
    }

    // Update the updateGoal function to send an HTTP request to the backend
function updateGoal(goalId, newName) {
    fetch(`/update_goal/${goalId}/${newName}`, {
        method: 'PUT', // Use the PUT method for updating data
    })
    .then(response => {
        if (response.ok) {
            // Handle success
            console.log('Goal updated successfully');
            // Optionally, you can reload the page or update the UI as needed
        } else {
            // Handle error
            console.error('Failed to update goal');
        }
    })
    .catch(error => {
        console.error('Error updating goal:', error);
    });
}

    fetchExistingGoals();
});
