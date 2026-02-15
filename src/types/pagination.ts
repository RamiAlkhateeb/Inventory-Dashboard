import type { Product } from './product';

export interface PaginationResponse<T> {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: T[]; // The actual array is here
}