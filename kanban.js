document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearTasksBtn = document.getElementById('clearTasksBtn');
    const columns = document.querySelectorAll('.column');
    const kanbanBoard = document.querySelector('.kanban-board');
    let currentColumnIndex = 0;

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
            saveTasks();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            e.currentTarget.appendChild(draggingTask);
        }
    };

    const handleTouchStart = (e) => {
        if (e.target.classList.contains('task')) {
            e.target.classList.add('dragging');
        }
    };

    const handleTouchEnd = (e) => {
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            const targetColumn = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            if (targetColumn && targetColumn.classList.contains('column')) {
                targetColumn.appendChild(draggingTask);
            }
            draggingTask.classList.remove('dragging');
            saveTasks();
        }
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            const touch = e.touches[0];
            draggingTask.style.position = 'absolute';
            draggingTask.style.left = `${touch.clientX}px`;
            draggingTask.style.top = `${touch.clientY}px`;
        }
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('touchstart', handleTouchStart);
        column.addEventListener('touchend', handleTouchEnd);
        column.addEventListener('touchmove', handleTouchMove);
    });

    const addNewTask = () => {
        const taskText = prompt('Enter task description:');
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

    const hammer = new Hammer(kanbanBoard);
    hammer.on('swipeleft', () => {
        if (currentColumnIndex < columns.length - 1) {
            currentColumnIndex++;
            kanbanBoard.style.transform = `translateX(-${currentColumnIndex * 33.33}%)`;
        }
    });

    hammer.on('swiperight', () => {
        if (currentColumnIndex > 0) {
            currentColumnIndex--;
            kanbanBoard.style.transform = `translateX(-${currentColumnIndex * 33.33}%)`;
        }
    });
});