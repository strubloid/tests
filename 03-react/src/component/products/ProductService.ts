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
    public fetchData = async (url: string): Promise<APIProduct[]> => {
        try {
            // getting the api fetch working
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // checking if is a valid one
            if (!response || !response.ok) {
                throw new Error("Issues with the API, not able to get the data");
            }

            // we try to load the response
            const data = response.json();

            // we check if the respose is a good one
            if (!data || (Array.isArray(data) && data.length <= 0)) {
                throw new Error("Couldn't recieve data from the API");
            }

            return data;
        } catch (error) {
            console.error("Error fetchin the data: ", error);
            throw error;
        }
    };

    /**
     * This will be loading all product details, as this is a service
     * we are sure to validate the main important ones, before show something
     * that is missing data.
     * @param product
     */
    public loadDetails = (product: APIProduct): APIProduct | false => {
        try {
            // here we will be checking all the data in the product, only the main required one
            // checking if we have the title
            if (!product?.title) {
                throw new Error("Missing the product title at the API");
            }

            // checking if we have an image
            if (!product?.image) {
                throw new Error("Missing the product Image at the API");
            }

            // checking if we have the description of the product
            if (!product?.description) {
                throw new Error("Missing the product Description at the API");
            }

            // checking if we have the price of the product
            if (!product?.price) {
                throw new Error("Missing the product Price at the API");
            }

            // checking if we have the category of the product
            if (!product?.category) {
                throw new Error("Missing the product Category at the API");
            }

            // checking if we have the raiting of the product
            if (!product?.rating) {
                throw new Error("Missing the product Raiting at the API");
            }

            return product;
        } catch (error) {
            return false;
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
