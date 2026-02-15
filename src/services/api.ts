import axios from 'axios';
import type { Product } from '../types/product';

// CHANGE THIS to your actual .NET API URL
const API_URL = 'https://localhost:7085/api/products';

// Update the return type to match reality
export const getProducts = async () => {
    // Note: use 'any' temporarily or PaginationResponse<Product> to avoid conflicts
    return await axios.get(API_URL); 
};

export const getProduct = async (id: string) => {
    return await axios.get<Product>(`${API_URL}/${id}`);
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
    return await axios.post<Product>(API_URL, product);
};

export const updateProduct = async (id: string, product: Product) => {
    return await axios.put(`${API_URL}/${id}`, product);
};

export const deleteProduct = async (id: number) => {
    return await axios.delete(`${API_URL}/${id}`);
};