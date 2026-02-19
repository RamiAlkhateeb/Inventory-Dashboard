import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { getProduct, createProduct, updateProduct } from '../services/api';

const ProductForm = () => {
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<Product>();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Watch the thumbnail field to create a live preview
    const thumbnailUrl = watch("thumbnail");

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
            alert("Error saving product. Check console for details.");
        }
    };

    return (
        <div className="container-fluid py-5 max-w-1200 mx-auto">
            
            {/* Top Navigation */}
            <div className="mb-4">
                <Link to="/" className="text-decoration-none text-muted fw-semibold">
                    <i className="fa fa-arrow-left me-2"></i>Back to Inventory
                </Link>
            </div>

            <div className="row g-5">
                
                {/* Form Column */}
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
                        <h3 className="fw-bold mb-4">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            
                            {/* Title */}
                            <div className="mb-4">
                                <label className="form-label fw-bold text-muted small">PRODUCT TITLE</label>
                                <input 
                                    {...register("title", { required: "Title is required" })} 
                                    className={`form-control form-control-lg bg-light border-0 rounded-3 fs-6 ${errors.title ? 'is-invalid' : ''}`}
                                    placeholder="e.g., Articulated 3D Dragon"
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                            </div>

                            <div className="row g-4 mb-4">
                                {/* Category */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-muted small">CATEGORY</label>
                                    <select 
                                        {...register("category", { required: "Category is required" })} 
                                        className="form-select form-select-lg bg-light border-0 rounded-3 fs-6"
                                    >
                                        <option value="">Select Category...</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Collectibles">Collectibles</option>
                                        <option value="Decor">Decor</option>
                                        <option value="Gaming">Gaming</option>
                                    </select>
                                </div>
                                
                                {/* Stock */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-muted small">STOCK QUANTITY</label>
                                    <input 
                                        type="number" 
                                        {...register("stock", { required: true, min: 0 })} 
                                        className="form-control form-control-lg bg-light border-0 rounded-3 fs-6"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="row g-4 mb-4">
                                {/* Price */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-muted small">PRICE ($)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 rounded-start-3">$</span>
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            {...register("price", { required: true, min: 0 })} 
                                            className="form-control form-control-lg bg-light border-0 rounded-end-3 fs-6"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-muted small">IMAGE URL</label>
                                    <input 
                                        {...register("thumbnail", { required: "Image URL is required" })} 
                                        className="form-control form-control-lg bg-light border-0 rounded-3 fs-6" 
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-5">
                                <label className="form-label fw-bold text-muted small">DESCRIPTION</label>
                                <textarea 
                                    {...register("description")} 
                                    className="form-control bg-light border-0 rounded-3" 
                                    rows={4}
                                    placeholder="Describe the 3D print material, size, and details..."
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <Link to="/" className="btn btn-light btn-lg rounded-pill fw-bold px-4 border flex-grow-1 flex-md-grow-0">
                                    Cancel
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="btn btn-dark btn-lg rounded-pill fw-bold px-5 flex-grow-1 shadow-sm d-flex justify-content-center align-items-center"
                                >
                                    {isSubmitting && <i className="fa fa-spinner fa-spin me-2"></i>}
                                    {isEditMode ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

                {/* Right Column: Live Image Preview */}
                <div className="col-12 col-lg-4 d-none d-lg-block">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        <h6 className="fw-bold text-muted mb-3">IMAGE PREVIEW</h6>
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-light d-flex justify-content-center align-items-center" style={{ aspectRatio: '1', minHeight: '300px' }}>
                            {thumbnailUrl ? (
                                <img 
                                    src={thumbnailUrl} 
                                    alt="Preview" 
                                    className="w-100 h-100 object-fit-cover"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Invalid+Image+URL')}
                                />
                            ) : (
                                <div className="text-center text-muted opacity-50">
                                    <i className="fa fa-image fa-3x mb-2"></i>
                                    <p className="mb-0 fw-semibold">No image provided</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductForm;