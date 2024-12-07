import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "DELETE") {
        // Delete a pizzas by ID
        const { error } = await supabase.from("pizzas").delete().eq("id", id);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: "Pizza deleted successfully" });
    }

    // Method not allowed
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
