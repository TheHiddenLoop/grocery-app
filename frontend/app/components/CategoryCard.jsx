"use client";

import React from "react";

export default function CategoryCard({
    category,
    hoveredCard,
    setHoveredCard,
    onClick,
}) {
    const Icon = category.icon;
    const isHovered = hoveredCard === category.id;

    return (
        <div
            onClick={() => onClick(category.name)}
            onMouseEnter={() => setHoveredCard(category.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group cursor-pointer"
        >
            <div
                className={`
          relative h-full rounded-2xl p-6 
          ${category.bgColor} ${category.hoverBg}
          border-2 ${category.borderColor}
          shadow-lg hover:shadow-2xl
          transform transition-all duration-300 ease-out
          hover:-translate-y-2 hover:scale-105
          overflow-hidden
        `}
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-linear-to-br from-primary to-transparent transition-opacity duration-300" />

                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4">
                        <div
                            className={`
                            w-14 h-14
                            flex items-center justify-center
                            rounded-xl bg-bg-secondary border border-border
                            transition-transform duration-300
                            ${isHovered ? "scale-110 rotate-6" : ""}
                        `}
                        >
                            <Icon className={`w-7 h-7 ${category.iconColor}`} />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-text-primary leading-tight">
                                {category.name}
                            </h3>
                            <p className="text-sm text-text-secondary">
                                {category.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-sm font-semibold text-text-secondary">
                            {category.count}
                        </span>

                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${category.iconColor
                                } ${isHovered ? "translate-x-1" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>

                    <div
                        className={`
                        absolute bottom-0 left-0 right-0 h-1 ${category.iconColor}
                        transition-transform duration-300 origin-left
                        ${isHovered ? "scale-x-100" : "scale-x-0"}
                        `}
                    />
                </div>
            </div>
        </div>
    );
}
