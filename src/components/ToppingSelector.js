import styles from "@/styles/Pizza.module.css";

export default function ToppingSelector({ toppings, selectedToppings, onToggle }) {
    return (
        <ul className={styles.toppingList}>
            {toppings.map((topping) => (
                <li key={topping} className={styles.toppingItem}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedToppings.includes(topping)}
                            onChange={() => onToggle(topping)}
                        />
                        {topping}
                    </label>
                </li>
            ))}
        </ul>
    );
}
