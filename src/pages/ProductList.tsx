import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { getProducts, deleteProduct } from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await getProducts();
            // Handle both standard arrays and paginated object structures safely
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                setProducts(response.data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error loading products", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting product", error);
            alert("Failed to delete product");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 max-w-1200 mx-auto">

            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Inventory Dashboard</h2>
                    <p className="text-muted mb-0">Manage your 3D print listings</p>
                </div>
                <Link to="/add" className="btn btn-dark rounded-pill px-4 py-2 shadow-sm fw-bold">
                    + Add New Product
                </Link>
            </div>

            {/* Empty State */}
            {products?.length === 0 && (
                <div className="text-center py-5 bg-light rounded-4">
                    <h4 className="text-muted">No products found.</h4>
                    <p>Click the button above to add your first item.</p>
                </div>
            )}

            {/* Responsive Card Grid */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {products?.map(product => (
                    <div className="col" key={product.id}>
                        <div className="card h-100 border-0 shadow-sm admin-product-card rounded-4 overflow-hidden">

                            {/* Image Container with 1:1 Aspect Ratio */}
                            <div className="position-relative bg-light w-100" style={{ height: '250px', overflow: 'hidden' }}>
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="w-100 h-100"
                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                />
                                {/* Category Badge */}
                                <span className="position-absolute top-0 end-0 m-3 badge bg-white text-dark shadow-sm">
                                    {product.category}
                                </span>
                            </div>

                            <div className="card-body d-flex flex-column p-4">
                                {/* Title & Stock */}
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title fw-bold mb-0 text-truncate pe-2" title={product.title}>
                                        {product.title}
                                    </h5>
                                </div>

                                {/* Price & Dynamic Stock Indicator */}
                                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                                    <span className="fs-5 fw-bold text-dark">${product.price}</span>

                                    <span className={`badge rounded-pill px-3 py-2 ${product.stock > 5 ? 'bg-success-subtle text-success' :
                                            product.stock > 0 ? 'bg-warning-subtle text-warning' :
                                                'bg-danger-subtle text-danger'
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>

                                {/* Action Buttons - Pushed to bottom via mt-auto */}
                                <div className="mt-auto d-flex gap-2">
                                    <Link to={`/edit/${product.id}`} className="btn btn-light flex-grow-1 rounded-pill fw-semibold border">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="btn btn-outline-danger flex-grow-1 rounded-pill fw-semibold">
                                        Delete
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;