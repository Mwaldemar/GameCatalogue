// src/components/MainLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
                <nav>
                    <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                    <Link to="/games" style={{ marginRight: '1rem' }}>All Games</Link>
                </nav>
                <div>
                    {user ? (
                        <>
                            {/* ---- NY OG FORBEDRET LOGIK ---- */}
                            <span style={{ marginRight: '1rem' }}>Welcome, {user.username}!</span>
                            {user.role === 'Admin' && (
                                <Link to="/admin" style={{ marginRight: '1rem' }}>
                                    <button>Admin Panel</button>
                                </Link>
                            )}
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                    )}
                </div>
            </header>
            <main style={{ padding: '1rem' }}>
                <Outlet />
            </main>
            <footer>This is the common footer.</footer>
        </div>
    );
};

export default MainLayout;