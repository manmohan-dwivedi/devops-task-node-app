# Task Manager API

A RESTful API built using **Node.js**, **Express**, and **MongoDB** for managing tasks.  
This project follows a structured backend architecture separating routing, business logic, and database layers to maintain clarity, scalability, and maintainability.

---

## Project Structure

```
task-node-app/
│
├── .github/
│   ├── workflows/
│       └── docker-image.yml
|
|
├── src/
│   ├── app.js                 # Express app & MongoDB setup
│   ├── routes/
│   │   └── routes.js          # API route definitions
│   ├── controllers/
│   │   └── controllers.js     # Business logic for each route
│   └── models/
│       └── model.js           # Task schema & validation
├── .env                       # Environment variables
├── package.json              # Dependencies
└── README.md                 # This file
```

---

---

# Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account or local MongoDB installation

---

---
## Installation

1. **Clone/Navigate to the project:**
```bash
cd task-node-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create or update the `.env` file with:
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskdb
```
Replace with your actual MongoDB connection string from MongoDB Atlas.
---

---
## Running the Server

Start the development server:
```bash
npm start
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on port 3000
```
---

---
## API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check API health status |

### Task Management

Base URL: `http://localhost:3000/api/tasks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new task |
| GET | `/` | Get all tasks |
| GET | `/:id` | Get a task by ID |
| PUT | `/:id` | Update a task |
| DELETE | `/:id` | Delete a task |

---

---
## Testing the API

```bash
# Health Check
curl http://localhost:3000/health

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy groceries\",\"description\":\"Milk, eggs, bread\",\"completed\":false}"

# Get all tasks
curl http://localhost:3000/api/tasks

# Get single task (replace TASK_ID with actual ID)
curl http://localhost:3000/api/tasks/TASK_ID

# Update task
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy groceries\",\"completed\":true}"

# Delete task
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID
```

### Using Postman

1. Import the endpoints listed in the API Endpoints table
2. Set the request body to JSON format
3. Use the example payloads shown above

## Request/Response Examples

### Create Task (POST)
**Request:**
```json
{
  "title": "Complete project",
  "description": "Finish Node.js task manager",
  "completed": false
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Complete project",
  "description": "Finish Node.js task manager",
  "completed": false,
  "createdAt": "2026-02-05T10:30:00.000Z",
  "updatedAt": "2026-02-05T10:30:00.000Z"
}
```

### Get All Tasks (GET)
**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "completed": false,
    "createdAt": "2026-02-05T10:30:00.000Z"
  }
]
```
---

## Validation Rules

- **title**: Required, minimum 3 characters
- **description**: Optional, defaults to empty string
- **completed**: Optional boolean, defaults to false

## Error Handling

- **400**: Bad request (validation error or invalid ID)
- **404**: Task not found
- **500**: Server error
- **201**: Task created successfully
- **200**: Request successful

---
## REST Architecture & Request Flow

The API follows a layered REST architecture. Each layer has a specific responsibility to keep the system modular and easy to maintain.

### High-Level Flow

```
Client Request
↓
Express Application (app.js)
↓
Routes Layer
↓
Controllers Layer
↓
Models (Mongoose)
↓
MongoDB Database
↓
Response returned to client
```

---

---
### Flow of REST API under the hood

```
Routing → Controller
- taskRoutes.js maps each HTTP method and path to a specific controller function in taskController.js.
- The router decides *which* controller runs based on the incoming request.

Controller → Model (Database Logic)
- The controller function handles:
  - Reading request data (req.body, req.params, req.query)
  - Validating or preprocessing input (if needed)
  - Calling Mongoose model methods (Task.find(), Task.create(), Task.save(), etc.)
  - Handling errors
  - Sending the HTTP response (usually JSON)

Model → MongoDB
- taskModel.js defines the schema, structure, and validation rules for a task.
- Mongoose acts as an ODM (Object Data Modeling layer), translating model operations into MongoDB queries.
- MongoDB performs data storage and retrieval.

Response Back to Client
- The controller sends the final HTTP response:
  - Success response with data (task object, list, message)
  - Or error response with appropriate HTTP status code.

Flow:

Client → Express App (app.js) → Router (taskRoutes.js)
→ Controller (taskController.js) → Model (taskModel.js)
→ Mongoose → MongoDB

Then the result flows back:

MongoDB → Mongoose → Controller → Express Response → Client (JSON)

```
---