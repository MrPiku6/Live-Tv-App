// app/page.js

'use client'; // इस लाइन को सबसे ऊपर रखना ज़रूरी है

import { useState } from 'react';
import './styles.css'; // हम यह CSS फ़ाइल अगले चरण में बनाएँगे

export default function Home() {
  // 'todos' state में हमारे सभी कामों की लिस्ट स्टोर होगी
  const [todos, setTodos] = useState([
    { id: 1, text: 'Next.js सीखें', completed: false },
    { id: 2, text: 'एक To-Do ऐप बनाएँ', completed: true },
  ]);

  // 'inputValue' state में इनपुट बॉक्स का टेक्स्ट स्टोर होगा
  const [inputValue, setInputValue] = useState('');

  // नया to-do जोड़ने के लिए फंक्शन
  const addTodo = () => {
    // अगर इनपुट खाली है तो कुछ न करें
    if (inputValue.trim() === '') return;

    // नया to-do ऑब्जेक्ट बनाएँ
    const newTodo = {
      id: Date.now(), // यूनिक ID के लिए वर्तमान समय का उपयोग करें
      text: inputValue,
      completed: false,
    };

    // पुराने todos के साथ नया to-do जोड़ें
    setTodos([...todos, newTodo]);
    setInputValue(''); // इनपुट बॉक्स खाली करें
  };

  // To-do को पूरा हुआ/नहीं हुआ मार्क करने के लिए फंक्शन
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // To-do को हटाने के लिए फंक्शन
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container">
      <h1>मेरी To-Do लिस्ट</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="नया काम जोड़ें..."
        />
        <button onClick={addTodo}>जोड़ें</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              हटाएँ
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
