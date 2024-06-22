document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-list');
    const todoHeading = document.getElementById('todo-heading');
    const completedHeading = document.getElementById('completed-heading');
    const modal = document.getElementById('taskModal');
    const modalText = document.getElementById('modal-text');
    const closeModal = document.getElementsByClassName('close')[0];
    const modalCompleteBtn = document.getElementById('modal-complete-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');
    let taskCount = 0;
    let currentTaskElement = null;

    loadTasks();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodoItem(input.value);
        input.value = '';
        updateHeadings();
    });

    function addTodoItem(todoText, completed = false) {
        taskCount++;
        const li = document.createElement('li');

        const textSpan = document.createElement('span');
        textSpan.textContent = `${taskCount}. ${todoText}`;
        li.appendChild(textSpan);

        const infoButton = document.createElement('button');
        infoButton.classList.add('info-btn');
        infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';
        infoButton.addEventListener('click', function(event) {
            event.stopPropagation();
            openModal(todoText, li, completeCheckbox);
        });

        const completeCheckbox = document.createElement('button');
        completeCheckbox.classList.add('complete-checkbox');
        completeCheckbox.innerHTML = '<i class="fas fa-check"></i>';
        completeCheckbox.addEventListener('click', function(event) {
            event.stopPropagation();
            handleComplete(li, completeCheckbox);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fas fa-times"></i>';
        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation();
            handleDelete(li);
        });

        li.appendChild(infoButton);
        li.appendChild(completeCheckbox);
        li.appendChild(deleteButton);

        if (completed) {
            li.classList.add('completed');
            completeCheckbox.style.display = 'none';
            completedList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }

        updateTaskNumbers();
        saveTasks();
    }

    function updateTaskNumbers() {
        const tasks = todoList.querySelectorAll('li:not(.completed)');
        taskCount = tasks.length;
        tasks.forEach((task, index) => {
            const textSpan = task.querySelector('span');
            textSpan.textContent = `${index + 1}. ${textSpan.textContent.split('. ')[1]}`;
        });
    }

    function updateHeadings() {
        todoHeading.style.display = todoList.children.length > 0 ? 'block' : 'none';
        completedHeading.style.display = completedList.children.length > 0 ? 'block' : 'none';
    }

    function handleComplete(taskElement, completeCheckbox) {
        if (taskElement.classList.contains('completed')) {
            taskElement.classList.remove('completed');
            completeCheckbox.style.display = 'inline-block';
            completeCheckbox.innerHTML = '<i class="fas fa-check"></i>';
            todoList.appendChild(taskElement);
            updateTaskNumbers();
        } else {
            taskElement.classList.add('completed');
            completeCheckbox.style.display = 'none';
            completedList.appendChild(taskElement);
        }
        updateHeadings();
        saveTasks();
    }

    function handleDelete(taskElement) {
        if (taskElement.classList.contains('completed')) {
            completedList.removeChild(taskElement);
        } else {
            todoList.removeChild(taskElement);
            updateTaskNumbers();
        }
        updateHeadings();
        saveTasks();
    }

    function openModal(text, taskElement, completeCheckbox) {
        modalText.textContent = text;
        modal.style.display = 'block';
        currentTaskElement = taskElement;

        modalCompleteBtn.onclick = function() {
            handleComplete(currentTaskElement, completeCheckbox);
            modal.style.display = 'none';
        };

        modalDeleteBtn.onclick = function() {
            handleDelete(currentTaskElement);
            modal.style.display = 'none';
        };
    }

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('span').textContent.split('. ')[1],
                completed: li.classList.contains('completed')
            });
        });
        completedList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('span').textContent.split('. ')[1],
                completed: true
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => {
            addTodoItem(task.text, task.completed);
        });
        updateHeadings();
    }

    // Initial call to set headings visibility
    updateHeadings();
});
