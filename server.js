const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://osbornnartey7:0200osbB@cluster0.wuuuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // or your Atlas URI
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema & Model
const memorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    date: {
        type: String,
        default: () =>
            new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
    },
});
const Memory = mongoose.model('Memory', memorySchema);

// API Routes
app.get('/api/memories', async (req, res) => {
    try {
        const memories = await Memory.find().sort({ _id: -1 });
        res.json(memories);
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/memories', async (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: 'Name and message required' });
    }

    try {
        const newMemory = new Memory({ name, message });
        await newMemory.save();
        res.status(201).json(newMemory);
    } catch {
        res.status(500).json({ error: 'Failed to save memory' });
    }
});

// Serve demo.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demo.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
