import React, { useState } from "react";
import addOrder from "./actions/order";

export default function Form({ item }) {
    const safeItem = item || { id: 0, price: 0, variants: [] };
    const variants = safeItem.variants || [];

    // Extract unique sizes and flavors
    const uniqueSizes = [...new Set(variants.map(v => v.size))];
    const uniqueFlavors = [...new Set(variants.map(v => v.flavor))];

    // Set initial selections
    const [selectedSize, setSelectedSize] = useState(uniqueSizes[0] || "Default");
    const [selectedFlavor, setSelectedFlavor] = useState(uniqueFlavors[0] || "Standard");
    const [name, setName] = useState("");
    const [secondName, setSecondName] = useState(""); // Second name input state
    const [mobileNumber, setMobileNumber] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Get price based on selected size & flavor
    const selectedVariant = variants.find(
        (v) => v.size === selectedSize && v.flavor === selectedFlavor
    ) || { price: safeItem.price };

    const [totalPrice, setTotalPrice] = useState(selectedVariant.price);

    // Handle size selection
    const handleSizeChange = (size) => {
        setSelectedSize(size);
        updatePrice(size, selectedFlavor, quantity);
    };

    // Handle flavor selection
    const handleFlavorChange = (flavor) => {
        setSelectedFlavor(flavor);
        updatePrice(selectedSize, flavor, quantity);
    };

    // Handle quantity change
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value) || 1;
        setQuantity(newQuantity);
        updatePrice(selectedSize, selectedFlavor, newQuantity);
    };

    // Update price based on selection
    const updatePrice = (size, flavor, qty) => {
        const variant = variants.find((v) => v.size === size && v.flavor === flavor);
        setTotalPrice((variant ? variant.price : safeItem.price) * qty);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (!name || !mobileNumber || !quantity || !selectedVariant.price || !safeItem.id) {
            console.error("❌ Missing required fields:", { name, mobileNumber, quantity, price: selectedVariant.price, item: safeItem });
            return;
        }

        const orderData = {
            name,
            secondName, // Include the second name in the order data
            mobileNumber,
            quantity,
            price: selectedVariant.price,
            itemId: safeItem.id,
            size: selectedSize,
            flavor: selectedFlavor,
        };

        console.log("Final order data:", orderData);

        try {
            const response = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit order");
            }

            console.log("✅ Order submitted successfully:", data);
        } catch (error) {
            console.error("❌ Error submitting order:", error.message);
        }
    };

    return (
        <div className="bg-blue-200 p-4 rounded-lg">
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-12 gap-4">
                {/* ✅ Size Selection */}
                {uniqueSizes.length > 0 && (
                    <div className="col-span-12 flex flex-col gap-1">
                        <label className="text-black">Size</label>
                        <div className="flex gap-2">
                            {uniqueSizes.map((size, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSizeChange(size)}
                                    className={`px-3 py-1 rounded-lg ${selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ✅ Flavor Selection */}
                {uniqueFlavors.length > 0 && (
                    <div className="col-span-12 flex flex-col gap-1">
                        <label className="text-black">Flavor</label>
                        <div className="flex gap-2">
                            {uniqueFlavors.map((flavor, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleFlavorChange(flavor)}
                                    className={`px-3 py-1 rounded-lg ${selectedFlavor === flavor ? "bg-green-500 text-white" : "bg-gray-200 text-black"}`}
                                >
                                    {flavor}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ✅ Quantity Input */}
                <div className="col-span-4 flex flex-col gap-1">
                    <label htmlFor="quantity" className="text-black">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        className="py-1 px-2 rounded-lg bg-white text-black"
                        value={quantity}
                        onChange={handleQuantityChange}
                        max={100}
                    />
                </div>

                {/* ✅ Price Display */}
                <div className="col-span-4 flex flex-col gap-1">
                    <label htmlFor="price" className="text-black">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        className="py-1 px-2 rounded-lg bg-white text-black"
                        value={totalPrice}
                        readOnly
                    />
                </div>

                {/* ✅ Name Input */}
                <div className="col-span-12 flex flex-col gap-1">
                    <label htmlFor="name" className="text-black">Flavor(If applicable)</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="py-1 px-2 rounded-lg bg-white text-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* ✅ Second Name Input (Added below the first Name input) */}
                <div className="col-span-12 flex flex-col gap-1">
                    <label htmlFor="secondName" className="text-black">Name</label>
                    <input
                        type="text"
                        name="secondName"
                        id="secondName"
                        className="py-1 px-2 rounded-lg bg-white text-black"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)} // Handle change for second name
                    />
                </div>

                {/* ✅ Mobile Number Input */}
                <div className="col-span-12 flex flex-col gap-1">
                    <label htmlFor="mobileNumber" className="text-black">Place to Receive</label>
                    <input
                        type="text"
                        name="mobileNumber"
                        id="mobileNumber"
                        className="py-1 px-2 rounded-lg bg-white text-black"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                    />
                </div>

                {/* ✅ Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-400 rounded-lg py-2 px-3 col-span-12 mt-auto text-black"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
