# VisionBI — AI-Powered Business Intelligence Dashboard

<div align="center">

![VisionBI Banner](https://img.shields.io/badge/VisionBI-AI%20Dashboard-c9a84c?style=for-the-badge&logo=data:image/svg+xml;base64,)

[![React](https://img.shields.io/badge/React-19.x-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.x-092e20?style=flat-square&logo=django)](https://djangoproject.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-f55036?style=flat-square)](https://groq.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)

**Ask questions about your data in plain English. Get instant charts.**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [API Reference](#api-reference) • [Project Structure](#project-structure)

</div>

---

## What is VisionBI?

VisionBI is a full-stack AI-powered Business Intelligence dashboard that lets anyone — regardless of technical background — upload their CSV data and ask questions about it in plain English.

No SQL knowledge needed.  
No data science degree required.  
Just upload, ask, and see beautiful charts instantly.

> *"Show total revenue by region"* → Bar chart  
> *"Show revenue trend over months"* → Line chart  
> *"Which category has highest sales?"* → Metric card  
> *"Revenue share by category"* → Pie chart  

---



## Features

### 🔐 Authentication
- JWT-based login and signup
- Protected routes — dashboard only accessible after login
- Token stored in localStorage with 1-day expiry
- Auto-redirect to login on token expiry
- Complete user session management

### 📂 File Management
- Upload CSV files with drag and drop support
- Multiple file uploads per user
- Switch between uploaded files anytime
- Files persist between sessions — no re-upload needed
- See All modal shows full upload history with timestamps
- User data completely isolated — no cross-user access

### 🤖 AI Query Engine
- Powered by Llama 3.3 70B via Groq API
- Ask questions in plain English
- LLM reads your column names and generates appropriate query
- Returns structured JSON with SQL query + chart type
- Handles GROUP BY, TOP N, FILTER, AVERAGE, COUNT, METRIC queries
- Month-aware sorting for time-series data

### 📊 Dynamic Charts
- 4 chart types: Bar, Line, Pie, Metric
- Chart type chosen automatically based on query intent
- Delete individual charts
- Each chart shows source filename
- Beautiful luxury dark theme with animations

### 👥 Multi-User Support
- Each user has their own file storage
- Queries only run on the user's own files
- Database-level data isolation
- Multiple users can use simultaneously

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool |
| React Router DOM | 7.x | Client-side routing |
| Recharts | 3.x | Chart rendering |
| Bootstrap | 5.x | Layout and utilities |
| React Icons | 5.x | Icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Django | 5.x | Web framework |
| Django REST Framework | 3.x | API layer |
| SimpleJWT | latest | JWT authentication |
| django-cors-headers | latest | CORS handling |
| Pandas | latest | CSV query engine |
| Groq | latest | LLM API client |
| python-dotenv | latest | Environment variables |

### AI / LLM
| Service | Model | Purpose |
|---------|-------|---------|
| Groq API | Llama 3.3 70B Versatile | Natural language to query conversion |

---

## Project Structure

```
Buisness-Intelligence/
├── Backend/
│   └── backend/
│       ├── api/
│       │   ├── services/
│       │   │   ├── llm_service.py      # Groq AI integration
│       │   │   └── query_engine.py     # Pandas query execution
│       │   ├── migrations/
│       │   ├── models.py               # UploadedFile model
│       │   ├── views.py                # API endpoints
│       │   ├── urls.py                 # API routes
│       │   └── admin.py
│       ├── backend/
│       │   ├── settings.py             # Django configuration
│       │   ├── urls.py                 # Main URL routing
│       │   └── wsgi.py
│       ├── media/
│       │   └── user_files/             # Uploaded CSV storage
│       ├── .env                        # Environment variables
│       ├── manage.py
│       └── requirements.txt
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx              # Navigation + Upload + File Select
    │   │   ├── Dashboard.jsx           # Chart grid layout
    │   │   ├── ChartCard.jsx           # Individual chart renderer
    │   │   ├── QueryInput.jsx          # Query text input
    │   │   ├── Login.jsx               # Login page
    │   │   ├── Signup.jsx              # Signup page
    │   │   ├── Landingpage.jsx         # Landing page
    │   │   ├── Introscreen.jsx         # Intro animation
    │   │   └── WelcomeMsg.jsx          # Empty state message
    │   ├── App.jsx                     # Routes + main logic
    │   ├── App.css                     # Global styles
    │   └── main.jsx                    # React entry point
    ├── package.json
    └── vite.config.js
```

---

## How It Works — Full Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FULL FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. USER VISITS                                             │
│     Intro Screen → Landing Page                             │
│                                                             │
│  2. AUTHENTICATION                                          │
│     Signup/Login → Django JWT → Token saved to localStorage │
│                                                             │
│  3. UPLOAD CSV                                              │
│     Header → New → Upload CSV                               │
│     → Django saves file → Returns file_id                   │
│     → file_id saved to localStorage                         │
│                                                             │
│  4. ASK QUESTION                                            │
│     User types: "show total revenue by region"              │
│     → QueryInput sends: { prompt, file_id }                 │
│     → Django ask() view receives request                    │
│                                                             │
│  5. AI PROCESSING                                           │
│     Django gets CSV columns from file                       │
│     → Sends columns + prompt to Groq (Llama 3.3 70B)       │
│     → Groq returns JSON:                                    │
│       {                                                     │
│         "sql": "SELECT region, SUM(revenue)                 │
│                 FROM df GROUP BY region",                   │
│         "chart": "bar"                                      │
│       }                                                     │
│                                                             │
│  6. QUERY EXECUTION                                         │
│     Pandas reads the CSV file                               │
│     → Parses the SQL pattern                                │
│     → Executes groupby/sum/filter operations                │
│     → Returns structured data rows                          │
│                                                             │
│  7. CHART RENDERING                                         │
│     Django returns: { chart: "bar", data: [...] }           │
│     → React formats data                                    │
│     → Recharts renders Bar/Line/Pie/Metric                  │
│     → Chart appears on dashboard ✅                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites
```
Node.js >= 18.x
Python >= 3.10
pip
Git
Groq API Key (free at console.groq.com)
```

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/dhrubamarik/VISIONBI.git
cd VISIONBI
```

---

### Step 2 — Backend Setup

```bash
# Go to Django project folder
cd Backend/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

---

### Step 3 — Create Environment File

```bash
# Create .env file in Backend/backend/
# Add these variables:
```

```env
SECRET_KEY=django-insecure-your-secret-key-here
GROQ_API_KEY=your-groq-api-key-here
DEBUG=True
```

**Get your free Groq API key:**
```
1. Go to console.groq.com
2. Sign up for free
3. Go to API Keys
4. Create new key
5. Copy and paste into .env
```

---

### Step 4 — Run Database Migrations

```bash
# Still in Backend/backend/
python manage.py makemigrations
python manage.py migrate
```

---

### Step 5 — Start Django Server

```bash
python manage.py runserver
```

```
✅ Django running at: http://127.0.0.1:8000
```

---

### Step 6 — Frontend Setup

```bash
# Open new terminal
# Go to Frontend folder
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

```
✅ React running at: http://localhost:5173
```

---

### Step 7 — Open the App

```
Open browser and go to:
http://localhost:5173

Flow:
1. Watch intro screen
2. Click Enter on landing page
3. Sign up for new account
4. Upload a CSV file (New → Upload CSV)
5. Type a question about your data
6. See charts! ✅
```

---

## Sample CSV Files to Test

### E-Commerce Sales Data
```csv
region,category,revenue,quantity,month
North,Electronics,1200,10,January
South,Clothing,800,15,January
East,Electronics,1500,8,January
West,Furniture,900,5,January
North,Clothing,700,12,February
South,Electronics,1100,9,February
East,Furniture,1300,6,February
West,Clothing,600,14,February
North,Electronics,1600,11,March
South,Furniture,1000,7,March
East,Clothing,900,13,March
West,Electronics,1400,10,March
```

### Restaurant Data
```csv
restaurant,cuisine,orders,revenue,rating,city
Pizza Palace,Italian,340,8500,4.5,New York
Burger Barn,American,520,7800,4.2,Chicago
Sushi Stop,Japanese,210,9200,4.8,New York
Taco Town,Mexican,430,6400,4.1,Houston
Pasta Place,Italian,280,7100,4.4,Chicago
BBQ Bros,American,390,8900,4.6,Houston
```

### Employee HR Data
```csv
department,employee,salary,experience,performance,location
Engineering,Alice,95000,5,Excellent,Bangalore
Marketing,Bob,72000,3,Good,Mumbai
Engineering,Charlie,88000,4,Good,Bangalore
HR,Diana,65000,6,Excellent,Delhi
Sales,Eve,78000,2,Average,Mumbai
Engineering,Frank,102000,7,Excellent,Bangalore
```

---

## Sample Queries to Try

### Basic Queries
```
show total revenue by region
show total revenue by category
show total quantity by category
show revenue by month
```

### Comparison Queries
```
compare electronics vs clothing revenue
compare north vs south revenue
which category has highest revenue
which region has highest revenue
```

### Ranking Queries
```
show top 2 categories by revenue
show top 3 regions by quantity
rank categories by revenue
```

### Average Queries
```
show average revenue by region
show average quantity by category
which month has highest average revenue
```

### Count Queries
```
count records by region
count records by category
how many entries are there for each month
```

### Trend Queries
```
show revenue trend over months
show quantity trend by month
how does revenue change month wise
```

### Single Metric Queries
```
what is total revenue
what is total quantity
which month generated most revenue
```

---

## API Reference

### Authentication

#### Sign Up
```
POST /api/signup/

Body:
{
  "username": "john",
  "password": "secret123"
}

Response:
{
  "message": "User created successfully"
}
```

#### Login (Get JWT Token)
```
POST /api/token/

Body:
{
  "username": "john",
  "password": "secret123"
}

Response:
{
  "access": "eyJhbGci...",
  "refresh": "eyJhbGci..."
}
```

#### Refresh Token
```
POST /api/token/refresh/

Body:
{
  "refresh": "eyJhbGci..."
}
```

---

### File Management

#### Upload CSV
```
POST /api/upload/
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
file: <csv file>

Response:
{
  "message": "File uploaded successfully",
  "file_id": 1,
  "filename": "sales_data.csv"
}
```

#### Get User Files
```
GET /api/files/
Authorization: Bearer <token>

Response:
{
  "files": [
    {
      "id": 1,
      "filename": "sales_data.csv",
      "uploaded_at": "25 Apr 2025, 10:30"
    }
  ]
}
```

---

### Query

#### Ask Question
```
POST /api/ask/
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "prompt": "show total revenue by region",
  "file_id": 1
}

Response:
{
  "chart": "bar",
  "data": [
    { "region": "North", "revenue": 4300 },
    { "region": "South", "revenue": 3900 },
    { "region": "East", "revenue": 4700 },
    { "region": "West", "revenue": 3900 }
  ]
}
```

---

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-django-secret-key
GROQ_API_KEY=your-groq-api-key
DEBUG=True
```

### Frontend (optional .env)
```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## Requirements

### Backend (requirements.txt)
```
django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
pandas
groq
python-dotenv
gunicorn
whitenoise
dj-database-url
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "bootstrap": "^5.3.8",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-icons": "^5.6.0",
    "react-router-dom": "^7.13.1",
    "recharts": "^3.8.0"
  }
}
```

---

## Key Design Decisions

### Why JWT over Session Auth?
```
JWT is stateless - no server-side session storage needed
Works perfectly with React SPA + Django API separation
Token stored client-side - scalable for multiple users
```

### Why Pandas over Real SQL?
```
CSV files don't have a SQL database
Pandas reads CSV directly into DataFrame
We parse LLM-generated SQL patterns
Extract GROUP BY, SUM, FILTER, LIMIT etc
Execute equivalent Pandas operations
Faster than loading CSV into SQLite each time
```

### Why Groq over OpenAI?
```
Groq is free tier friendly - perfect for hackathon
Llama 3.3 70B is extremely capable for SQL generation
Groq inference is fastest in the market
No credit card required for basic usage
```

### Why Single Page App?
```
Better user experience - no page reloads
Charts persist as user asks more questions
Smooth transitions between states
React Router handles URL-based navigation
```

---

## Screenshots

```
Add your screenshots here:
1. Landing Page
2. Login Page  
3. Dashboard with charts
4. File upload modal
5. See All files modal
6. Different chart types
```

---

## Contributing

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## Built With ❤️ At

<div align="center">

**Hackfest** organized by **GeeksforGeeks Classroom Program**

*Dhruba Marik — Team Captain*

</div>

---



<div align="center">

⭐ **Star this repo if you found it useful!** ⭐

*Built with React + Django + Groq AI*

</div>
