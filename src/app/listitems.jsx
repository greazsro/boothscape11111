"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Form from "./form";

export default function ListItems({ items = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const modalRef = useRef();

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setSelectedVariant(item.variants ? item.variants[0] : null); // Default to first variant
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setSelectedVariant(null);
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOverlayClick);
    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, []);

  return (
    <main className="bg-slate-700 min-h-screen p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length === 0 ? (
          <p className="text-white text-center col-span-full">No items available</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg cursor-pointer text-center shadow-lg hover:shadow-xl transition duration-200"
              onClick={() => handleOpenModal(item)}
            >
              {/* ✅ Responsive Image Fix */}
              <div className="w-full h-40 flex justify-center items-center">
                <Image
                  src={`/${item.imageSlug}.jpg`} // Ensure image path is correct
                  alt={item.name}
                  width={150}
                  height={150}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>

              {/* ✅ Text Color Fix */}
              <h3 className="text-lg font-semibold mt-2 text-black">{item.name}</h3>

              {/* ✅ Handle Single Items & Variants */}
              {(!item.variants || item.variants.length === 0) ? (
                <p className="text-sm text-black font-bold">₱{item.price || "N/A"}</p>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-black font-bold">Starting at ₱{item.variants[0].price}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal for Ordering */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg relative w-80">
            <span
              onClick={handleCloseModal}
              className="absolute top-2 right-2 p-2 cursor-pointer text-xl font-bold text-gray-600 hover:text-gray-900"
            >
              ✖
            </span>

            <div className="w-full p-4 flex flex-col justify-center items-center">
              <h3 className="text-2xl font-semibold mb-4 text-black">{selectedItem.name}</h3>
              <Image
                src={`/${selectedItem.imageSlug}.jpg`} // Ensure image path is correct
                alt={selectedItem.name}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>

            {/* ✅ Variant Selection */}
            {selectedItem.variants && selectedItem.variants.length > 0 && (
              <div className="w-full px-4">
                <label className="text-black font-semibold">Choose Size & Flavor:</label>
                <select
                  onChange={(e) => {
                    const variant = selectedItem.variants[e.target.value];
                    setSelectedVariant(variant); // Update selected variant
                  }}
                  className="w-full bg-gray-200 p-2 rounded mt-2 text-black"
                >
                  {selectedItem.variants.map((variant, index) => (
                    <option key={index} value={index}>
                      {variant.size} - {variant.flavor} (₱{variant.price})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ✅ Form with updated price */}
            <div className="w-full p-4">
              <Form item={{ ...selectedItem, price: selectedVariant?.price || selectedItem.price }} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
