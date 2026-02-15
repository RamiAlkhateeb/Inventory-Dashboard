import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { getProduct, createProduct, updateProduct } from '../services/api';

const ProductForm = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Product>();
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode && id) {
            getProduct(id).then(response => {
                const fields: (keyof Product)[] = ['title', 'price', 'description', 'thumbnail', 'stock', 'category'];
                fields.forEach(field => setValue(field, response.data[field]));
            }).catch(err => console.error(err));
        }
    }, [isEditMode, id, setValue]);

    const onSubmit = async (data: Product) => {
        try {
            if (isEditMode && id) {
                await updateProduct(id, data);
            } else {
                await createProduct(data);
            }
            navigate('/');
        } catch (error) {
            console.error("Error saving product", error);
            alert("Error saving product");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow mx-auto" style={{ maxWidth: '800px' }}>
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">{isEditMode ? 'Edit Product' : 'Add New Product'}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Product Title</label>
                                <input 
                                    {...register("title", { required: "Title is required" })} 
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Category</label>
                                <select {...register("category", { required: true })} className="form-select">
                                    <option value="">Select Category...</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Collectibles">Collectibles</option>
                                    <option value="Decor">Decor</option>
                                    <option value="Gaming">Gaming</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Price</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    {...register("price", { required: true, min: 0 })} 
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Stock</label>
                                <input 
                                    type="number" 
                                    {...register("stock", { required: true, min: 0 })} 
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Image URL</label>
                                <input 
                                    {...register("thumbnail", { required: "Image URL is required" })} 
                                    className="form-control" 
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Description</label>
                            <textarea 
                                {...register("description")} 
                                className="form-control" 
                                rows={3}
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                            <button type="submit" className="btn btn-primary">
                                {isEditMode ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;