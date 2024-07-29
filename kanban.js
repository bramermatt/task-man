document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearTasksBtn = document.getElementById('clearTasksBtn');
    const columns = document.querySelectorAll('.column');

    const loadTasks = () => {
        columns.forEach(column => {
            const columnId = column.id;
            const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
            tasks.forEach(taskText => {
                const newTask = document.createElement('div');
                newTask.classList.add('task');
                newTask.setAttribute('draggable', 'true');
                newTask.textContent = taskText;
                column.appendChild(newTask);
            });
        });
    };

    const saveTasks = () => {
        columns.forEach(column => {
            const columnId = column.id;
            const tasks = [];
            column.querySelectorAll('.task').forEach(task => {
                tasks.push(task.textContent);
            });
            localStorage.setItem(columnId, JSON.stringify(tasks));
        });
    };

    const clearAllTasks = () => {
        columns.forEach(column => {
            column.innerHTML = '<h2>' + column.querySelector('h2').textContent + '</h2>';
            localStorage.removeItem(column.id);
        });
    };

    const handleDragStart = (e) => {
        if (e.target.classList.contains('task')) {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.target.classList.add('dragging');
        }
    };

    const handleDragEnd = (e) => {
        if (e.target.classList.contains('task')) {
            e.target.classList.remove('dragging');
            columns.forEach(column => column.classList.remove('drag-over'));
            saveTasks();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            e.currentTarget.classList.add('drag-over');
        }
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            e.currentTarget.classList.remove('drag-over');
            e.currentTarget.appendChild(draggingTask);
            saveTasks();
        }
    };

    const handleTouchStart = (e) => {
        if (e.target.classList.contains('task')) {
            e.target.classList.add('dragging');
            const touch = e.touches[0];
            e.target.dataset.initialX = touch.clientX - e.target.offsetLeft;
            e.target.dataset.initialY = touch.clientY - e.target.offsetTop;
        }
    };

    const handleTouchEnd = (e) => {
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            draggingTask.style.position = '';
            draggingTask.style.left = '';
            draggingTask.style.top = '';
            draggingTask.classList.remove('dragging');

            const touch = e.changedTouches[0];
            const targetColumn = document.elementFromPoint(touch.clientX, touch.clientY).closest('.column');
            if (targetColumn) {
                targetColumn.appendChild(draggingTask);
                targetColumn.classList.remove('drag-over');
            }
            saveTasks();
        }
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            const touch = e.touches[0];
            draggingTask.style.position = 'absolute';
            draggingTask.style.left = `${touch.clientX - draggingTask.dataset.initialX}px`;
            draggingTask.style.top = `${touch.clientY - draggingTask.dataset.initialY}px`;

            const targetColumn = document.elementFromPoint(touch.clientX, touch.clientY).closest('.column');
            columns.forEach(column => column.classList.remove('drag-over'));
            if (targetColumn) {
                targetColumn.classList.add('drag-over');
            }
        }
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
        column.addEventListener('touchstart', handleTouchStart);
        column.addEventListener('touchend', handleTouchEnd);
        column.addEventListener('touchmove', handleTouchMove);
    });

    const addNewTask = () => {
        const taskText = prompt('Enter task:');
        if (taskText) {
            const newTask = document.createElement('div');
            newTask.classList.add('task');
            newTask.setAttribute('draggable', 'true');
            newTask.textContent = taskText;
            document.getElementById('todo').appendChild(newTask);
            saveTasks();
        }
    };

    addTaskBtn.addEventListener('click', addNewTask);
    clearTasksBtn.addEventListener('click', clearAllTasks);

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'n') {
            addNewTask();
        }
    });

    loadTasks();
});
