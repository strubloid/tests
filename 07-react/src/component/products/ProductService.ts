/**
 * This class will be responsible for having all the rules
 * related to the API calls, passing here as main point of
 * request of data.
 */
export class ProductService {
    /**
     * This will return the data from the API server.
     * @param url ulr of the place to get data from
     * @returns data from the place or empty
     */
    public static fetchData = async (url: string) => {
        try {
            let data: APIProduct[] = [];

            // loading the data from the API
            let response = await fetch(url, {
                method: "GET",
                headers: {
                    Accepted: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // checking the response status
            if (!response.ok) {
                throw new Error(`Error fetching data, try again!`);
            }

            // loading the data as json
            data = await response.json();

            // checking if the data is valid and not empty
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error("Invalid data or empty!");
            }

            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * This will be loading all product details
     * @param product
     */
    public static loadDetails = (product: APIProduct): APIProduct => {
        try {
            // getting the required fields
            const requiredFields = ["title", "price", "description", "category", "rating"];

            // validating all required fields are present in the product
            for (const field of requiredFields) {
                // checking if each required field is present in the current product
                if (!product[field as keyof APIProduct]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }

            return product;
        } catch (error) {
            throw error;
        }
    };
}

// creating the APIProduct call type
export interface APIProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: APIProductRating;
}

// creating the API product Raiting type
export interface APIProductRating {
    rate: number;
    count: number;
}
