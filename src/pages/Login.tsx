import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setLoginError('');
            await login(data);
            navigate('/'); // Redirect to the dashboard on success
        } catch (error) {
            console.error("Login failed", error);
            setLoginError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                
                {/* Branding / Logo Area */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ letterSpacing: '-1px' }}>oussm.prints</h2>
                    <p className="text-muted">Admin Dashboard Login</p>
                </div>

                {/* Login Card */}
                <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
                    <h4 className="fw-bold mb-4 text-center">Welcome Back</h4>

                    {/* Error Alert */}
                    {loginError && (
                        <div className="alert alert-danger border-0 rounded-3 small fw-semibold text-center mb-4">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        
                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="form-label fw-bold text-muted small">EMAIL ADDRESS</label>
                            <input 
                                type="email"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })} 
                                className={`form-control form-control-lg bg-light border-0 rounded-3 fs-6 ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="admin@oussm.com"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email.message as string}</div>}
                        </div>

                        {/* Password Input */}
                        <div className="mb-5">
                            <label className="form-label fw-bold text-muted small">PASSWORD</label>
                            <input 
                                type="password"
                                {...register("password", { required: "Password is required" })} 
                                className={`form-control form-control-lg bg-light border-0 rounded-3 fs-6 ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password.message as string}</div>}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="btn btn-dark btn-lg w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center"
                        >
                            {isSubmitting ? (
                                <i className="fa fa-spinner fa-spin me-2"></i>
                            ) : (
                                <i className="fa fa-lock me-2"></i>
                            )}
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default Login;