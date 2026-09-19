const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const uri = process.env.MONGO_URI || "mongodb+srv://myadmin:Sumit1996@cluster0.swk1khb.mongodb.net/chyrisjewels?appName=Cluster0";
const client = new MongoClient(uri);
let db;

const OWNER_NUMBERS = [
  { mobile: "+918401715116", name: "Sumit (Owner)", role: "admin" },
  { mobile: "+917085658953", name: "Owner Two", role: "admin" },
  { mobile: "+917405393841", name: "Owner Three", role: "admin" }
];

async function connectDB() {
    try {
        await client.connect();
        db = client.db('chyrisjewels');
        console.log("MongoDB Connected Successfully!");
        
        for (let owner of OWNER_NUMBERS) {
            await db.collection('users').updateOne(
                { mobile: owner.mobile },
                { $set: { name: owner.name, role: owner.role, updatedAt: new Date() } },
                { upsert: true }
            );
        }
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
connectDB();

app.post('/api/auth/verify-user', async (req, res) => {
  try {
    const { mobile, name } = req.body;
    let user = await db.collection('users').findOne({ mobile: mobile });

    if (!user) {
      const newClient = {
        mobile: mobile,
        name: name || "Valued Client",
        role: "client",
        createdAt: new Date()
      };
      await db.collection('users').insertOne(newClient);
      user = newClient;
    }

    res.json({ status: 'success', user: { mobile: user.mobile, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/client/portal-data', async (req, res) => {
  try {
    const products = await db.collection('products').find({}).toArray();
    const offers = [
      { id: 1, title: "Complimentary Insured Shipping", desc: "Free worldwide delivery on orders above ₹1,00,000" },
      { id: 2, title: "Festive Gold Vault Perk", desc: "Extra 0.5% weight waiver on custom diamond settings" }
    ];
    res.json({ success: true, products, offers });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
