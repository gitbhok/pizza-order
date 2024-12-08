import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "POST") {
        const { selectedToppings } = req.body;

        if (!Array.isArray(selectedToppings)) {
            return res.status(400).json({ error: "Invalid toppings format" });
        }

        try {
            // Delete existing toppings
            const { error: deleteError } = await supabase
                .from("pizza_toppings")
                .delete()
                .eq("pizza_id", id);

            if (deleteError) throw deleteError;

            // Insert new toppings
            const { error: insertError } = await supabase
                .from("pizza_toppings")
                .insert(
                    selectedToppings.map((topping) => ({
                        pizza_id: id,
                        topping,
                    }))
                );

            if (insertError) throw insertError;

            res.status(200).json({ message: "Toppings updated successfully" });
        } catch (error) {
            console.error("Error updating toppings:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
