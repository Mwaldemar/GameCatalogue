import { Link } from "react-router-dom";

const DashboardPage = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin control panel. Please select a section to manage.</p>

            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '1rem' }}>
                        <Link to="/admin/games">
                            <button style={{ width: '200px', padding: '10px' }}>
                                Manage Games
                            </button>
                        </Link>
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        <Link to="/admin/tags">
                            <button style={{ width: '200px', padding: '10px' }} disabled>
                                Manage Tags (Coming Soon)
                            </button>
                        </Link>
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        <Link to="/admin/users">
                            <button style={{ width: '200px', padding: '10px' }} disabled>
                                Manage Users (Coming Soon)
                            </button>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default DashboardPage;