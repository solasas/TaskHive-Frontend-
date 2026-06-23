# Smart Task Manager - React Frontend

A complete React frontend for the Smart Task Manager application with JWT authentication, project management, and task tracking with Kanban board.

## Features

- ✅ User authentication (Login/Register) with JWT
- ✅ Project management with CRUD operations
- ✅ Task management with Kanban board (TODO → IN PROGRESS → DONE)
- ✅ Task priorities (Low, Medium, High) with color coding
- ✅ Task assignment to project members
- ✅ My Tasks page showing all assigned tasks
- ✅ Protected routes requiring authentication
- ✅ Auto logout on token expiration (401 responses)
- ✅ Responsive design with Tailwind CSS
- ✅ Drag and drop task status updates

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with interceptors
├── context/
│   └── AuthContext.jsx   # Auth state management
├── components/
│   ├── Navbar.jsx        # Top navigation bar
│   ├── Sidebar.jsx       # Project sidebar
│   ├── ProjectCard.jsx   # Project display card
│   ├── TaskCard.jsx      # Task display card
│   ├── KanbanBoard.jsx   # Kanban board component
│   ├── ProtectedRoute.jsx # Protected route wrapper
│   └── modals/
│       ├── CreateProjectModal.jsx
│       ├── CreateTaskModal.jsx
│       └── EditTaskModal.jsx
├── pages/
│   ├── Login.jsx         # Login page
│   ├── Register.jsx      # Register page
│   ├── Dashboard.jsx     # Projects dashboard
│   ├── ProjectDetail.jsx # Project tasks view
│   └── MyTasks.jsx       # User tasks page
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Backend API Configuration

Update the API base URL in `src/api/axios.js`:

```javascript
const API_BASE_URL = "http://localhost:8080";
```

## Authentication Flow

1. **Register** - Create new account at `/register`
2. **Login** - Get JWT token at `/login`
3. **Token Storage** - Token saved in localStorage
4. **Protected Routes** - Token required to access dashboard and tasks
5. **Auto Logout** - 401 responses redirect to login

## Available Pages

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - All projects
- `/projects/:id` - Project tasks (Kanban board)
- `/my-tasks` - Tasks assigned to current user

## Component Features

### Navbar

- App branding
- Navigation links
- User name display
- Logout button

### Sidebar

- Project list
- New project button
- Quick project navigation

### Dashboard

- Grid of project cards
- Project info (name, description, owner, members)
- Create project button
- Delete project (owner only)

### Project Detail (Kanban)

- Three-column Kanban board (TODO → IN_PROGRESS → DONE)
- Drag and drop task status updates
- Task creation
- Task editing
- Task deletion
- Task details (title, priority, assignee, due date)

### My Tasks

- Table of all assigned tasks
- Filter by status and priority
- Project information
- Due date display
- Color-coded status and priority badges

## Error Handling

- API errors displayed touser
- 401 Unauthorized redirects to login
- Form validation on client side
- Loading spinners during API calls
- Error messages for failed operations

## Notes

- All timestamps in ISO format (datetime or date only)
- Status values: TODO, IN_PROGRESS, DONE
- Priority values: LOW, MEDIUM, HIGH
- Color coding: LOW=green, MEDIUM=yellow, HIGH=red
- Status colors: TODO=gray, IN_PROGRESS=blue, DONE=green
# TaskHive-Frontend-
