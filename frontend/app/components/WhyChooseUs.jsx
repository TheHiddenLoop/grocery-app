"use client"

import React from 'react';
import { Truck, CheckCircle, DollarSign, RefreshCw } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Same day / Next day delivery",
      color: "primary"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Fresh & Quality Products",
      description: "100% quality guaranteed",
      color: "success"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Best Prices",
      description: "No hidden charges",
      color: "warning"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Easy Return / Refund",
      description: "Hassle-free returns",
      color: "info"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: "text-primary group-hover:bg-primary/10",
      success: "text-success group-hover:bg-success/10",
      warning: "text-warning group-hover:bg-warning/10",
      info: "text-info group-hover:bg-info/10"
    };
    return colors[color];
  };

  return (
    <section className="py-16 px-4 bg-bg-primary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-text-primary">
          Why Choose Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-bg-secondary border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-lg transition-all duration-300 ${getColorClasses(feature.color)}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}