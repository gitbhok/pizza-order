import styles from "@/styles/Home.module.css";
import { useState } from "react";

export default function PizzaForm({ onAddPizza, loading }) {
    const [pizzaName, setPizzaName] = useState("");

    const handleSubmit = () => {
        if (pizzaName.trim()) {
            onAddPizza(pizzaName);
            setPizzaName("");
        } else {
            alert("Pizza name cannot be empty!");
        }
    };

    return (
        <div className={styles.addPizzaContainer}>
            <input
                type="text"
                placeholder="Pizza Name"
                value={pizzaName}
                onChange={(e) => setPizzaName(e.target.value)}
                className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.addButton} disabled={loading}>
                {loading ? "Adding..." : "Add Pizza"}
            </button>
        </div>
    );
}
