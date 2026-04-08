class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoList';
        
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.clearBtn = document.getElementById('clearBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.loadTheme();
        
        this.init();
    }

    init() {
        this.loadTodos();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        this.clearBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveTodos();
        this.todoInput.value = '';
        this.todoInput.focus();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        
        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '<div class="empty-message">No tasks to display</div>';
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="todo-checkbox" 
                        ${todo.completed ? 'checked' : ''}
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn">Delete</button>
                `;

                const checkbox = li.querySelector('.todo-checkbox');
                const deleteBtn = li.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

                this.todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    saveTodos() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    loadTodos() {
        const data = localStorage.getItem(this.storageKey);
        this.todos = data ? JSON.parse(data) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeToggle.textContent = '☀️ Light Mode';
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}
// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});