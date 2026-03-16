import Products from '@src/component/products/Products'
import './App.css'

function App() {
    return (
        <>
            <section id="container-centered">
                <div className="hero">
                    <h1>Fetching data on API's</h1>
                </div>
            </section>
            <Products />
            <div className="ticks"></div>
            <section id="spacer"></section>
        </>
    )
}

export default App
