import styles from "@/styles/Home.module.css";

export default function PizzaList({ pizzas, onManage, onDelete }) {
    return (
        <ul className={styles.pizzaList}>
            {pizzas.map((pizza) => (
                <li key={pizza.id} className={styles.pizzaItem}>
                    <div className={styles.pizzaInfo}>
                        <span className={styles.pizzaName}>{pizza.name}</span>
                        {/* Display toppings if available */}
                        {pizza.toppings && pizza.toppings.length > 0 && (
                            <ul className={styles.pizzaToppingsList}>
                                {pizza.toppings.map((topping) => (
                                    <li key={topping} className={styles.pizzaTopping}>
                                        {topping}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className={styles.pizzaActions}>
                        <button
                            onClick={() => onManage(pizza.id)}
                            className={styles.manageButton}
                        >
                            Manage
                        </button>
                        <button
                            onClick={() => onDelete(pizza.id)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}