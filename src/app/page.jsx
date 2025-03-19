"use client";

import { useEffect, useState } from "react";
import ListItems from "./listitems";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token in local storage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert token existence to boolean

    // Fetch items
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");
        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();
        console.log("Fetched items:", data); // Debugging log
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <main className="bg-slate-700 h-auto">
      <div className="flex justify-between items-center p-4">
        <h1 className="font-bold text-p1 text-white">ShopScape</h1>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="p-10">
        {items.length > 0 ? (
          <ListItems items={items} />
        ) : (
          <p className="text-white text-center">No items available</p>
        )}
      </div>
    </main>
  );
}
