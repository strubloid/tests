export interface APIProduct {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: APIProductRating
}

export interface APIProductRating {
    rate: number
    count: number
}
