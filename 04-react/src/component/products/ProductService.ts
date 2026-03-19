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
            // checkinf if the url is empty
            if (!url || url.trim().length <= 0) {
                throw new Error("Missing url to fetch data");
            }

            // getting the data from the API
            const responseFetch = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // checking the response of the API
            if (!responseFetch.ok) {
                throw new Error(`Error fetching data, try again!`);
            }

            // loading the data value
            let data = await responseFetch.json();

            if (!data || (Array.isArray(data) && data.length <= 0)) {
                throw new Error("No data recieved from the API");
            }

            return data;
        } catch (error) {
            console.error("Error fetchin the data: ", error);
            throw error;
        }
    };

    /**
     * This will be loading all product details
     * @param product
     */
    public static loadDetails = (product: APIProduct): APIProduct => {
        try {
            // first we check if we have a product to load
            if (!product) {
                throw new Error("Missing product to load details");
            }

            // we load the required field to loop though
            const requiredFields = ["title", "image", "description", "price", "category", "rating"];

            // we check for all required fields
            for (const field of requiredFields) {
                if (!product[field as keyof APIProduct]) {
                    throw new Error(`Missing the product ${field} at the API`);
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
