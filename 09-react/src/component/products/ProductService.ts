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
            let response = await fetch(url, {
                method: "GET",
                headers: {
                    Accepted: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // check if the response isnt ok
            if (!response.ok) {
                throw new Error(`Error fetching data, try again!`);
            }

            // load the json data
            const data: APIProduct[] = await response.json();

            // checkinf if the data is valid and not empty
            if (!data || (Array.isArray(data) && data.length <= 0)) {
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
            const requiredFields = {
                title: "string",
                price: "number",
                description: "string",
                category: "string",
            } as const;

            // validating each required field to be present in the product
            for (const [field, expectedFieldType] of Object.entries(requiredFields)) {
                // we load the current value to check
                const value = product[field as keyof APIProduct];

                // first check if the value is undefined or null
                if (value === undefined || value === null) {
                    throw new Error(`Missing required field: ${field}`);
                }

                // we check if the type of the value is correct
                if (typeof value !== expectedFieldType) {
                    throw new Error(`Invalid type for field: ${field}`);
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
