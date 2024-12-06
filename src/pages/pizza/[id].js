import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Pizza.module.css";

export default function PizzaPage() {
    const router = useRouter();
    const { id } = router.query;

    // Predefined list of 6 available toppings
    const availableToppings = [
        "Pepperoni",
        "Mushrooms",
        "Onions",
        "Sausage",
        "Bacon",
        "Extra Cheese",
    ];

    // State to manage selected toppings
    const [selectedToppings, setSelectedToppings] = useState([]);

    // Toggle topping selection
    const toggleTopping = (topping) => {
        if (selectedToppings.includes(topping)) {
            setSelectedToppings(
                selectedToppings.filter((item) => item !== topping)
            );
        } else {
            setSelectedToppings([...selectedToppings, topping]);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Pizza: {id}</h1>

            <h2>Available Toppings</h2>
            <ul className={styles.toppingList}>
                {availableToppings.map((topping) => (
                    <li key={topping} className={styles.toppingItem}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedToppings.includes(topping)}
                                onChange={() => toggleTopping(topping)}
                            />
                            {topping}
                        </label>
                    </li>
                ))}
            </ul>

            <h2>Selected Toppings</h2>
            {selectedToppings.length > 0 ? (
                <ul className={styles.selectedToppingList}>
                    {selectedToppings.map((topping) => (
                        <li key={topping} className={styles.selectedToppingItem}>
                            {topping}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No toppings selected.</p>
            )}

            <button onClick={() => router.push("/")} className={styles.backButton}>
                Go Back
            </button>
        </div>
    );
}
