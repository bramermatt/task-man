/*--------------------------------------------------
     * Data & Constants
     *--------------------------------------------------*/
    let tasks = [];
    let taskIdCounter = 0;

    const IS_DEMO = false; // Set to true for demo/development, false for production

    const lanes = [
      { id: "planning", name: "Planning" },
      { id: "action", name: "In Progress" },
      { id: "review", name: "Review" },
      { id: "achieved", name: "Achieved" },
    ];

    const priorityColors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };

    const statusColors = {
      research: "bg-blue-100 text-blue-800",
      working: "bg-green-100 text-green-800",
      blocked: "bg-red-100 text-red-800",
      "need-info": "bg-yellow-100 text-yellow-800"
    };

    /*--------------------------------------------------
     * Cached Elements
     *--------------------------------------------------*/
    const board = document.getElementById("board");
    const laneTemplate = document.getElementById("laneTemplate");
    const taskTemplate = document.getElementById("taskTemplate");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const totalTasksEl = document.getElementById("totalTasks");
    const completedTasksEl = document.getElementById("completedTasks");

    // Modal elements
    const modal = document.getElementById("taskModal");
    const modalTitle = document.getElementById("modalTitle");
    const deleteBtn = document.getElementById("deleteBtn");
    const taskForm = document.getElementById("taskForm");
    const taskIdInput = document.getElementById("taskId");
    const taskTitleInput = document.getElementById("taskTitle");
    const taskDescriptionInput = document.getElementById("taskDescription");
    const taskCategoryInput = document.getElementById("taskCategory");
    const taskPriorityInput = document.getElementById("taskPriority");
    const taskAmountInput = document.getElementById("taskAmount");
    const taskDueDateInput = document.getElementById("taskDueDate");
    const taskStatusInput = document.getElementById("taskStatus");
    const taskLaneInput = document.getElementById("taskLane");
    const cancelBtn = document.getElementById("cancelBtn");

    /*--------------------------------------------------
     * Board Setup
     *--------------------------------------------------*/

    lanes.forEach((lane) => {
    const laneEl = laneTemplate.content.firstElementChild.cloneNode(true);
    laneEl.dataset.lane = lane.id;
    laneEl.querySelector("h3").textContent = lane.name;

    // Lane drag events — now guarded with a drag-handle check
   laneEl.addEventListener("dragstart", (e) => {
  const isFromHandle = e.target.classList.contains("lane-drag-handle");
  const isTask = e.target.closest(".task"); // Detect if dragging a task

  if (isFromHandle && !isTask) {
    handleLaneDragStart(e);
  } else if (!isTask) {
    e.preventDefault(); // Prevent lane drag from other parts
  }
  // If it's a task, allow it to drag normally (handled separately)
});


    laneEl.addEventListener("dragover", handleLaneDragOver);
    laneEl.addEventListener("drop", handleLaneDrop);

    // Allow dropping tasks inside lane body
    laneEl.querySelector(".tasklist").addEventListener("drop", handleTaskDrop);
    board.appendChild(laneEl);
    });


    /*--------------------------------------------------
     * Lane Drag & Drop
     *--------------------------------------------------*/
    let draggedLane = null;

    function handleLaneDragStart(event) {
      draggedLane = event.currentTarget;
      event.dataTransfer.effectAllowed = "move";
    }

    function handleLaneDragOver(event) {
      event.preventDefault();
      const lane = event.currentTarget;
      if (lane !== draggedLane) {
        const lanesArray = Array.from(board.children);
        const draggedIndex = lanesArray.indexOf(draggedLane);
        const overIndex = lanesArray.indexOf(lane);
        if (draggedIndex < overIndex) {
          board.insertBefore(draggedLane, lane.nextSibling);
        } else {
          board.insertBefore(draggedLane, lane);
        }
      }
    }

    function handleLaneDrop() {
      draggedLane = null;
    }

    /*--------------------------------------------------
     * Task Drag & Drop
     *--------------------------------------------------*/
    function handleTaskDragStart(e) {
      e.dataTransfer.setData("text/plain", e.currentTarget.dataset.id);
      e.currentTarget.classList.add("dragging");
    }

    function handleTaskDragEnd(e) {
      e.currentTarget.classList.remove("dragging");
    }

    function handleTaskDrop(e) {
      e.preventDefault(); // Prevent default to allow drop
      const id = e.dataTransfer.getData("text/plain");
      const lane = e.currentTarget.closest(".lane").dataset.lane;
      const task = tasks.find((t) => t.id === id);
      if (task && lane) {
        task.lane = lane;
        saveTasksToStorage();
        renderTasks();
      }
    }

    /*--------------------------------------------------
     * Modal Handlers
     *--------------------------------------------------*/
    addTaskBtn.addEventListener("click", () => openModal());
    cancelBtn.addEventListener("click", closeModal);

    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = taskIdInput.value || `task-${taskIdCounter++}`;
      const existingIndex = tasks.findIndex((t) => t.id === id);
      const newTask = {
        id,
        title: taskTitleInput.value,
        description: taskDescriptionInput.value,
        category: taskCategoryInput.value,
        priority: taskPriorityInput.value,
        amount: taskAmountInput.value,
        dueDate: taskDueDateInput.value,
        status: taskStatusInput.value,
        lane: taskLaneInput.value, // <-- use selected lane
      };
      if (existingIndex > -1) {
        tasks[existingIndex] = newTask;
      } else {
        tasks.push(newTask);
      }
      saveTasksToStorage(); // <-- Save after change
      renderTasks();
      closeModal();
    });

    deleteBtn.addEventListener("click", () => {
      const id = taskIdInput.value;
      tasks = tasks.filter((t) => t.id !== id);
      saveTasksToStorage(); // <-- Save after change
      renderTasks();
      closeModal();
    });

    /*--------------------------------------------------
     * Task Modal Logic
     *--------------------------------------------------*/
    function openModal(task = null) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      if (task) {
        modalTitle.textContent = "Edit Task";
        taskIdInput.value = task.id;
        taskTitleInput.value = task.title;
        taskDescriptionInput.value = task.description || "";
        taskCategoryInput.value = task.category || "savings";
        taskPriorityInput.value = task.priority || "medium";
        taskAmountInput.value = task.amount || "";
        taskDueDateInput.value = task.dueDate || "";
        taskStatusInput.value = task.status || "research";
        taskLaneInput.value = task?.lane || "planning";
        deleteBtn.classList.remove("hidden");
      } else {
        modalTitle.textContent = "New Task";
        taskForm.reset();
        taskIdInput.value = "";
        deleteBtn.classList.add("hidden");
      }
    }

    function closeModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    /*--------------------------------------------------
     * Task Rendering
     *--------------------------------------------------*/
    function openTask(e) {
      const id = e.currentTarget.dataset.id;
      const task = tasks.find((t) => t.id === id);
      if (task) openModal(task);
    }

    function updateStats() {
      totalTasksEl.textContent = `${tasks.length} tasks`;
      const completed = tasks.filter(t => t.lane === "achieved").length;
      completedTasksEl.textContent = `${completed} achieved`;
    }

    function updateLaneCounts() {
      lanes.forEach(lane => {
        const laneEl = document.querySelector(`.lane[data-lane="${lane.id}"]`);
        const count = tasks.filter(t => t.lane === lane.id).length;
        laneEl.querySelector('.task-count').textContent = count;
      });
    }

    function renderTasks() {
      // Clear all task lists
      document.querySelectorAll(".tasklist").forEach((list) => (list.innerHTML = ""));

      tasks.forEach((task) => {
        const taskEl = taskTemplate.content.firstElementChild.cloneNode(true);
        taskEl.dataset.id = task.id;
        taskEl.querySelector("h4").textContent = task.title;

        // Add priority styling
        taskEl.classList.add(`priority-${task.priority}`);

        // Description
        if (task.description) {
          const descEl = taskEl.querySelector(".task-description");
          descEl.textContent = task.description;
          descEl.classList.remove("hidden");
        }

        // Category badge
        const categoryEl = taskEl.querySelector(".category-badge");
        categoryEl.textContent = task.category;

        // Priority badge
        const priorityEl = taskEl.querySelector(".priority-badge");
        priorityEl.textContent = task.priority;
        priorityEl.className = `priority-badge px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority] || priorityColors.medium}`;

        // Target amount
        if (task.amount) {
          const amountEl = taskEl.querySelector(".target-amount");
          amountEl.textContent = `$${parseFloat(task.amount).toLocaleString()}`;
          amountEl.classList.remove("hidden");
        }

        // Due date
        if (task.dueDate) {
          const dueDateEl = taskEl.querySelector(".due-date");
          const date = new Date(task.dueDate);
          dueDateEl.textContent = date.toLocaleDateString();
          dueDateEl.classList.remove("hidden");
        }

        // Status
        if (task.status) {
          const statusEl = taskEl.querySelector(".status-badge");
          statusEl.textContent = task.status.replace('-', ' ');
          statusEl.className = `status-badge px-2 py-1 rounded text-xs font-medium ${statusColors[task.status] || statusColors.research}`;
          statusEl.classList.remove("hidden");
        }

        // Click to open modal
        taskEl.addEventListener("click", openTask);

        // Drag events
        taskEl.addEventListener("dragstart", handleTaskDragStart);
        taskEl.addEventListener("dragend", handleTaskDragEnd);
        taskEl.setAttribute("draggable", true);


        // Append to correct lane
        const laneEl = document.querySelector(`.lane[data-lane="${task.lane}"] .tasklist`);
        laneEl.appendChild(taskEl);
      });

      updateStats();
      updateLaneCounts();
      saveTasksToStorage(); // <-- Save after drag/drop or other changes
    }

    /*--------------------------------------------------
     * Mobile Quality-of-Life
     *--------------------------------------------------*/
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    let touchTask = null;
    document.addEventListener("touchstart", (e) => {
      const task = e.target.closest(".task");
      if (task) {
        touchTask = task;
        setTimeout(() => {
          if (touchTask) openTask({ currentTarget: touchTask });
          touchTask = null;
        }, 600);
      }
    });
    document.addEventListener("touchend", () => (touchTask = null));

    // Close modal on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Local Storage Helpers
    function saveTasksToStorage() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromStorage() {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        tasks = JSON.parse(stored);
        // Update taskIdCounter to avoid duplicate IDs
        const maxId = tasks.reduce((max, t) => {
          const num = parseInt((t.id || "").replace("task-", ""));
          return isNaN(num) ? max : Math.max(max, num);
        }, 0);
        taskIdCounter = maxId + 1;
      } else if (IS_DEMO) {
        // Sample data for demonstration
        tasks = [
          {
            id: "task-1",
            title: "Build Emergency Fund",
            description: "Save 6 months of expenses as emergency fund",
            category: "savings",
            priority: "high",
            amount: "15000",
            dueDate: "2025-12-31",
            status: "working",
            lane: "action"
          },
          {
            id: "task-2",
            title: "Max Out 401(k)",
            description: "Contribute maximum to employer 401(k) plan",
            category: "investment",
            priority: "high",
            amount: "23000",
            dueDate: "2025-12-31",
            status: "working",
            lane: "action"
          },
          {
            id: "task-3",
            title: "Pay Off Credit Cards",
            description: "Eliminate all high-interest credit card debt",
            category: "debt",
            priority: "high",
            amount: "8500",
            dueDate: "2025-08-31",
            status: "working",
            lane: "review"
          },
          {
            id: "task-4",
            title: "Learn About Index Funds",
            description: "Research and understand low-cost index fund investing",
            category: "education",
            priority: "medium",
            amount: "",
            dueDate: "2025-07-15",
            status: "research",
            lane: "planning"
          },
          {
            id: "task-5",
            title: "Side Hustle Income",
            description: "Generate additional $500/month through freelancing",
            category: "income",
            priority: "medium",
            amount: "6000",
            dueDate: "2025-12-31",
            status: "working",
            lane: "achieved"
          }
        ];
        taskIdCounter = 6;
        saveTasksToStorage();
      } else {
        tasks = [];
        taskIdCounter = 0;
      }
    }

    // Initial load from storage
    loadTasksFromStorage();
    renderTasks();

    // Clear local storage (for testing/resetting)
    // localStorage.removeItem("tasks"); // Remove or comment out in production