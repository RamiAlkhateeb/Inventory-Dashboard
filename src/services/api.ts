import axios from 'axios';
import type { Product } from '../types/product';
import type { PaginationResponse } from '../types/pagination';

// CHANGE THIS to your actual .NET API URL
const API_URL = 'https://localhost:7085/api';

// 1. Create a base axios instance
export const api = axios.create({
    baseURL: API_URL // Change to your actual API URL
});

// 2. Add the Interceptor
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Update the return type to match reality
export const getProducts = async () => {
    // Note: use 'any' temporarily or PaginationResponse<Product> to avoid conflicts
    return await api.get<PaginationResponse<Product>>('/products'); 
};

export const getProduct = async (id: string) => {
    return await api.get<Product>(`/products/${id}`);
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
    return await api.post<Product>(`/products`, product);
};

export const updateProduct = async (id: string, product: Product) => {
    return await api.put(`/products/${id}`, product);
};

export const deleteProduct = async (id: number) => {
    return await api.delete(`/products/${id}`);
};