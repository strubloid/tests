import { useState, useEffect } from 'react'
import gsap from 'gsap'
import './Product.css'
import type { Product } from '@src/component/products/Product'

function Products() {
    // API url for fetching products
    const fakeStoreApiUrl = 'https://fakestoreapi.com/products'

    // product collection
    let [products, setProducts] = useState<Product[]>([])

    // details of a clicked product
    let [details, setDetails] = useState<Product | null>(null)

    // this will be checking if we should show or hide the details
    let [showDetails, setShowDetails] = useState(false)

    // configurations related to animations with GSAP
    let showEffectsOnDetailsChange = [showDetails, details]
    let showEffectsOnFirstLoad = [showDetails]
    let showEffectsWhenProductsLoad = [products]

    // Animate details card when it appears or content changes
    useEffect(() => {
        if (showDetails) {
            gsap.fromTo(
                '.details',
                { opacity: 0, y: 30, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' },
            )
            gsap.fromTo(
                '.details > *',
                { opacity: 0, y: 15 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: 0.06,
                    delay: 0.15,
                    ease: 'power2.out',
                },
            )
        }
    }, showEffectsOnFirstLoad)

    // Animate product list when it loads
    useEffect(() => {
        if (products.length > 0) {
            gsap.fromTo(
                '.results > ul > li',
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' },
            )
        }
    }, showEffectsWhenProductsLoad)

    /**
     * This function will be loading the details of each product when the
     * user clicks on the product name.
     */
    const loadDetails = (product: Product) => {
        try {
            // Checking if already set the details for the product, if so, we will not update the state
            if (details && details.id === product.id) {
                return
            }

            // Checking if the product is valid, if not, we will not update the state
            if (!product || !product.id) {
                throw new Error('Invalid product data')
            }

            // we can set the product if is valid
            setDetails(product)

            // triggering that we can show the details of the product
            setShowDetails(true)

            return true
        } catch (error) {
            console.error('Error loading details:', error)
            setShowDetails(false)
            return false
        }
    }

    /**
     * This will be responsible for fetching the data from the
     * API and returning the data as JSON.
     * @param url url for the request to be made
     * @returns false if there is an error, otherwise the data as JSON
     */
    const fetchData = async (url: string) => {
        try {
            // loading the data from the API
            const response = await fetch(url)

            // checking if the response is ok, if not, throwing an error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // parsing the response as JSON
            const data = await response.json()

            // validation of the data
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error('No data received from the API.')
            }

            return data
        } catch (error) {
            console.error('Error fetching data:', error)
            return false
        }
    }

    /**
     * This will be responsible for closing the details of the product, hiding
     * the details and cleaning the products and details states.
     */
    const closeDetails = () => {
        gsap.to('.details', {
            opacity: 0,
            y: -20,
            scale: 0.96,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
                setShowDetails(false)
                setDetails(null)
            },
        })
    }

    /**
     * This will be responsible for loading the products from the API and
     * setting the products state with the data received.
     */
    const loadProducts = async () => {
        setProducts(await fetchData(fakeStoreApiUrl))
    }

    /**
     * This will be responsible for cleaning the products state,
     * setting it to an empty array.
     */
    function cleanProducts() {
        setProducts([])
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
                            <div className="details">
                                <p className="close" onClick={closeDetails}>
                                    x
                                </p>
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
    )
}

export default Products
