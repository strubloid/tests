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
});
