import { useEffect, useState } from 'react';
import type { Order } from '../types/order';
import { deleteOrder, getOrders } from '../services/api';
import { Link } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Error loading orders", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to color-code the order status
    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('pending')) return 'bg-warning-subtle text-warning';
        if (s.includes('received') || s.includes('success')) return 'bg-info-subtle text-info';
        if (s.includes('shipped') || s.includes('completed')) return 'bg-success-subtle text-success';
        return 'bg-secondary-subtle text-secondary';
    };

    // Helper to format the date cleanly
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;

        try {
            await deleteOrder(id);
            // Update the UI by filtering out the deleted order
            setOrders(prevOrders => prevOrders.filter(o => o.id !== id));
        } catch (error) {
            console.error("Error deleting order", error);
            alert("Failed to delete order.");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 max-w-1200 mx-auto">

            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Orders</h2>
                    <p className="text-muted mb-0">Manage customer purchases and shipping</p>
                </div>
                <Link to="/" className="btn btn-outline-dark rounded-pill px-4 fw-semibold">
                    <i className="fa fa-arrow-left me-2"></i>Back to Inventory
                </Link>
            </div>

            {/* Empty State */}
            {orders.length === 0 && (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
                    <i className="fa fa-inbox fa-3x text-muted opacity-25 mb-3"></i>
                    <h5 className="fw-bold">No orders yet</h5>
                    <p className="text-muted">When customers buy your prints, they will appear here.</p>
                </div>
            )}

            {/* Order Cards List */}
            <div className="d-flex flex-column gap-4">
                {orders.map(order => (
                    <div key={order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">

                        {/* Card Header: ID, Date, Status */}
                        <div className="card-header bg-light border-bottom-0 py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                            <div>
                                <span className="fw-bold fs-5 me-3">Order #{order.id}</span>
                                <span className="text-muted small">{formatDate(order.orderDate)}</span>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <span className={`badge rounded-pill px-3 py-2 ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>

                                {/* NEW DELETE BUTTON */}
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    className="btn btn-outline-danger d-flex justify-content-center align-items-center"
                                    
                                    title="Delete Order"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Card Body: Customer details and Items */}
                        <div className="card-body p-4 row g-4">

                            {/* Left Col: Shipping Info */}
                            <div className="col-12 col-md-5 border-md-end pe-md-4">
                                <h6 className="fw-bold text-muted small mb-3">CUSTOMER DETAILS</h6>
                                <p className="mb-1 fw-semibold"><i className="fa fa-envelope text-muted me-2"></i>{order.buyerEmail}</p>
                                <div className="d-flex mt-3">
                                    <i className="fa fa-map-marker text-muted me-2 mt-1"></i>
                                    <p className="mb-0 small text-muted">
                                        {order.shipToAddress.firstName} {order.shipToAddress.lastName}<br />
                                        {order.shipToAddress.street}<br />
                                        {order.shipToAddress.city}, {order.shipToAddress.zipCode}<br />
                                        {order.shipToAddress.country}
                                    </p>
                                </div>
                            </div>

                            {/* Right Col: Items & Total */}
                            <div className="col-12 col-md-7 ps-md-4">
                                <h6 className="fw-bold text-muted small mb-3">ORDER SUMMARY ({order.orderItems.length} items)</h6>

                                <div className="d-flex flex-column gap-2 mb-4">
                                    {order.orderItems.map(item => (
                                        <div key={item.productId} className="d-flex justify-content-between align-items-center bg-light rounded-3 p-2 px-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={item.pictureUrl.startsWith('http') ? item.pictureUrl : `${item.pictureUrl}`}
                                                    alt={item.productName}
                                                    className="rounded-2 object-fit-cover"
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                                <span className="fw-semibold small text-truncate" style={{ maxWidth: '180px' }}>{item.productName}</span>
                                            </div>
                                            <span className="text-muted small">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                    <span className="text-muted fw-semibold">Delivery: {order.deliveryMethod}</span>
                                    <span className="fs-4 fw-bold">${order.total.toFixed(2)}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default OrderList;