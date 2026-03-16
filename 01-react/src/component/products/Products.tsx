import { useState } from "react";
import "./Product.css";
import type { Product } from "@src/component/products/Product";

function Products() {
    // API url for fetching products
    const fakeStoreApiUrl = "https://fakestoreapi.com/products";

    // product collection
    let [products, setProducts] = useState<Product[]>([]);

    let [details, setDetails] = useState<Product | null>(null);

    // this will be checking if we should show or hide the details
    let [showDetails, setShowDetails] = useState(false);

    /**
     * This function will be loading the details of each product when the
     * user clicks on the product name.
     */
    const loadDetails = (product: Product) => {
        try {
            // Checking if already set the details for the product, if so, we will not update the state
            if (details && details.id === product.id) {
                return;
            }

            // Checking if the product is valid, if not, we will not update the state
            if (!product || !product.id) {
                throw new Error("Invalid product data");
            }

            // we can set the product if is valid
            setDetails(product);

            // triggering that we can show the details of the product
            setShowDetails(true);

            return true;
        } catch (error) {
            console.error("Error loading details:", error);
            setShowDetails(false);
            return false;
        }
    };

    /**
     * This will be responsible for fetching the data from the
     * API and returning the data as JSON.
     * @param url url for the request to be made
     * @returns false if there is an error, otherwise the data as JSON
     */
    const fetchData = async (url: string) => {
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
    };

    /**
     * This will be responsible for loading the products from the API and
     * setting the products state with the data received.
     */
    const loadProducts = async () => {
        setProducts(await fetchData(fakeStoreApiUrl));
    };

    /**
     * This will be responsible for cleaning the products state,
     * setting it to an empty array.
     */
    function cleanProducts() {
        setProducts([]);
    }

    return (
        <>
            <section id="container-centered">
                <ul id="buttons-list">
                    <li>
                        <a onClick={loadProducts} className="button">
                            Get Products
                        </a>
                        <a onClick={cleanProducts} className="button">
                            Clean
                        </a>
                    </li>
                </ul>
            </section>
            <section id="products-tasks">
                <div className="task">
                    {showDetails && (
                        <>
                            <h2>Details from the product</h2>
                            <div className="details">
                                <h3>{details?.title}</h3>
                                <img src={details?.image} alt={details?.title} />
                                <p>{details?.description}</p>
                                <p className="price">Price: {details?.price}</p>
                                <p>Category: {details?.category}</p>
                                <p>
                                    Rating: {details?.rating.rate} ({details?.rating.count} reviews)
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <div className="task results">
                    {products.length > 0 && (
                        <ul>
                            {products.map((product: any) => (
                                <li onClick={() => loadDetails(product)} key={product.id}>
                                    {product.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </>
    );
}

export default Products;
