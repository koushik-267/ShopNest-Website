import { sql } from './../config/db.js'; // import the sql function from db.js

// CRUD (create, read, update, delete) operations for products

export const getProducts = async (req,res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY createdat DESC
        `;
        console.log("Fetched Products: ", products);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("Error fetching all products: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}; // async so we can
// call await in it

export const createProduct = async (req,res) => {
    const { name, price, image } = req.body; // works because of body-parser(express.json()) middleware
    if(!name || !price || !image) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    try {
        const newProduct = await sql`
            INSERT INTO products (name, price, image)
            VALUES (${name}, ${price}, ${image})
            RETURNING *
        `;
        console.log("Created Product: ", newProduct);
        res.status(201).json({ success: true, data: newProduct[0] }); // newProduct is an array because of,
        //  RETURNING *, so we take the first element which is the created product containing all fields.        
    } catch (error) {
        console.log("Error creating product: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getProduct = async (req,res) => {
    const { id } = req.params;
    try {
        const product = await sql`
            SELECT * FROM products
            WHERE id = ${id}
        `;
        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Requested product not found" });
        }
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("Error fetching requested product: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateProduct = async (req,res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    if(!name || !price || !image) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    try {
        const updatedProduct = await sql`
            UPDATE products
            SET name = ${name}, price = ${price}, image = ${image}
            WHERE id = ${id}
            RETURNING *
        `;
        if (updatedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Requested product not found" });
        }
        console.log("Updated Product: ", updatedProduct);
        res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteProduct = async (req,res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await sql`
            DELETE FROM products
            WHERE id = ${id}
            RETURNING *
        `;
        if (deletedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Requested product not found to delete" });
        }
        console.log("Deleted Product: ", deletedProduct);
        res.status(200).json({ success: true, data: deletedProduct[0] });
    } catch (error) {
        console.log("Error deleting product: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};