// /src/pages/index.js
import usePizzas from "@/hooks/usePizzas";
import PizzaForm from "@/components/PizzaForm";
import PizzaList from "@/components/PizzaList";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const { pizzas, loading, addNewPizza, removePizza } = usePizzas();

    return (
        <div className={styles.container}>
            <h1>Manage Pizzas</h1>
            <PizzaForm onAddPizza={addNewPizza} loading={loading} />
            <h2>Pizza List</h2>
            <PizzaList
                pizzas={pizzas}
                onManage={(id) => router.push(`/pizza/${id}`)}
                onDelete={removePizza}
            />
        </div>
    );
}