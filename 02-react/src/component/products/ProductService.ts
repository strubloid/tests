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
    public fetchData = async (url: string) => {
        try {
            // checking if the url does not exists
            if (!url || url.trim().length <= 0) {
                throw new Error("Missing url to fetch data");
            }

            // calling the API for this url
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // validation 01, checking if the data is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // getting the json response
            const data = await response.json();

            // valindating the json response
            if (!data || (Array.isArray(data) && data.length <= 0)) {
                throw new Error("No data recieved from the API");
            }

            return data;
        } catch (error) {
            console.error("Error fetchin the data: ", error);
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
