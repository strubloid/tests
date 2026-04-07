import { ProductService } from "@src/component/products/ProductService";
import type { APIProduct } from "@src/component/products/ProductService";

// we start this test by getting the data from the api request to simulate
const mockProducts = [
    {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
        rating: { rate: 3.9, count: 120 },
    },
    {
        id: 2,
        title: "Mens Casual Premium Slim Fit T-Shirts ",
        price: 22.3,
        description:
            "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
        rating: { rate: 4.1, count: 259 },
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
        var titleToCheck = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops";

        // loading the api url value to check
        const apiUrl = "https://fakestoreapi.com/products";

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
        const wrongApiUrl = "https://fakestoreapi.com/incorrect-url";
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

    it("Cant load with missing 2 or more required fields", async () => {
        // we create a product with a required field missing
        const { title, price, description, ...productWithoutTitlePriceDescription } = mockProducts[0];
        const invalidProduct = productWithoutTitlePriceDescription as unknown as APIProduct;

        // the message that we should get when is thown the exception
        const errorMessage = "Missing required field: title, price, description";

        // we need to have a variable to check the error captured
        let capturedError: Error | null = null;

        // we mock the fetch with the product without the title, price and description
        globalThis.fetch = async () =>
            ({
                ok: true,
                json: async () => [invalidProduct],
            }) as Response;

        try {
            // we try to load the details of the incomplete product
            const data = ProductService.loadDetails(invalidProduct);

            // we expect to be null as it will be throwing an exception
            expect(data).toBeNull();
        } catch (error) {
            capturedError = error as Error;

            // first of all we need to have an error
            expect(capturedError).not.toBeNull();

            // secondly we need to have the error the expected one
            expect(capturedError?.message).toBe(errorMessage);
        }
    });
});
