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

const mockUsers = [
    {
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
    },
    {
        gender: "female",
        name: { title: "Ms", first: "Anna", last: "Smith" },
        location: {
            street: { number: 22, name: "Queen St" },
            city: "London",
            state: "England",
            country: "United Kingdom",
            postcode: 75001,
            coordinates: { latitude: "51.5074", longitude: "-0.1278" },
            timezone: { offset: "+0:00", description: "Greenwich Mean Time" },
        },
        email: "anna.smith@example.com",
        login: { uuid: "user-002", username: "annasmith", password: "securepass", salt: "salt2", md5: "md5hash2", sha1: "sha1hash2", sha256: "sha256hash2" },
        dob: { date: "1985-07-20T00:00:00Z", age: 40 },
        registered: { date: "2012-03-10T08:15:00Z", age: 13 },
        phone: "020-7946-0958",
        cell: "07123-456789",
        id: { name: "NINO", value: "QQ123456C" },
        picture: {
            large: "https://randomuser.me/api/portraits/women/2.jpg",
            medium: "https://randomuser.me/api/portraits/med/women/2.jpg",
            thumbnail: "https://randomuser.me/api/portraits/thumb/women/2.jpg",
        },
        nat: "GB",
    },
];

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

    it("loads multiple people when clicking the button multiple times", async () => {
        // first we mock the fetch to return a fake user
        globalThis.fetch = async () =>
            ({
                ok: true,
                json: async () => ({ results: mockUsers }),
            }) as Response;

        // we render the people component
        render(<People />);

        // we load the button
        const button = (await screen.getByTestId("fetch-people-button")) as HTMLButtonElement;

        // we multiple click to load multiple users
        button?.click();
        button?.click();

        // we check that we loaded the title of the response
        const responseTitle = (await screen.findByTestId("response-title")) as HTMLHeadingElement;
        expect(responseTitle).toBeInTheDocument();
        expect(responseTitle?.textContent).toBe("Random User Collection:");

        // we check that we loaded 2 names
        const nameElements = await screen.findAllByTestId("name");
        expect(nameElements.length).toBe(2);
        expect(nameElements[0].textContent).toMatch(/name:/i);
        expect(nameElements[1].textContent).toMatch(/name:/i);

        // we check that we loaded 2 images
        const imgElements = (await screen.findAllByTestId("img")) as HTMLImageElement[];
        expect(imgElements.length).toBe(2);
        expect(imgElements[0].src).toBeTruthy();
        expect(imgElements[1].src).toBeTruthy();
    });
});
