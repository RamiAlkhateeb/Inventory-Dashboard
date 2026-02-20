import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import OrderList from './pages/OrderList';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* The Navbar is rendered here so it sits on top of every page */}
        <Navbar />

        {/* Add a top margin so the fixed Navbar doesn't cover the page content */}
        <div style={{ marginTop: '80px' }}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes (Admin Only) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ProductList />} />
              <Route path="/add" element={<ProductForm />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/edit/:id" element={<ProductForm />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider >
  );
}

export default App;