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

# Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account or local MongoDB installation


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
## API Endpoints

### Health Check

Base URL: `http://localhost:3000

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

---
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


### Cotainerization

- **Basic containerization**
    - Create Dockerfile
    
    ```bash
    FROM node:18
    
    WORKDIR /app
    
    COPY package*.json ./
    
    RUN npm install
    
    COPY . .
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    ```
    
    - Create .dockerignore
    
    ```bash
    node_modules
    npm-debug.log
    .git
    .env
    ```
    
    - Build docker image
    
    ```bash
    docker build -t devops-project1 .
    ```
    
    - Run container : use --env-file .env  for local .env file
    
    ```bash
    docker run --env-file .env -p 3000:3000 devops-project1
    ```
    
- **Professional Dockerfile (Multi-Stage + Optimization)**
    - Why Multi-Stage Build?
        
        Normal Dockerfile:
        
        👉 installs everything
        👉 keeps dev dependencies
        👉 bigger image size
        👉 slower startup
        
        Multi-stage build:
        
        👉 one stage builds app
        👉 final stage contains ONLY runtime requirements
        
        Think of it like:
        
        Kitchen = build stage
        
        Serving plate = runtime stage
        
    
    ```bash
    # -------- BUILD STAGE --------
    FROM node:18-alpine AS builder
    
    WORKDIR /app
    
    COPY package*.json ./
    
    RUN npm ci
    # npm ci instead of npm install Uses lockfile and Faster
    
    COPY . .
    
    # -------- RUNTIME STAGE --------
    FROM node:18-alpine
    
    WORKDIR /app
    
    # copy only necessary files from builder
    COPY --from=builder /app /app
    
    ENV NODE_ENV=production
    
    EXPOSE 3000
    
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    CMD ["npm", "start"]
    ```
    
    - What just happened
        
        Two containers exist during build:
        
        1️⃣ builder stage
        
        - installs dependencies
        - prepares app
        
        2️⃣ final runtime stage
        
        - receives only built app
        
        Benefits:
        
        - cleaner layers
        - industry-standard pattern
        - foundation for scaling later
    - Imp Security optimization - Non-root User
        
        Containers running as root = security risk.
        
        ```bash
        RUN addgroup -S appgroup && adduser -S appuser -G appgroup
        USER appuser
        ```
        
        This part uses Alpine Linux syntax (indicated by the `-S` flag) to set up the environment:
        
        - **`addgroup -S appgroup`**: Creates a **system group** (`S`) named "appgroup." Groups are used to manage permissions for multiple users at once.
        - **`&&`**: This is a logical "AND." It tells Docker to only run the next command if the first one succeeds. This keeps the image layers clean.
        - **`adduser -S appuser -G appgroup`**: Creates a **system user** (`S`) named "appuser" and immediately assigns them to the "appgroup" (`G`).

### Push container image to registry (GHCR)

- **Image name → Standard naming:**

```bash
ghcr.io/<github-username>/<repo-name>:tag
```

- **Login to GHCR from terminal**
- Create token: GitHub → Settings → Developer Settings → Personal Access Tokens
    
    ```bash
    write:packages
    read:packages
    repo
    ```
    
- Login :

```bash
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

- Tag image ( v1, v2…)

```bash
docker tag devops-project1 ghcr.io/<username>/<repo-name>:v1
```

- Push image

```bash
docker push ghcr.io/<username>/<repo-name>:v1
```

- always tag lastest version image bt **latest** tag

### CI/CD with GitHub Actions

```bash
git push
   ↓
GitHub Actions starts
   ↓
Docker image builds
   ↓
Image pushed to GHCR
   ↓
Ready for deployment
```

In repo create 

```bash
.github/
└── workflows/
    └── docker-image.yml
```

docker-image.yml

```bash
name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
```

- what this pipeline does
    - `checkout` → gets your code
    - `buildx` → modern Docker builder
    - `login` → secure registry auth (no PAT required)
    - `build-push` → builds + pushes image
    - `tags`:
        - `latest` → easy deployments
        - `commit SHA` → perfect traceability
- Now push code to github and verify pipeline.
- If it fails with 403 Forbidden
    - Problem
        
        ```bash
        403 Forbidden during push to ghcr.io
        ```
        
        - GitHub Actions authenticated successfully
        - BUT does **not have permission to push package**
    - Solution
        - Pckage and repo visibilty should match.
        - Manual push earlier using PAT, GHCR may have created package with different ownership permissions.
        - Delete the package temporarily. Sometimes initial push creates permission lock.
        - Then re-run pipeline and let Actions recreate package.
        
    

### Deploy Container on Render

```bash
GitHub push
     ↓
GitHub Actions builds image
     ↓
Image pushed to GHCR
     ↓
Render pulls image
     ↓
Live running service
```

- Create Render Account, Sign up with GitHub.
- Select container image or use image URL
- Environment Variables
    - Enter variables on render
    - .env never pushed with code
- Now deploy
- Now  verify api health

```bash
name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
```

- what this pipeline does
    - `checkout` → gets your code
    - `buildx` → modern Docker builder
    - `login` → secure registry auth (no PAT required)
    - `build-push` → builds + pushes image
    - `tags`:
        - `latest` → easy deployments
        - `commit SHA` → perfect traceability
- Now push code to github and verify pipeline.
- If it fails with 403 Forbidden
    - Problem
        
        ```bash
        403 Forbidden during push to ghcr.io
        ```
        
        - GitHub Actions authenticated successfully
        - BUT does **not have permission to push package**
    - Solution
        - Pckage and repo visibilty should match.
        - Manual push earlier using PAT, GHCR may have created package with different ownership permissions.
        - Delete the package temporarily. Sometimes initial push creates permission lock.
        - Then re-run pipeline and let Actions recreate package.
        
    

