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
            const response = await getProducts() as any;
            // FIX: Check if the API returns a paginated object or a direct array
            if (Array.isArray(response.data)) {
                // Scenario A: API returns just [ ... ]
                setProducts(response.data);
            } else if (response.data.data && Array.isArray(response.data.data)) {
                // Scenario B: API returns { pageIndex: 1, data: [ ... ] }
                // This is likely what matches your Swagger output
                setProducts(response.data.data);
            } else {
                console.error("Unexpected API response format:", response.data);
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
            // Remove from local state immediately so we don't need to reload
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting product", error);
            alert("Failed to delete product");
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Inventory</h2>
                <Link to="/add" className="btn btn-success">
                    + Add New Product
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map(product => (
                                <tr key={product.id} className="align-middle">
                                    <td>
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td>{product.title}</td>
                                    <td><span className="badge bg-secondary">{product.category}</span></td>
                                    <td>${product.price}</td>
                                    <td>{product.stock}</td>
                                    <td className="text-end">
                                        <Link to={`/edit/${product.id}`} className="btn btn-sm btn-outline-primary me-2">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="btn btn-sm btn-outline-danger">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;