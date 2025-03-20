import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { name, mobileNumber, quantity, price, itemId } = await req.json();

        console.log("Received Order Data:", { name, mobileNumber, quantity, price, itemId });

        const newOrder = await prisma.order.create({
            data: {
                name,
                mobileNumber: String(mobileNumber), // Ensure mobileNumber is a string
                quantity: parseInt(quantity), // Convert quantity to integer
                price: parseFloat(price), // Convert price to float
                itemId: parseInt(itemId), // Convert itemId to integer
            },
        });

        return new Response(JSON.stringify(newOrder), { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
