# 💸 Expense Tracker

![GitHub repo size](https://img.shields.io/github/repo-size/TacticalReader/Expense-tracker?style=for-the-badge&color=blue)
![GitHub contributors](https://img.shields.io/github/contributors/TacticalReader/Expense-tracker?style=for-the-badge&color=orange)
![GitHub stars](https://img.shields.io/github/stars/TacticalReader/Expense-tracker?style=for-the-badge&color=yellow)
![GitHub forks](https://img.shields.io/github/forks/TacticalReader/Expense-tracker?style=for-the-badge&color=lightgrey)
![GitHub issues](https://img.shields.io/github/issues/TacticalReader/Expense-tracker?style=for-the-badge&color=red)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## 🚀 Live Demo

The website is successfully deployed and live! Check it out here:  
🔗 **[Expense Tracker on Vercel](https://expense-tracker-a5hlpnhm8-gtvcvv-s-projects.vercel.app)**

---

## 🧠 Architecture Decision (Important — Read This First)

| 🛠️ Responsibility | 👤 Who handles it | 💡 Why |
|---|---|---|
| **Login / Signup Auth** | **Supabase directly** | Supabase Auth works without any additional servers — no need to write backend auth code at all |
| **Expense CRUD** (save, fetch, delete expenses) | **Node.js + Express on Render** | Your custom backend talks to Supabase DB securely using a service role key |
| **Local Storage** | **Frontend** | Offline-first cache before syncing to Supabase |
| **Frontend UI** | **React + Vite on Vercel** | Fast deployment, auto CI/CD |

So the flow is:
- 👤 User logs in → **Supabase Auth** gives a JWT token
- 🌐 Frontend sends that token to your **Express backend** on Render
- ⚙️ Express verifies the token and does DB operations on **Supabase PostgreSQL**

**Backend framework: Node.js + Express** — easiest to learn, most tutorials available, perfect for beginners.

---

## 📁 Full Project Structure

```text
expense-tracker/
│
├── 📄 README.md
├── 📄 .gitignore
│
├── 📦 client/                          ← React + Vite (deploy on Vercel)
│   ├── 📄 index.html
│   ├── 📄 vite.config.js
│   ├── 📄 package.json
│   ├── 📄 .env
│   ├── 📄 .env.example
│   ├── 📄 vercel.json
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx                 ← Entry point
│       ├── 📄 App.jsx                  ← Root component + routes
│       │
│       ├── 📁 assets/
│       │   └── 📄 logo.svg
│       │
│       ├── 📁 config/
│       │   └── 📄 supabaseClient.js    ← Supabase client init (for Auth only)
│       │
│       ├── 📁 context/
│       │   ├── 📄 AuthContext.jsx      ← Auth state (user session)
│       │   └── 📄 ExpenseContext.jsx   ← Global expense state
│       │
│       ├── 📁 hooks/
│       │   ├── 📄 useAuth.js           ← Login, signup, logout logic
│       │   ├── 📄 useExpenses.js       ← Fetch/add/delete expense logic
│       │   └── 📄 useLocalStorage.js   ← Local storage read/write hook
│       │
│       ├── 📁 pages/
│       │   ├── 📁 LandingPage/
│       │   │   ├── 📄 LandingPage.jsx
│       │   │   └── 📄 LandingPage.css
│       │   ├── 📁 LoginPage/
│       │   │   ├── 📄 LoginPage.jsx
│       │   │   └── 📄 LoginPage.css
│       │   ├── 📁 SignupPage/
│       │   │   ├── 📄 SignupPage.jsx
│       │   │   └── 📄 SignupPage.css
│       │   ├── 📁 DashboardPage/
│       │   │   ├── 📄 DashboardPage.jsx
│       │   │   └── 📄 DashboardPage.css
│       │   ├── 📁 ExpensesPage/
│       │   │   ├── 📄 ExpensesPage.jsx
│       │   │   └── 📄 ExpensesPage.css
│       │   ├── 📁 BudgetPage/
│       │   │   ├── 📄 BudgetPage.jsx
│       │   │   └── 📄 BudgetPage.css
│       │   └── 📁 NotFoundPage/
│       │       ├── 📄 NotFoundPage.jsx
│       │       └── 📄 NotFoundPage.css
│       │
│       ├── 📁 components/
│       │   ├── 📁 Navbar/
│       │   │   ├── 📄 Navbar.jsx
│       │   │   └── 📄 Navbar.css
│       │   ├── 📁 Sidebar/
│       │   │   ├── 📄 Sidebar.jsx
│       │   │   └── 📄 Sidebar.css
│       │   ├── 📁 ExpenseCard/
│       │   │   ├── 📄 ExpenseCard.jsx
│       │   │   └── 📄 ExpenseCard.css
│       │   ├── 📁 ExpenseForm/
│       │   │   ├── 📄 ExpenseForm.jsx
│       │   │   └── 📄 ExpenseForm.css
│       │   ├── 📁 ExpenseList/
│       │   │   ├── 📄 ExpenseList.jsx
│       │   │   └── 📄 ExpenseList.css
│       │   ├── 📁 SummaryWidget/
│       │   │   ├── 📄 SummaryWidget.jsx
│       │   │   └── 📄 SummaryWidget.css
│       │   ├── 📁 CategoryBadge/
│       │   │   ├── 📄 CategoryBadge.jsx
│       │   │   └── 📄 CategoryBadge.css
│       │   ├── 📁 SpendingChart/
│       │   │   ├── 📄 SpendingChart.jsx
│       │   │   └── 📄 SpendingChart.css
│       │   ├── 📁 BudgetProgressBar/
│       │   │   ├── 📄 BudgetProgressBar.jsx
│       │   │   └── 📄 BudgetProgressBar.css
│       │   ├── 📁 ProtectedRoute/
│       │   │   ├── 📄 ProtectedRoute.jsx
│       │   │   └── 📄 ProtectedRoute.css
│       │   └── 📁 LoadingSpinner/
│       │       ├── 📄 LoadingSpinner.jsx
│       │       └── 📄 LoadingSpinner.css
│       │
│       ├── 📁 services/
│       │   └── 📄 apiService.js        ← All fetch() calls to Express backend
│       │
│       └── 📁 styles/
│           └── 📄 global.css           ← CSS reset + global variables
│
└── 📦 server/                          ← Node.js + Express (deploy on Render)
    ├── 📄 package.json
    ├── 📄 .env
    ├── 📄 .env.example
    ├── 📄 render.yaml                  ← Render deployment config
    │
    └── 📁 src/
        ├── 📄 index.js                 ← Entry point, starts Express server
        │
        ├── 📁 config/
        │   └── 📄 supabaseAdmin.js     ← Supabase admin client (service key)
        │
        ├── 📁 middleware/
        │   ├── 📄 authMiddleware.js    ← Verify Supabase JWT on each request
        │   └── 📄 errorMiddleware.js   ← Global error handler
        │
        ├── 📁 controllers/
        │   ├── 📄 expenseController.js ← Expense business logic
        │   └── 📄 budgetController.js  ← Budget business logic
        │
        ├── 📁 routes/
        │   ├── 📄 expenseRoutes.js     ← /api/expenses endpoints
        │   └── 📄 budgetRoutes.js      ← /api/budgets endpoints
        │
        └── 📁 utils/
            └── 📄 responseHelper.js    ← Standardized API responses
```

---

## 🗺️ What Each Part Does

- 🔐 **`client/src/config/supabaseClient.js`** — Initializes Supabase with your public anon key. Used only for Auth (login/signup/logout) directly from the frontend.
- 📡 **`client/src/services/apiService.js`** — All calls to your Express backend go through here (add expense, get expenses, etc.). It attaches the Supabase JWT token to every request.
- 💾 **`client/src/hooks/useLocalStorage.js`** — Saves expenses locally so the app works even without internet. When online, data syncs to Supabase via the backend.
- 🛡️ **`server/src/middleware/authMiddleware.js`** — Every request to Express goes through this. It reads the JWT token, verifies it with Supabase, and only then allows access.
- 🔑 **`server/src/config/supabaseAdmin.js`** — Uses the secret **service role key** (never exposed to frontend) to read/write the Supabase database.

---

## 🔑 Environment Variables

**`client/.env`**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=https://your-app.onrender.com
```

**`server/.env`**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   ← secret, never in frontend
PORT=5000
CLIENT_URL=https://your-app.vercel.app
```

---

## 📦 Key Packages

**Frontend (`client/`)**
- 🛣️ `react-router-dom` ← page routing
- 🔐 `@supabase/supabase-js` ← auth
- 🌐 `axios` ← API calls to backend
- 📊 `recharts` ← spending charts

**Backend (`server/`)**
- 🚂 `express` ← web server
- 🗄️ `@supabase/supabase-js` ← database access
- 🌍 `cors` ← allow frontend requests
- ⚙️ `dotenv` ← environment variables

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/TacticalReader/Expense-tracker/issues).

### Steps to Contribute:
1. 🍴 **Fork** the repository.
2. 🌿 **Create** your feature branch: `git checkout -b feature/MyAmazingFeature`
3. 💻 **Commit** your changes: `git commit -m 'Add some AmazingFeature'`
4. 🚀 **Push** to the branch: `git push origin feature/MyAmazingFeature`
5. 🔄 **Open** a Pull Request.

Give a ⭐️ if this project helped you!
