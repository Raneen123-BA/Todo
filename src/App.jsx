import React, { useState, useEffect } from 'react';
import { Plus, Home, CheckCircle, XCircle, User, Calendar, Filter, Search } from 'lucide-react';

const TodoApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [newTodo, setNewTodo] = useState({
    todo: '',
    completed: false,
    userId: ''
  });

  // Fetch todos from API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data.todos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Filter and search todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.todo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && todo.completed) ||
                         (filter === 'pending' && !todo.completed);
    return matchesSearch && matchesFilter;
  });

  // Handle form submission
  const handleSubmit = () => {
    if (!newTodo.todo.trim() || !newTodo.userId) {
      alert('Please fill in all required fields');
      return;
    }

    const todoToAdd = {
      id: Math.max(...todos.map(t => t.id), 0) + 1,
      todo: newTodo.todo,
      completed: newTodo.completed,
      userId: parseInt(newTodo.userId)
    };

    setTodos(prev => [todoToAdd, ...prev]);
    
    setNewTodo({
      todo: '',
      completed: false,
      userId: ''
    });

    setCurrentPage('home');
    alert('Todo added successfully!');
  };

  // Navigation component with glassmorphism effect
  const Navbar = () => (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                TodoFlow
              </h1>
              <p className="text-xs text-gray-500 font-medium">Stay organized, stay productive</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                currentPage === 'home' 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('add')}
              className={`flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                currentPage === 'add' 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Todo
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Enhanced Todo Card Component
  const TodoCard = ({ todo, index }) => (
    <div className={`group relative bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 ${
      todo.completed ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/50' : 'bg-gradient-to-br from-white to-gray-50/30'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          todo.completed 
            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
            : 'bg-gradient-to-br from-gray-200 to-gray-300'
        }`}>
          {todo.completed ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <XCircle className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          todo.completed 
            ? 'bg-green-100 text-green-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {todo.completed ? 'Completed' : 'In Progress'}
        </div>
      </div>
      
      <div className="mb-4">
        <p className={`text-gray-800 text-lg font-medium leading-relaxed ${
          todo.completed ? 'line-through text-gray-500' : ''
        }`}>
          {todo.todo}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-gray-500">
            <User className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">User {todo.userId}</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-medium">
          ID: {todo.id}
        </div>
      </div>

      {/* Subtle animation element */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );

  // Stats Card Component
  const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-3xl p-6 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  // Home/Dashboard Page
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Your Todo Dashboard
          </h2>
          <p className="text-gray-600 text-lg">Manage your tasks with style and efficiency</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your todos...</p>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-3xl p-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Unable to load todos</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatsCard
                title="Total Tasks"
                value={todos.length}
                icon={Calendar}
                color="text-blue-600"
                bgColor="bg-gradient-to-br from-blue-50 to-sky-50"
              />
              <StatsCard
                title="Completed"
                value={todos.filter(t => t.completed).length}
                icon={CheckCircle}
                color="text-green-600"
                bgColor="bg-gradient-to-br from-green-50 to-emerald-50"
              />
              <StatsCard
                title="In Progress"
                value={todos.filter(t => !t.completed).length}
                icon={XCircle}
                color="text-amber-600"
                bgColor="bg-gradient-to-br from-amber-50 to-yellow-50"
              />
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search todos..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed</option>
                    <option value="pending">In Progress</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Todo Grid */}
            {filteredTodos.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTodos.map((todo, index) => (
                  <TodoCard key={todo.id} todo={todo} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm || filter !== 'all' ? 'No matching todos found' : 'No todos yet'}
                </h3>
                <p className="text-gray-500 mb-8">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start by adding your first todo item'}
                </p>
                <button
                  onClick={() => setCurrentPage('add')}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Create your first todo
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Enhanced Add Todo Form Page
  const AddTodoPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Create New Todo
          </h2>
          <p className="text-gray-600 text-lg">Add a new task to stay organized and productive</p>
        </div>

        <div className="bg-white shadow-2xl shadow-gray-100/50 rounded-3xl border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Task Description *
              </label>
              <textarea
                rows={4}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none text-gray-800 placeholder-gray-400"
                placeholder="What would you like to accomplish?"
                value={newTodo.todo}
                onChange={(e) => setNewTodo(prev => ({ ...prev, todo: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Task Status
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  !newTodo.completed 
                    ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}>
                  <input
                    type="radio"
                    name="completed"
                    checked={!newTodo.completed}
                    onChange={() => setNewTodo(prev => ({ ...prev, completed: false }))}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${
                      !newTodo.completed ? 'bg-amber-100' : 'bg-gray-200'
                    }`}>
                      <XCircle className={`w-5 h-5 ${!newTodo.completed ? 'text-amber-600' : 'text-gray-500'}`} />
                    </div>
                    <span className={`font-medium ${!newTodo.completed ? 'text-amber-700' : 'text-gray-600'}`}>
                      In Progress
                    </span>
                  </div>
                </label>
                <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  newTodo.completed 
                    ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}>
                  <input
                    type="radio"
                    name="completed"
                    checked={newTodo.completed}
                    onChange={() => setNewTodo(prev => ({ ...prev, completed: true }))}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${
                      newTodo.completed ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <CheckCircle className={`w-5 h-5 ${newTodo.completed ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <span className={`font-medium ${newTodo.completed ? 'text-green-700' : 'text-gray-600'}`}>
                      Completed
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                User ID *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="1"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                  placeholder="Enter user ID (1, 2, 3...)"
                  value={newTodo.userId}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, userId: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-8 py-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('home')}
              className="px-8 py-4 text-gray-600 font-semibold rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {currentPage === 'home' ? <HomePage /> : <AddTodoPage />}
    </div>
  );
};

export default TodoApp;