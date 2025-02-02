import React, { useState, useEffect } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach(task => {
        const taskDeadline = new Date(task.deadline);
        const now = new Date();
        const diffTime = Math.abs(taskDeadline - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 3) {
          alert(`Reminder: Task "${task.name}" is due in ${diffDays} day(s)!`);
        }
      });
    }, 86400000); // 1 day in milliseconds

    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = () => {
    setTasks([...tasks, { name: newTask, deadline }]);
    setNewTask('');
    setDeadline('');
  };

  return (
    <div>
      <h1>Tasks</h1>
      <div>
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        {tasks.map((task, index) => (
          <div key={index}>
            <h2>{task.name}</h2>
            <p>Deadline: {task.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
