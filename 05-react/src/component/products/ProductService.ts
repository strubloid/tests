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
            let responseFetch = await fetch(url, {
                method: "GET",
                headers: {
                    Accepted: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // checking the response of the API
            if (!responseFetch.ok) {
                throw new Error(`Error fetching data, try again!`);
            }

            // loading data
            let data = await responseFetch.json();

            // checking if the response has some data in it
            if (!data || (Array.isArray(data) && data.length <= 0)) {
                throw new Error("No data recieved from the API");
            }

            return data;
        } catch (error) {
            // console.error("Error fetchin the data: ", error);
            throw error;
        }
    };

    /**
     * This will be loading all product details
     * @param product
     */
    public static loadDetails = (product: APIProduct): APIProduct => {
        try {
            // we check if the product is empty
            if (!product) {
                throw new Error("Missing product to load details");
            }

            // getting the required field to check
            const requiredFields = ["title", "image", "description", "price", "category", "rating"];

            // looping though the required fields to check values
            for (const field of requiredFields) {
                if (!product[field as keyof APIProduct]) {
                    throw new Error(`Missing required field ${field} to load details`);
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
