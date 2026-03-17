// src/component/app/App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * Basic smoke test to verify that the main app renders
 * without throwing an error.
 */
describe("App", () => {
    it("renders", () => {
        render(<App />);
        expect(screen.getByText("Fetching data on API's")).toBeInTheDocument();
    });
});
