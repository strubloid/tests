import { useState } from "react";
import { useForm } from "react-hook-form";
import "./Product.css";
import { ProductService } from "./ProductService";
import type { APIProduct } from "./ProductService";

type SearchFormValues = {
    title: string;
};

function Products() {
    // API url for fetching products
    const apiURL = "https://api.escuelajs.co/api/v1/products";

    // product collection
    let [products, setProducts] = useState<APIProduct[]>([]);

    // details of a clicked product
    let [details, setDetails] = useState<APIProduct | null>(null);

    // this will be checking if we should show or hide the details
    let [showDetails, setShowDetails] = useState(false);

    // React Hook Form setup for the product search form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>();

    /**
     * This function will be loading the details of each product when the
     * user clicks on the product name.
     */
    const loadDetails = (product: APIProduct) => {
        try {
            // loading the data from the api url
            var details: APIProduct | false = ProductService.loadDetails(product);

            // check if the details exists
            if (!details) {
                throw new Error("Missing to load details, try again!");
            }

            // we can set the product if is valid
            setDetails(details);

            // showing the product details
            setShowDetails(true);

            return details;
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
            const data = await ProductService.fetchData(url);
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return false;
        }
    };

    /**
     * This will be responsible for closing the details of the product, hiding
     * the details and cleaning the products and details states.
     */
    const closeDetails = () => {
        setShowDetails(false);
        setDetails(null);
    };

    /**
     * This will be responsible for loading the products from the API and
     * setting the products state with the data received.
     */
    const loadProducts = async () => {
        try {
            // loading the products
            const products = await fetchData(apiURL);

            // basic validation
            if (!products) {
                throw new Error("Not able to load the data");
            }

            // setting the products
            setProducts(products);
        } catch (error) {
            console.error("Issues loading the products, ", error);
        }
    };

    /**
     * This will be responsible for cleaning the products state,
     * setting it to an empty array.
     */
    function cleanProducts() {
        setProducts([]);
    }

    /**
     * Handles the search form submission using React Hook Form.
     * Fetches products filtered by title from the API.
     */
    const onSearch = async (data: SearchFormValues) => {
        try {
            const searchURL = `${apiURL}/?title=${encodeURIComponent(data.title)}`;
            const result = await fetchData(searchURL);

            if (!result) {
                throw new Error("Not able to load the data");
            }

            setProducts(result);
        } catch (error) {
            console.error("Issues searching products, ", error);
        }
    };

    return (
        <>
            <section id="container-centered">
                <ul id="buttons-list">
                    <li>
                        <a onClick={loadProducts} className="button getProducts">
                            Get Products
                        </a>
                        <a onClick={cleanProducts} className="button cleanProducts">
                            Clean
                        </a>
                    </li>
                </ul>
                <form className="search-form" onSubmit={handleSubmit(onSearch)} noValidate>
                    <div className="search-field">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            className={`search-input${errors.title ? " input-error" : ""}`}
                            {...register("title", {
                                required: "Title is required",
                                minLength: {
                                    value: 3,
                                    message: "Title must be at least 3 characters",
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Title must be at most 100 characters",
                                },
                            })}
                        />
                        <button type="submit" className="button">
                            Search
                        </button>
                    </div>
                    {errors.title && (
                        <p className="field-error" role="alert">
                            {errors.title.message}
                        </p>
                    )}
                </form>
            </section>
            <section id="products-tasks">
                <div className="task">
                    {showDetails && (
                        <>
                            <div className="details">
                                <p className="close" onClick={closeDetails}>
                                    x
                                </p>
                                <h3>{details?.title}</h3>
                                <img src={details?.images[0]} alt={details?.title} />
                                <p>{details?.description}</p>
                                <p className="price">Price: {details?.price}</p>
                                <p>Category: {details?.category.name}</p>
                            </div>
                        </>
                    )}
                </div>
                <div className="task results">
                    {products.length > 0 && (
                        <ul>
                            {products.map((product: any) => (
                                <li data-testid="product-item" onClick={() => loadDetails(product)} key={product.id}>
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
