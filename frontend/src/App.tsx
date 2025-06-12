// App.tsx
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

// Layout & Guard
import MainLayout from './components/MainLayout';
import AdminRoute from './components/AdminRoute';

// Sider
import GameListPage from './pages/GameListPage/GameListPage';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/AdminDashboardPage/AdminDashboardPage';
import AdminGamesPage from './pages/AdminGamesPage/AdminGamesPage';
import CreateGamePage from './pages/AdminCreateGamePage/AdminCreateGamePage';
import EditGamePage from './pages/AdminEditGamePage/AdminEditGamePage';

const adminRoutes = [
  {
    index: true,
    element: <DashboardPage />,
  },
  {
    path: "games",
    element: <AdminGamesPage />,
  },
  {
    path: "games/create",
    element: <CreateGamePage />,
  },
  {
    path: "games/edit/:gameId",
    element: <EditGamePage />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <GameListPage />,
      },
      {
        path: "games",
        element: <GameListPage />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Outlet />
          </AdminRoute>
        ),
        children: adminRoutes,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;