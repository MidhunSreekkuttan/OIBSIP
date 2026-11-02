/**
 * TaskMaster — Interactive To-Do Web Application
 * Tech Stack: HTML5, CSS3, Vanilla JavaScript (ES6+)
 * Powered by Lucide Icons
 * 
 * Features:
 * - Lucide Icons integration with offline SVG fallback
 * - Add, Complete, Inline Edit, and Delete tasks
 * - Split into Pending Tasks and Completed Tasks
 * - Real-time task count indicators ("X pending", "Y completed")
 * - Detailed timestamps (created date/time & completed date/time)
 * - Persistent storage with localStorage
 * - Friendly empty states with Lucide visual icons
 * - Search filter & priority categorization (High, Medium, Low)
 * - Light / Dark mode theme toggle with persistence
 * - Interactive toast notification system
 */

(() => {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'taskmaster_tasks_v1';
  const THEME_KEY = 'taskmaster_theme';

  // Fallback SVG dictionary for official Lucide icons in case CDN is unreachable offline
  const LUCIDE_FALLBACK_SVGS = {
    'list-todo': '<rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'plus-circle': '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'check-circle-2': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'check-check': '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
    'pencil': '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    'trash-2': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'clipboard-list': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    'trophy': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>'
  };

  // Seed tasks on first-time launch
  const DEFAULT_INITIAL_TASKS = [
    {
      id: 'task-1',
      text: 'Review project requirements & submission criteria',
      priority: 'high',
      completed: false,
      createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
      completedAt: null
    },
    {
      id: 'task-2',
      text: 'Develop interactive to-do list with pending & completed sections',
      priority: 'high',
      completed: true,
      createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
      completedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString()
    },
    {
      id: 'task-3',
      text: 'Test inline editing, delete functionality, and localStorage persistence',
      priority: 'medium',
      completed: false,
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      completedAt: null
    }
  ];

  // --- State ---
  let tasks = [];
  let editingTaskId = null;
  let searchQuery = '';
  let priorityFilter = 'all';

  // --- DOM Elements ---
  const elements = {
    // Header
    currentDateDisplay: document.getElementById('currentDateDisplay'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),

    // Input form
    taskForm: document.getElementById('taskForm'),
    taskInput: document.getElementById('taskInput'),
    prioritySelect: document.getElementById('prioritySelect'),
    clearInputBtn: document.getElementById('clearInputBtn'),
    formFeedback: document.getElementById('formFeedback'),

    // Search and filters
    searchInput: document.getElementById('searchInput'),
    filterPriority: document.getElementById('filterPriority'),

    // Pending Section
    pendingTaskList: document.getElementById('pendingTaskList'),
    pendingCountBadge: document.getElementById('pendingCountBadge'),
    pendingEmptyState: document.getElementById('pendingEmptyState'),

    // Completed Section
    completedTaskList: document.getElementById('completedTaskList'),
    completedCountBadge: document.getElementById('completedCountBadge'),
    completedEmptyState: document.getElementById('completedEmptyState'),
    clearCompletedBtn: document.getElementById('clearCompletedBtn'),

    // Toasts
    toastContainer: document.getElementById('toastContainer')
  };

  // --- Lucide Icon Renderer ---
  function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      // Fallback: convert [data-lucide] to Lucide SVGs if offline/CDN unavailable
      const unrenderedIcons = document.querySelectorAll('[data-lucide]');
      unrenderedIcons.forEach(el => {
        const iconName = el.getAttribute('data-lucide');
        const innerPath = LUCIDE_FALLBACK_SVGS[iconName];
        if (innerPath) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          svg.setAttribute('stroke-width', '2');
          svg.setAttribute('stroke-linecap', 'round');
          svg.setAttribute('stroke-linejoin', 'round');
          svg.className.baseVal = `lucide lucide-${iconName} ${el.className || ''}`.trim();
          svg.innerHTML = innerPath;
          el.parentNode.replaceChild(svg, el);
        }
      });
    }
  }

  // --- Helper: Format Timestamps ---
  function formatTimestamp(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isYesterday =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toDateString() ===
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
      return `Today at ${timeStr}`;
    } else if (isYesterday) {
      return `Yesterday at ${timeStr}`;
    } else {
      const monthStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `${monthStr}, ${timeStr}`;
    }
  }

  // Helper: Format today's date in header
  function initDateHeader() {
    const today = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    if (elements.currentDateDisplay) {
      elements.currentDateDisplay.textContent = today.toLocaleDateString(undefined, options);
    }
  }

  // --- LocalStorage Management ---
  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        tasks = JSON.parse(saved);
      } else {
        tasks = [...DEFAULT_INITIAL_TASKS];
        saveTasks();
      }
    } catch (err) {
      console.error('Failed to load tasks from localStorage:', err);
      tasks = [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err);
    }
  }

  // --- Theme Management ---
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    showToast(`Switched to ${newTheme} theme`, 'info');
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    else if (type === 'danger') iconName = 'alert-circle';

    toast.innerHTML = `<i data-lucide="${iconName}"></i><span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);
    refreshLucideIcons();

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  // Helper to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Task CRUD Operations ---

  // 1. Add Task
  function handleAddTask(e) {
    e.preventDefault();
    const text = elements.taskInput.value.trim();
    const priority = elements.prioritySelect.value || 'medium';

    if (!text) {
      showFormFeedback('Please enter a task description.');
      elements.taskInput.focus();
      return;
    }

    clearFormFeedback();

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      text: text,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    tasks.unshift(newTask);
    saveTasks();
    render();

    elements.taskInput.value = '';
    elements.clearInputBtn.classList.add('hidden');
    elements.taskInput.focus();
    showToast('Task added to Pending list', 'success');
  }

  function showFormFeedback(msg) {
    if (elements.formFeedback) {
      elements.formFeedback.textContent = msg;
      elements.formFeedback.classList.add('show');
    }
  }

  function clearFormFeedback() {
    if (elements.formFeedback) {
      elements.formFeedback.textContent = '';
      elements.formFeedback.classList.remove('show');
    }
  }

  // 2. Toggle Complete
  function toggleTaskComplete(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    task.completed = !task.completed;

    if (task.completed) {
      task.completedAt = new Date().toISOString();
      showToast('Task marked as complete! 🎉', 'success');
    } else {
      task.completedAt = null;
      showToast('Task moved back to Pending', 'info');
    }

    saveTasks();
    render();
  }

  // 3. Delete Task
  function deleteTask(id) {
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
      taskElement.classList.add('deleting');
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        if (editingTaskId === id) editingTaskId = null;
        saveTasks();
        render();
        showToast('Task deleted permanently', 'danger');
      }, 200);
    } else {
      tasks = tasks.filter(t => t.id !== id);
      if (editingTaskId === id) editingTaskId = null;
      saveTasks();
      render();
      showToast('Task deleted', 'danger');
    }
  }

  // 4. Inline Edit: Start
  function startEditingTask(id) {
    editingTaskId = id;
    render();

    const input = document.getElementById(`edit-input-${id}`);
    if (input) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }

  // 5. Inline Edit: Save
  function saveEditedTask(id) {
    const input = document.getElementById(`edit-input-${id}`);
    const prioSelect = document.getElementById(`edit-prio-${id}`);
    if (!input) return;

    const newText = input.value.trim();
    if (!newText) {
      showToast('Task title cannot be empty', 'danger');
      input.focus();
      return;
    }

    const task = tasks.find(t => t.id === id);
    if (task) {
      task.text = newText;
      if (prioSelect) {
        task.priority = prioSelect.value;
      }
      editingTaskId = null;
      saveTasks();
      render();
      showToast('Task updated successfully', 'success');
    }
  }

  // 6. Inline Edit: Cancel
  function cancelEditingTask() {
    editingTaskId = null;
    render();
  }

  // 7. Clear All Completed Tasks
  function clearAllCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    if (confirm(`Are you sure you want to delete all ${completedCount} completed task(s)?`)) {
      tasks = tasks.filter(t => !t.completed);
      saveTasks();
      render();
      showToast('All completed tasks removed', 'info');
    }
  }

  // --- Filter and Search ---
  function getFilteredTasks() {
    return tasks.filter(task => {
      const matchesSearch = !searchQuery || task.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }

  // --- Render Functions ---
  function render() {
    const filtered = getFilteredTasks();

    const pendingTasks = filtered.filter(t => !t.completed);
    const completedTasks = filtered.filter(t => t.completed);

    const totalPending = tasks.filter(t => !t.completed).length;
    const totalCompleted = tasks.filter(t => t.completed).length;

    // Update count indicators
    elements.pendingCountBadge.textContent = `${totalPending} pending`;
    elements.completedCountBadge.textContent = `${totalCompleted} completed`;

    // Render Pending List
    renderTaskList(elements.pendingTaskList, pendingTasks, false);
    toggleEmptyState(elements.pendingEmptyState, pendingTasks.length === 0, 'pending');

    // Render Completed List
    renderTaskList(elements.completedTaskList, completedTasks, true);
    toggleEmptyState(elements.completedEmptyState, completedTasks.length === 0, 'completed');

    // Clear completed button state
    if (elements.clearCompletedBtn) {
      elements.clearCompletedBtn.style.display = totalCompleted > 0 ? 'inline-flex' : 'none';
    }

    // Refresh all Lucide icons in the DOM
    refreshLucideIcons();
  }

  function toggleEmptyState(emptyStateEl, isEmpty, type) {
    if (!emptyStateEl) return;
    if (isEmpty) {
      emptyStateEl.classList.remove('hidden');
      const titleEl = emptyStateEl.querySelector('.empty-title');
      const descEl = emptyStateEl.querySelector('.empty-desc');

      if (searchQuery || priorityFilter !== 'all') {
        if (titleEl) titleEl.textContent = 'No matching tasks';
        if (descEl) descEl.textContent = 'Try adjusting your search query or priority filter.';
      } else {
        if (type === 'pending') {
          if (titleEl) titleEl.textContent = 'All caught up!';
          if (descEl) descEl.textContent = 'You have no pending tasks. Add a new task above to get started.';
        } else {
          if (titleEl) titleEl.textContent = 'No completed tasks yet';
          if (descEl) descEl.textContent = 'Mark tasks as complete to see them organized neatly right here.';
        }
      }
    } else {
      emptyStateEl.classList.add('hidden');
    }
  }

  function renderTaskList(containerEl, taskList, isCompletedList) {
    containerEl.innerHTML = '';

    taskList.forEach(task => {
      const isEditing = editingTaskId === task.id;
      const li = document.createElement('li');
      li.className = `task-item ${isEditing ? 'editing' : ''}`;
      li.setAttribute('data-task-id', task.id);

      if (isEditing) {
        // Render Inline Edit Mode with Lucide Icons
        li.innerHTML = `
          <div class="edit-mode-form">
            <div class="edit-input-row">
              <input
                type="text"
                id="edit-input-${task.id}"
                class="edit-task-input"
                value="${escapeHtml(task.text)}"
                maxlength="250"
                aria-label="Edit task title"
              />
              <select id="edit-prio-${task.id}" class="edit-prio-select" aria-label="Edit priority">
                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>🔥 High</option>
                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>⚡ Medium</option>
                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>🌱 Low</option>
              </select>
            </div>
            <div class="edit-actions">
              <button type="button" class="btn-edit-save" data-action="save-edit" data-id="${task.id}" title="Save changes (Enter)">
                <i data-lucide="check"></i>
                <span>Save</span>
              </button>
              <button type="button" class="btn-edit-cancel" data-action="cancel-edit" title="Cancel changes (Esc)">
                <i data-lucide="x"></i>
                <span>Cancel</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Standard View Mode with Lucide Icons
        const priorityLabel = task.priority ? task.priority.toUpperCase() : 'MEDIUM';
        const createdFormatted = formatTimestamp(task.createdAt);
        const completedFormatted = formatTimestamp(task.completedAt);

        li.innerHTML = `
          <div class="task-main-row">
            <label class="checkbox-wrap" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
              <input
                type="checkbox"
                class="task-checkbox"
                data-action="toggle-complete"
                data-id="${task.id}"
                ${task.completed ? 'checked' : ''}
                aria-label="Mark task '${escapeHtml(task.text)}' as ${task.completed ? 'pending' : 'complete'}"
              />
            </label>

            <div class="task-content">
              <p class="task-title" data-action="title-click" data-id="${task.id}" title="Click to edit">${escapeHtml(task.text)}</p>
              
              <div class="task-meta">
                <span class="priority-pill prio-${task.priority || 'medium'}">${priorityLabel}</span>
                
                <span class="task-timestamp" title="Created: ${new Date(task.createdAt).toLocaleString()}">
                  <i data-lucide="clock"></i>
                  <span>Added ${createdFormatted}</span>
                </span>

                ${task.completed && task.completedAt ? `
                  <span class="task-timestamp" style="color: var(--success);" title="Completed: ${new Date(task.completedAt).toLocaleString()}">
                    <i data-lucide="check-check"></i>
                    <span>Done ${completedFormatted}</span>
                  </span>
                ` : ''}
              </div>
            </div>

            <div class="task-actions">
              <button
                type="button"
                class="action-btn edit-btn"
                data-action="edit-task"
                data-id="${task.id}"
                title="Edit task"
                aria-label="Edit task"
              >
                <i data-lucide="pencil"></i>
              </button>
              <button
                type="button"
                class="action-btn delete-btn"
                data-action="delete-task"
                data-id="${task.id}"
                title="Delete task"
                aria-label="Delete task"
              >
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `;
      }

      containerEl.appendChild(li);
    });
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Theme toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Form submit
    elements.taskForm.addEventListener('submit', handleAddTask);

    // Input text field dynamic clear button & typing feedback
    elements.taskInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length > 0) {
        elements.clearInputBtn.classList.remove('hidden');
        clearFormFeedback();
      } else {
        elements.clearInputBtn.classList.add('hidden');
      }
    });

    // Clear input button
    elements.clearInputBtn.addEventListener('click', () => {
      elements.taskInput.value = '';
      elements.clearInputBtn.classList.add('hidden');
      elements.taskInput.focus();
    });

    // Search and filter
    elements.searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      render();
    });

    elements.filterPriority.addEventListener('change', (e) => {
      priorityFilter = e.target.value;
      render();
    });

    // Clear completed tasks button
    if (elements.clearCompletedBtn) {
      elements.clearCompletedBtn.addEventListener('click', clearAllCompleted);
    }

    // Delegated click handling for pending & completed task lists
    const handleListClick = (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');

      switch (action) {
        case 'toggle-complete':
          toggleTaskComplete(id);
          break;
        case 'edit-task':
        case 'title-click':
          startEditingTask(id);
          break;
        case 'delete-task':
          deleteTask(id);
          break;
        case 'save-edit':
          saveEditedTask(id);
          break;
        case 'cancel-edit':
          cancelEditingTask();
          break;
      }
    };

    elements.pendingTaskList.addEventListener('click', handleListClick);
    elements.completedTaskList.addEventListener('click', handleListClick);

    // Delegated keyboard handling for inline edit fields (Enter = save, Escape = cancel)
    const handleListKeyDown = (e) => {
      if (e.target.classList.contains('edit-task-input')) {
        const taskId = editingTaskId;
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEditedTask(taskId);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEditingTask();
        }
      }
    };

    elements.pendingTaskList.addEventListener('keydown', handleListKeyDown);
    elements.completedTaskList.addEventListener('keydown', handleListKeyDown);
  }

  // --- Initialize App ---
  function init() {
    initTheme();
    initDateHeader();
    loadTasks();
    render();
    setupEventListeners();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
