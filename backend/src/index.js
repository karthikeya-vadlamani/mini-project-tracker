const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const client = require('prom-client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const router = express.Router(); // Create the router

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES (Attached to the router) ---

// Health check -> reachable at /api/health
router.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "UP connected",
      database: "CONNECTED",
      service: "backend-api",
    });
  } catch (error) {
    console.error("[HEALTH_CHECK_ERROR]", error.message);
    res.status(500).json({ status: "DOWN", database: "DISCONNECTED" });
  }
});

// Get all tasks -> reachable at /api/tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    console.error("[GET_TASKS_ERROR]", error.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create task -> reachable at /api/tasks
router.post("/tasks", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const task = await prisma.task.create({
      data: { title, description, status, priority },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("[CREATE_TASK_ERROR]", error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task -> reachable at /api/tasks/:id
router.put("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, status, priority } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status, priority },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("[UPDATE_TASK_ERROR]", error.message);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task -> reachable at /api/tasks/:id
router.delete("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("[DELETE_TASK_ERROR]", error.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// --- APPLY ROUTER ---
// This mounts all the routes above under the /api prefix
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[BACKEND_API] Server running on port ${PORT}`);
});