const TASKS_KEY = 'tasks';

// Save a new task
function addTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Get all tasks
function getTasks() {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
}

// Example usage:
// addTask({ id: 1, title: 'Sample Task', completed: false });
// const allTasks = getTasks();

export { addTask, getTasks };