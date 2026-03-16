import type { ProductRating } from '@src/component/products/ProductRating'

export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: ProductRating
}
