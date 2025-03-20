import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, mobileNumber, quantity, price, itemId } = body;

        console.log("Received Order Data:", body);

        if (!name || !mobileNumber || !quantity || !price || !itemId) {
            return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
        }

        const newOrder = await prisma.order.create({
            data: {
              name: "SUGAR",
              mobileNumber: "Comlab, Third floor",
              quantity: 1,
              price: 25,
              itemId: 19,
              createdAt: new Date(), // Set createdAt to current time
              updatedAt: new Date()  // Set updatedAt to current time
            }
          });
          

        return new Response(JSON.stringify(newOrder), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error creating order:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
