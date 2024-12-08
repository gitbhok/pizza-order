import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        // Fetch pizza details
        try {
            const { data: pizza, error: pizzaError } = await supabase
                .from("pizzas")
                .select("name")
                .eq("id", id)
                .single();

            if (pizzaError) {
                return res.status(500).json({ error: pizzaError.message });
            }

            const { data: toppings, error: toppingsError } = await supabase
                .from("pizza_toppings")
                .select("topping")
                .eq("pizza_id", id);

            if (toppingsError) {
                return res.status(500).json({ error: toppingsError.message });
            }

            return res.status(200).json({
                pizzaName: pizza.name,
                selectedToppings: toppings.map((item) => item.topping),
            });
        } catch (error) {
            return res.status(500).json({ error: "An unexpected error occurred" });
        }
    }

    if (req.method === "DELETE") {
        // Delete a pizza by ID
        try {
            const { error } = await supabase.from("pizzas").delete().eq("id", id);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ message: "Pizza deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: "An unexpected error occurred" });
        }
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
