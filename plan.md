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