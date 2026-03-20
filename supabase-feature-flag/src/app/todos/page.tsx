'use client';
import { useState, useEffect } from 'react';
import { FeatureFlagGate } from '../../../components/FeatureFlagGate';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('todos');
        if (saved) setTodos(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (inputValue.trim()) {
            setTodos([
                ...todos,
                { id: Date.now().toString(), text: inputValue.trim(), completed: false },
            ]);
            setInputValue('');
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
            ),
        );
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6">Todo App</h1>

            <FeatureFlagGate
                flagKey="test"
                fallback={
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                        <h3 className="font-semibold mb-2">Feature Not Available</h3>
                        <p>Enable the "test" feature flag in the admin dashboard.</p>
                    </div>
                }
            >
                <div className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="What needs to be done?"
                            className="flex-1 px-4 py-3 border rounded-lg"
                        />
                        <button
                            onClick={addTodo}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                </div>
             <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border-2 ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}
              >
                {todo.completed && '✓'}
              </button>
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </FeatureFlagGate>
    </div>
  );
}

            
        