"use client";

import { useState } from "react";

const categories = ["All", "3D Illuminated", "LED Signs", "Lightboxes", "Neon Signs", "Metal Signs", "Acrylic Signs", "3D Printed"];

const projects = [
  { name: "Lounge Lovers", category: "3D Illuminated" },
  { name: "T2 Tea", category: "Lightboxes" },
  { name: "Deli", category: "3D Illuminated" },
  { name: "Momenti", category: "Lightboxes" },
  { name: "NUP Building", category: "3D Illuminated" },
  { name: "Fruit World", category: "3D Illuminated" },
  { name: "The Smelly Cheesecake", category: "Neon Signs" },
  { name: "Muscle Factory", category: "LED Signs" },
  { name: "Winners", category: "3D Illuminated" },
  { name: "MyMac", category: "Acrylic Signs" },
  { name: "Hugo Boss", category: "Metal Signs" },
  { name: "AIA Tower", category: "3D Illuminated" },
  { name: "Little Creatures", category: "Neon Signs" },
  { name: "#eatfuh", category: "Neon Signs" },
  { name: "Fishbowl", category: "Neon Signs" },
  { name: "Fitting Rooms", category: "3D Illuminated" },
  { name: "Yo-Chi", category: "3D Illuminated" },
  { name: "Petbarn", category: "LED Signs" },
  { name: "Oroton", category: "Metal Signs" },
  { name: "Chemist Warehouse", category: "LED Signs" },
  { name: "Chrome Fabricated Letters", category: "Metal Signs" },
  { name: "NCS", category: "3D Illuminated" },
  { name: "Yolk", category: "3D Illuminated" },
  { name: "Metal Cut-Out Letters", category: "Metal Signs" },
  { name: "Cheezious", category: "Neon Signs" },
  { name: "Toni & Guy", category: "LED Signs" },
  { name: "Essence Pilates", category: "Acrylic Signs" },
  { name: "SAS", category: "3D Illuminated" },
  { name: "Pure Yoga", category: "3D Illuminated" },
  { name: "G-Shock", category: "3D Illuminated" },
  { name: "Guzman y Gomez", category: "Lightboxes" },
  { name: "Fitting Rooms Globes", category: "3D Printed" },
  { name: "Illuminated Floor Logo", category: "LED Signs" },
];

export default function GalleryPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-[#d4a017]">Work</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            Over 5,000 signs installed for leading brands across Australia.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  active === cat
                    ? "bg-[#d4a017] text-black border-[#d4a017]"
                    : "bg-transparent text-gray-400 border-[#1f1f1f] hover:border-[#d4a017]/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div
                key={p.name}
                className="card-dark aspect-square flex flex-col items-center justify-center hover:border-[#d4a017]/40 transition-all cursor-pointer group"
              >
                <div className="text-center p-4">
                  <p className="text-xs text-[#d4a017] mb-1">{p.category}</p>
                  <p className="text-white text-sm font-medium group-hover:text-[#d4a017] transition-colors">{p.name}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-gray-500 text-center py-20">No projects in this category yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
