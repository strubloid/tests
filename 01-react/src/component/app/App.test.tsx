// src/component/app/App.test.tsx
import { render, screen } from '@testing-library/react'
import App from './App'

/**
 * Basic smoke test to verify that the main app renders
 * without throwing an error.
 */
describe('App tests', () => {
    // this will be checking if the main app is able to load or not
    it('Is it Rendering the main app page?', () => {
        const phrase = "Fetching data on API's"

        // loadidng the main app element
        const { container } = render(<App />)

        // checks if the text exists, therefore the app is able to load
        expect(screen.getByText(phrase)).toBeInTheDocument()

        // getting the value of the h1 inside of .hero
        const elementValue = container.querySelector('.hero h1')?.textContent

        // checking that the value of the h1 is correct
        expect(elementValue).toBe(phrase)
    })
})
