// index.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const connectDB = require("./src/database/config");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database and start server
async function startServer() {
    try {
        await connectDB();
        
        // Routes
        app.use("/api/users", userRoutes);
        app.use("/api/product", productRoutes);

        // Root route
        app.get("/", (req, res) => {
            res.send("Han bhai agya sawaad to the Node.js MongoDB Backend!");
        });

        // Start server
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

// Start the application
startServer();