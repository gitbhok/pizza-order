import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Home() {
    const [pizzas, setPizzas] = useState([]); // Array of pizzas with their toppings
    const [newPizzaName, setNewPizzaName] = useState("");
    const router = useRouter();

    // Add a new pizza (no duplicates allowed)
    const addPizza = () => {
        if (!newPizzaName.trim()) return; // Avoid adding empty names
        if (pizzas.some((pizza) => pizza.name.toLowerCase() === newPizzaName.trim().toLowerCase())) {
            alert("Pizza with this name already exists!");
            return;
        }

        setPizzas([...pizzas, { name: newPizzaName.trim(), toppings: [] }]);
        setNewPizzaName("");
    };

    // Delete a pizza
    const deletePizza = (name) => {
        setPizzas(pizzas.filter((pizza) => pizza.name !== name));
    };

    // Navigate to pizza page with toppings management
    const navigateToPizza = (pizza) => {
        router.push({
            pathname: `/pizza/${pizza.name}`,
            query: { toppings: JSON.stringify(pizza.toppings) },
        });
    };

    return (
        <div className={styles.container}>
            <h1>Manage Pizzas</h1>

            {/* Add Pizza */}
            <div className={styles.addPizzaContainer}>
                <input
                    type="text"
                    placeholder="Enter pizza name"
                    value={newPizzaName}
                    onChange={(e) => setNewPizzaName(e.target.value)}
                    className={styles.input}
                />
                <button onClick={addPizza} className={styles.addButton}>
                    Add Pizza
                </button>
            </div>

            {/* List of Pizzas */}
            <ul className={styles.pizzaList}>
                {pizzas.map((pizza, index) => (
                    <li key={index} className={styles.pizzaItem}>
                        <div className={styles.pizzaDetails}>
                            <strong>{pizza.name}</strong>
                            {pizza.toppings.length > 0 && (
                                <p>Toppings: {pizza.toppings.join(", ")}</p>
                            )}
                            {pizza.toppings.length === 0 && <p>No toppings added.</p>}
                        </div>
                        <button
                            onClick={() => navigateToPizza(pizza)}
                            className={styles.manageButton}
                        >
                            Manage
                        </button>
                        <button
                            onClick={() => deletePizza(pizza.name)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
