import { ProductService } from "@src/component/products/ProductService";
import type { APIProduct } from "@src/component/products/ProductService";

// we start this test by getting the data from the api request to simulate
const mockProducts = [
    {
        id: 17,
        title: "Classic Black T-Shirt ",
        slug: "classic-black-t-shirt",
        price: 35,
        description: "Elevate your everyday style with our Classic Black T-Shirt. This staple piece is crafted from soft, breathable cotton for all-day comfort.",
        images: ["https://i.imgur.com/9DqEOV5.jpeg", "https://i.imgur.com/ae0AEYn.jpeg"],
        creationAt: "2026-04-08T19:37:19.000Z",
        updatedAt: "2026-04-09T12:59:31.000Z",
        category: {
            id: 1,
            name: "Updated Category Cypress",
            slug: "updated-category-cypress",
            image: "https://i.imgur.com/placeholder-category.jpeg",
        },
    },
    {
        id: 19,
        title: "Sleek Wireless Headphone & Inked Earbud Set",
        slug: "sleek-wireless-headphone-inked-earbud-set",
        price: 44,
        description: "Experience the fusion of style and sound with this sophisticated audio set featuring wireless headphones and earbuds.",
        images: ["https://i.imgur.com/yVeIeDa.jpeg", "https://i.imgur.com/jByJ4ih.jpeg"],
        creationAt: "2026-04-08T19:37:19.000Z",
        updatedAt: "2026-04-08T19:37:19.000Z",
        category: {
            id: 2,
            name: "Electronics",
            slug: "electronics",
            image: "https://i.imgur.com/ZANVnHE.jpeg",
        },
    },
];

// creating the save of original fetch
const originalFetch = globalThis.fetch;

describe("Products", () => {
    // before each test we create the mock of the fetch with the MockProducts as a Response
    beforeEach(() => {
        // mock the return with a fake data
        globalThis.fetch = async () => ({ ok: true, json: async () => mockProducts }) as Response;
    });

    // after each test we put it back what was the original value of the mocked data
    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it("loads when the api URL is correct", async () => {
        // this will be the variable to check after the request to the API
        var titleToCheck = "Classic Black T-Shirt  Sleek Wireless Headphone & Inked Earbud Set";

        // loading the api url value to check
        const apiUrl = "https://api.escuelajs.co/api/v1/products";

        // trying to use the api function
        const data: APIProduct[] = await ProductService.fetchData(apiUrl);

        // checking that response isnt null
        expect(data).not.toBeNull();

        // getting the data of the map
        const jsonData = data.map((product: APIProduct) => product.title).join(" ");

        //checking that the json data contain the titleToCheck
        expect(jsonData).toContain(titleToCheck);
    });

    it("throws an error when the api URL is incorrect", async () => {
        // a wrong api url to check the error handling
        const wrongApiUrl = "https://api.escuelajs.co/api/v1/products/incorrect-url";
        const errorMessage = "Error fetching data, try again!";
        let capturedError: Error | null = null;

        // we mock the fetch to return an error
        globalThis.fetch = async () => ({ ok: false }) as Response;

        try {
            // we try to get the data from the false api url
            const data: APIProduct[] = await ProductService.fetchData(wrongApiUrl);

            // we check if the response is null
            expect(data).toBe(null);
        } catch (error) {
            capturedError = error as Error;
        }

        // exist an exception being thrown
        expect(capturedError).not.toBeNull();

        // the error message is correct
        expect(capturedError?.message).toContain(errorMessage);
    });

    it("throws an error when is missing a required field", async () => {
        // creating a product with a required field missing
        const { title, ...productWithoutTitle } = mockProducts[0];
        const invalidProduct = productWithoutTitle as unknown as APIProduct;
        const errorMessage = "Missing required field: title";
        let capturedError: Error | null = null;

        // we mock the fetch with the product without the title
        globalThis.fetch = async () => ({ ok: true, json: async () => [productWithoutTitle] }) as Response;

        try {
            // we try to load the details of the incomplete product
            const data = ProductService.loadDetails(invalidProduct);
        } catch (error) {
            capturedError = error as Error;
        }

        // exist an exception being thrown
        expect(capturedError).not.toBeNull();

        // the error message is correct
        expect(capturedError?.message).toContain(errorMessage);
    });
    it("throws an error when a field has an invalid type", async () => {
        // we create a product with required field having an invalid type
        const invalidProductPrice = { ...mockProducts[0], price: "invalid_string_price_should_be_a_number" } as unknown as APIProduct;

        // the message that we should get when is thown the exception
        const errorMessage = "Invalid type for field: price";

        // this will be the variable to check after the request to the API
        let capturedError: Error | null = null;

        // we mock the fetch with the invalid product price type
        globalThis.fetch = async () => ({ ok: true, json: async () => [invalidProductPrice] }) as Response;

        try {
            // we try to load the details of the product with the invalid price type
            const data = ProductService.loadDetails(invalidProductPrice);

            // we expect to be null as it should throw an exception
            expect(data).toBeNull();
        } catch (error) {
            capturedError = error as Error;
        }

        // we check that the error exist something in it
        expect(capturedError).not.toBeNull();

        // we check that the error message contain the expected error message
        expect(capturedError?.message).toContain(errorMessage);
    });
});