### Automatic/Continues Deployment (Deploy Hook)/ CD

```bash
git push
   ↓
CI builds image
   ↓
Image pushed to GHCR
   ↓
Render detects update
   ↓
Render pulls image
   ↓
Live service updates automatically
```

- Render does NOT automatically redeploy when new image is pushed (by default with registry images).
- **Deploy Hook**
    - Get Render Deploy Hook
        - Service → Settings → Deploy Hook
    - Add GitHub Secret
        - GitHub Repo → Settings → Secrets → Actions → New Repository Secret
        - Name hook and put hook URL(from render) in value
    - Update workflow for triggering deploy hook
        
        ```bash
        name: Build and Push Docker Image
        
        on:
          push:
            branches:
              - main
        
        jobs:
          build:
            runs-on: ubuntu-latest
        
            permissions:
              contents: read
              packages: write
        
            steps:
              - name: Checkout repository
                uses: actions/checkout@v4
        
              - name: Set up Docker Buildx
                uses: docker/setup-buildx-action@v3
        
              - name: Login to GitHub Container Registry
                uses: docker/login-action@v3
                with:
                  registry: ghcr.io
                  username: ${{ github.actor }}
                  password: ${{ secrets.GITHUB_TOKEN }}
        
              - name: Build and push Docker image
                uses: docker/build-push-action@v5
                with:
                  push: true
                  tags: |
                    ghcr.io/${{ github.repository }}:latest
                    ghcr.io/${{ github.repository }}:${{ github.sha }}
        
              - name: Trigger Render Deploy
                run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
        
        ```
### Cotainerization

- **Basic containerization**
    - Create Dockerfile
    
    ```bash
    FROM node:18
    
    WORKDIR /app
    
    COPY package*.json ./
    
    RUN npm install
    
    COPY . .
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    ```
    
    - Create .dockerignore
    
    ```bash
    node_modules
    npm-debug.log
    .git
    .env
    ```
    
    - Build docker image
    
    ```bash
    docker build -t devops-project1 .
    ```
    
    - Run container : use --env-file .env  for local .env file
    
    ```bash
    docker run --env-file .env -p 3000:3000 devops-project1
    ```
    
- **Professional Dockerfile (Multi-Stage + Optimization)**
    - Why Multi-Stage Build?
        
        Normal Dockerfile:
        
        👉 installs everything
        👉 keeps dev dependencies
        👉 bigger image size
        👉 slower startup
        
        Multi-stage build:
        
        👉 one stage builds app
        👉 final stage contains ONLY runtime requirements
        
        Think of it like:
        
        Kitchen = build stage
        
        Serving plate = runtime stage
        
    
    ```bash
    # -------- BUILD STAGE --------
    FROM node:18-alpine AS builder
    
    WORKDIR /app
    
    COPY package*.json ./
    
    RUN npm ci
    # npm ci instead of npm install Uses lockfile and Faster
    
    COPY . .
    
    # -------- RUNTIME STAGE --------
    FROM node:18-alpine
    
    WORKDIR /app
    
    # copy only necessary files from builder
    COPY --from=builder /app /app
    
    ENV NODE_ENV=production
    
    EXPOSE 3000
    
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    CMD ["npm", "start"]
    ```
    
    - What just happened
        
        Two containers exist during build:
        
        1️⃣ builder stage
        
        - installs dependencies
        - prepares app
        
        2️⃣ final runtime stage
        
        - receives only built app
        
        Benefits:
        
        - cleaner layers
        - industry-standard pattern
        - foundation for scaling later
    - Imp Security optimization - Non-root User
        
        Containers running as root = security risk.
        
        ```bash
        RUN addgroup -S appgroup && adduser -S appuser -G appgroup
        USER appuser
        ```
        
        This part uses Alpine Linux syntax (indicated by the `-S` flag) to set up the environment:
        
        - **`addgroup -S appgroup`**: Creates a **system group** (`S`) named "appgroup." Groups are used to manage permissions for multiple users at once.
        - **`&&`**: This is a logical "AND." It tells Docker to only run the next command if the first one succeeds. This keeps the image layers clean.
        - **`adduser -S appuser -G appgroup`**: Creates a **system user** (`S`) named "appuser" and immediately assigns them to the "appgroup" (`G`).

### Push container image to registry (GHCR)

- **Image name → Standard naming:**

```bash
ghcr.io/<github-username>/<repo-name>:tag
```

- **Login to GHCR from terminal**
- Create token: GitHub → Settings → Developer Settings → Personal Access Tokens
    
    ```bash
    write:packages
    read:packages
    repo
    ```
    
- Login :

```bash
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

- Tag image ( v1, v2…)

```bash
docker tag devops-project1 ghcr.io/<username>/<repo-name>:v1
```

- Push image

```bash
docker push ghcr.io/<username>/<repo-name>:v1
```

- always tag lastest version image bt **latest** tag

### CI/CD with GitHub Actions

```bash
git push
   ↓
GitHub Actions starts
   ↓
Docker image builds
   ↓
Image pushed to GHCR
   ↓
Ready for deployment
```

In repo create 

```bash
.github/
└── workflows/
    └── docker-image.yml
```

docker-image.yml

```bash
name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
```        
- what this pipeline does
    - `checkout` → gets your code
    - `buildx` → modern Docker builder
    - `login` → secure registry auth (no PAT required)
    - `build-push` → builds + pushes image
    - `tags`:
        - `latest` → easy deployments
        - `commit SHA` → perfect traceability
- Now push code to github and verify pipeline.
