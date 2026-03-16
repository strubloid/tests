import { useState } from "react";
import "./Product.css";
import type { Product } from "@src/component/products/Product";

function Products() {
    // getting our fake API urls
    const fakeUsersApiUrl = "https://jsonplaceholder.typicode.com/posts";
    const fakeStoreApiUrl = "https://fakestoreapi.com/products";

    // product collection
    let [products, setProducts] = useState<Product[]>([]);

    /**
     * This will be responsible for fetching the data from the
     * API and returning the data as JSON.
     * @param url url for the request to be made
     * @returns false if there is an error, otherwise the data as JSON
     */
    async function fetchData(url: string) {
        try {
            // loading the data from the API
            const response = await fetch(url);

            // checking if the response is ok, if not, throwing an error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // parsing the response as JSON
            const data = await response.json();

            // validation of the data
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error("No data received from the API.");
            }

            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return false;
        }
    }

    /**
     * This will be responsible for loading the products from the API and
     * setting the products state with the data received.
     */
    async function loadProducts() {
        setProducts(await fetchData(fakeStoreApiUrl));
    }

    /**
     * This will be responsible for cleaning the products state,
     * setting it to an empty array.
     */
    function cleanProducts() {
        setProducts([]);
    }

    return (
        <>
            <section id="products-tasks">
                <div className="task">
                    <h2>Task one</h2>
                    <p>
                        <a onClick={loadProducts} className="button" target="_blank" rel="noopener noreferrer">
                            Load products
                        </a>

                        <a onClick={cleanProducts} className="button" target="_blank" rel="noopener noreferrer">
                            Clean
                        </a>
                    </p>
                    <h2>Task two</h2>
                    <p>
                        <a onClick={() => fetchData(fakeUsersApiUrl)} target="_blank" rel="noopener noreferrer">
                            Click here 2
                        </a>
                    </p>
                </div>
                <div className="task results">
                    {products.length > 0 && (
                        <ul>
                            {products.map((product: any) => (
                                <li key={product.id}>{product.title}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </>
    );
}

export default Products;
