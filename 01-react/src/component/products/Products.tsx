import { useState } from "react";
import "./Product.css";

function Products() {
    return (
        <>
            <section id="products-tasks">
                <div className="task">
                    <h2>Task one</h2>
                    <p>Click here 1</p>
                </div>
                <div className="task">
                    <h2>Task two</h2>
                    <p>Click here 2</p>
                </div>
            </section>
        </>
    );
}

export default Products;
