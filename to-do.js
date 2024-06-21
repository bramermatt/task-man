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

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodoItem(input.value);
        input.value = '';
        updateHeadings();
    });

    function addTodoItem(todoText) {
        taskCount++;
        const li = document.createElement('li');

        const textSpan = document.createElement('span');
        textSpan.textContent = `${taskCount}. ${todoText}`;
        textSpan.classList.add('task-text');
        li.appendChild(textSpan);

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

        li.appendChild(completeCheckbox);
        li.appendChild(deleteButton);
        todoList.appendChild(li);

        textSpan.addEventListener('click', function() {
            openModal(todoText, li, completeCheckbox);
        });

        updateTaskNumbers();
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
    }

    function handleDelete(taskElement) {
        if (taskElement.classList.contains('completed')) {
            completedList.removeChild(taskElement);
        } else {
            todoList.removeChild(taskElement);
            updateTaskNumbers();
        }
        updateHeadings();
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

    // Initial call to set headings visibility
    updateHeadings();
});
