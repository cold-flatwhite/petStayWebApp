import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });
    res.json(newUser);
  }
});

app.get("/user/:id",requireAuth, async (req, res) => {
  const auth0Id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  res.json(user);
});

app.put("/user/:id",requireAuth, async (req, res) => {
  const auth0Id = req.params.id;
  const { name, contact, address } = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: {
        auth0Id: auth0Id,
      },
      data: {
        name: name,
        contact: contact,
        address: address,
      },
    });
    res.json(updateUser);
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.put("/user/substatus/:id",requireAuth, async (req, res) => {
  const auth0Id = req.params.id;
  const { supplyReg } = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: {
        auth0Id: auth0Id,
      },
      data: {
        supplyReg: supplyReg
      },
    });
    res.json(updateUser);
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.post("/supplier",requireAuth, async (req, res) => {
  const {
    email,
    name,
    phone,
    rate,
    address,
    experience,
    hasChildren,
    hasPetSupplies,
    userAuth0Id,
  } = req.body;
  try {
    const supplier = await prisma.supplier.create({
      data: {
        email,
        name,
        phone,
        rate: parseFloat(rate),
        address,
        experience,
        hasChildren,
        hasPetSupplies,
        userAuth0Id,
      },
    });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/suppliers",requireAuth, async (req, res) => {
  try {
    const supplier = await prisma.supplier.findMany({});
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/suppliers/details/:id",requireAuth, async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/suppliers/byAuth0Id/:userAuth0Id",requireAuth,async(req,res)=>{
  try {
    const supplier = await prisma.supplier.findUnique({
      where : {
        userAuth0Id : req.params.userAuth0Id,
      },
    });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
})



app.post("/order",requireAuth, async (req, res) => {
  try {
    const { userAuth0Id, supplierId, orderDate, price } = req.body;

    const newOrder = await prisma.order.create({
      data: {
        userAuth0Id: userAuth0Id,
        supplierId: supplierId,
        orderDate: orderDate,
        price: price,
        completed: false,
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/orders/:userAuth0Id",requireAuth, async (req, res) => {
  const userAuth0Id = req.params.userAuth0Id;
  try {
    const orders = await prisma.order.findMany({
      where: {
        userAuth0Id: userAuth0Id,
      },
    });
    if (orders) {
      res.json(orders);
    } else {
      res.status(404).send("Orders not found");
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});




app.put("/orders/:orderId",requireAuth, async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { completed: true },
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.delete("/orders/:orderId",requireAuth, async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    res.status(200).json({ message: "Order successfully deleted" });
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
