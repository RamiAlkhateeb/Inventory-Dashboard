import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand bg-white border-bottom fixed-top shadow-sm py-2 px-4" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="container-fluid d-flex justify-content-between align-items-center max-w-1200 mx-auto">
                
                {/* 1. Brand Logo (Always Links to Inventory) */}
                <Link to="/" className="navbar-brand fw-bold text-dark" style={{ letterSpacing: '-1px', fontSize: '1.5rem' }}>
                    oussm.prints
                </Link>

                {/* 2. Navigation & User Actions */}
                <div className="d-flex align-items-center gap-4">
                    
                    {user ? (
                        <>
                            {/* Main Admin Links (Hidden on very small mobile screens, adapt as needed) */}
                            <div className="d-none d-md-flex gap-4 me-3">
                                <Link to="/" className="text-dark text-decoration-none fw-bold hover-opacity">
                                    Inventory
                                </Link>
                                <Link to="/orders" className="text-dark text-decoration-none fw-bold hover-opacity">
                                    Orders
                                </Link>
                            </div>

                            {/* User Profile & Sign Out */}
                            <div className="d-flex align-items-center gap-3 border-start ps-3">
                                <span className="text-muted small d-none d-sm-inline fw-semibold">
                                    {user.displayName || 'Admin'}
                                </span>
                                <button 
                                    onClick={handleLogout} 
                                    className="btn btn-outline-danger btn-sm rounded-pill fw-semibold px-3"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Login Button (Visible only if viewing the login page) */
                        <Link to="/login" className="btn btn-dark btn-sm rounded-pill fw-semibold px-4">
                            Sign In
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;