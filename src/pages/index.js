import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Home() {
    const [pizzas, setPizzas] = useState([]);
    const [newPizzaName, setNewPizzaName] = useState("");
    const router = useRouter();

    const addPizza = () => {
        if (!newPizzaName.trim()) return;
        setPizzas([...pizzas, newPizzaName.trim()]);
        setNewPizzaName("");
    };

    const handlePizzaClick = (pizzaName) => {
        router.push(`/pizza/${pizzaName}`);
    };

    return (
        <div className={styles.container}>
            <h1>Manage Pizza</h1>
            <div className={styles.addPizzaContainer}>
                <input
                    type="text"
                    placeholder="Enter pizza name"
                    value={newPizzaName}
                    onChange={(e) => setNewPizzaName(e.target.value)}
                    className={styles.input}
                />
                <button onClick={addPizza} className={styles.addButton}>
                    +
                </button>
            </div>
            <ul className={styles.pizzaList}>
                {pizzas.map((pizza, index) => (
                    <li
                        key={index}
                        onClick={() => handlePizzaClick(pizza)}
                        className={styles.pizzaItem}
                    >
                        {pizza}
                    </li>
                ))}
            </ul>
        </div>
    );
}
