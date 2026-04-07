// src/component/app/App.test.tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import People from "./People";

const mockUser = {
    gender: "male",
    name: { title: "Mr", first: "John", last: "Doe" },
    location: {
        street: { number: 1, name: "Main St" },
        city: "City",
        state: "State",
        country: "Country",
        postcode: 12345,
        coordinates: { latitude: "0", longitude: "0" },
        timezone: { offset: "+0:00", description: "UTC" },
    },
    email: "john@example.com",
    login: { uuid: "123", username: "johndoe", password: "pass", salt: "salt", md5: "md5", sha1: "sha1", sha256: "sha256" },
    dob: { date: "1990-01-01T00:00:00Z", age: 33 },
    registered: { date: "2010-01-01T00:00:00Z", age: 13 },
    phone: "123-456-7890",
    cell: "098-765-4321",
    id: { name: "SSN", value: "123-45-6789" },
    picture: { large: "large.jpg", medium: "medium.jpg", thumbnail: "thumb.jpg" },
    nat: "US",
};

/**
 * Basic smoke test to verify that the main app renders
 * without throwing an error.
 */
describe("People", () => {
    it("renders", () => {
        render(<People />);
        expect(screen.getByText("People List")).toBeInTheDocument();
    });

    beforeEach(() => {
        // mock the return with a fake data
        // globalThis.fetch = async () => ({ ok: true, json: async () => mockProducts }) as Response;
    });

    it("loads a person when clicking the button", async () => {
        // mocking the fetch to return a fake user
        globalThis.fetch = async () => ({ ok: true, json: async () => ({ results: [mockUser] }) }) as Response;

        // we render the people component
        render(<People />);

        // loading button with class .btn
        const button: HTMLButtonElement = screen.getByTestId("fetch-people-button") as HTMLButtonElement;

        // we click to activate the loading of a person
        button?.click();

        // findByTestId waits for the element to appear after the async fetch + state update
        const responseTitle = await screen.findByTestId("response-title");
        expect(responseTitle).toBeInTheDocument();
        expect(responseTitle?.textContent).toBe("Random User Collection:");

        // checking that we loaded the name
        const nameElement = screen.getByTestId("name");
        expect(nameElement).toBeInTheDocument();
        expect(nameElement?.textContent).toMatch(/name:/i);

        // checking that we loaded the image
        const imgElement = screen.getByTestId("img") as HTMLImageElement;
        expect(imgElement).toBeInTheDocument();
        expect(imgElement.src).toBeTruthy();
    });
});
