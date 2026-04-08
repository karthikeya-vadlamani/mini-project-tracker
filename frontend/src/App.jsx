import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
  });

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks`, form);
      setForm({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const updateStatus = async (task) => {
    const nextStatus =
      task.status === "TODO"
        ? "IN_PROGRESS"
        : task.status === "IN_PROGRESS"
        ? "DONE"
        : "TODO";

    try {
      await axios.put(`${API_URL}/tasks/${task.id}`, {
        ...task,
        status: nextStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  return (
    <div className="container">
      <h1>Mini Project Tracker</h1>

      <form className="task-form" onSubmit={createTask}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <button type="submit">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description || "No description"}</p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <div className="task-actions">
                <button onClick={() => updateStatus(task)}>
                  Move Status
                </button>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;