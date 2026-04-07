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

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            // we check if the response is ok, otherwise we throw an error
            if (!response.ok && response.status != 200) {
                throw new Error("Error fetching data, try again!");
            }

            // getting the json data from the response
            data = await response.json();

            // validating the data
            if (Array.isArray(data) && data.length <= 0 && !data) {
                throw new Error("No data found");
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

            const objectEntries = Object.entries(requiredFields);

            // we will be adding the missing fields here
            let missingFields: string[] = [];

            // we will be adding the wrong type fields here
            let wrongTypeFields: string[] = [];

            // validating the product details
            for (const [field, type] of objectEntries) {
                // getting the value of the current field to check
                const value = product[field as keyof APIProduct];

                // first we check if the value is undefined or null
                if (value === undefined || value === null) {
                    missingFields.push(field);
                }

                // we check of the type of the value is correct
                if (typeof value !== type) {
                    wrongTypeFields.push(field);
                }
            }

            // checking if we have missing fields
            if (missingFields.length > 0) {
                throw new Error(`Missing required field: ${missingFields.join(", ")}`);
            }

            // checking if we have wrong type fields
            if (wrongTypeFields.length > 0) {
                throw new Error(`Invalid type for field: ${wrongTypeFields.join(", ")}`);
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
