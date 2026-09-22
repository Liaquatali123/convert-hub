'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Ruler, Thermometer, Box, Layers, ArrowLeftRight, HelpCircle } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume';

interface Unit {
  value: string;
  label: string;
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [outputValue, setOutputValue] = useState<string>('');

  const categories = [
    { id: 'length', label: 'Length', icon: Ruler },
    { id: 'weight', label: 'Weight & Mass', icon: Scale },
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'area', label: 'Area', icon: Layers },
    { id: 'volume', label: 'Volume', icon: Box }
  ];

  const units: Record<Category, Unit[]> = {
    length: [
      { value: 'm', label: 'Meters (m)' },
      { value: 'km', label: 'Kilometers (km)' },
      { value: 'mi', label: 'Miles (mi)' },
      { value: 'yd', label: 'Yards (yd)' },
      { value: 'ft', label: 'Feet (ft)' },
      { value: 'in', label: 'Inches (in)' }
    ],
    weight: [
      { value: 'kg', label: 'Kilograms (kg)' },
      { value: 'g', label: 'Grams (g)' },
      { value: 'lb', label: 'Pounds (lb)' },
      { value: 'oz', label: 'Ounces (oz)' }
    ],
    temperature: [
      { value: 'C', label: 'Celsius (°C)' },
      { value: 'F', label: 'Fahrenheit (°F)' },
      { value: 'K', label: 'Kelvin (K)' }
    ],
    area: [
      { value: 'm2', label: 'Square Meters (m²)' },
      { value: 'km2', label: 'Square Kilometers (km²)' },
      { value: 'mi2', label: 'Square Miles (mi²)' },
      { value: 'ac', label: 'Acres (ac)' },
      { value: 'ha', label: 'Hectares (ha)' }
    ],
    volume: [
      { value: 'L', label: 'Liters (L)' },
      { value: 'mL', label: 'Milliliters (mL)' },
      { value: 'gal', label: 'Gallons (gal)' },
      { value: 'qt', label: 'Quarts (qt)' },
      { value: 'cup', label: 'Cups' }
    ]
  };

  // Convert everything to base values first, then scale to target units
  const lengthFactors: Record<string, number> = {
    m: 1,
    km: 1000,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254
  };

  const weightFactors: Record<string, number> = {
    kg: 1,
    g: 0.001,
    lb: 0.45359237,
    oz: 0.028349523
  };

  const areaFactors: Record<string, number> = {
    m2: 1,
    km2: 1000000,
    mi2: 2589988.11,
    ac: 4046.85642,
    ha: 10000
  };

  const volumeFactors: Record<string, number> = {
    L: 1,
    mL: 0.001,
    gal: 3.78541178,
    qt: 0.946352946,
    cup: 0.236588236
  };

  // Update default units on category change
  useEffect(() => {
    const list = units[category];
    if (list && list.length >= 2) {
      setFromUnit(list[0].value);
      setToUnit(list[1].value);
    }
  }, [category]);

  // Run conversion in real-time
  useEffect(() => {
    const numericInput = parseFloat(inputValue);
    if (isNaN(numericInput)) {
      setOutputValue('');
      return;
    }

    if (fromUnit === toUnit) {
      setOutputValue(inputValue);
      return;
    }

    let result = 0;

    if (category === 'length') {
      const valueInMeters = numericInput * lengthFactors[fromUnit];
      result = valueInMeters / lengthFactors[toUnit];
    } else if (category === 'weight') {
      const valueInKg = numericInput * weightFactors[fromUnit];
      result = valueInKg / weightFactors[toUnit];
    } else if (category === 'area') {
      const valueInM2 = numericInput * areaFactors[fromUnit];
      result = valueInM2 / areaFactors[toUnit];
    } else if (category === 'volume') {
      const valueInLiters = numericInput * volumeFactors[fromUnit];
      result = valueInLiters / volumeFactors[toUnit];
    } else if (category === 'temperature') {
      // Temperature uses equations rather than linear factors
      let valueInCelsius = 0;

      // 1. Convert to base (Celsius)
      if (fromUnit === 'C') valueInCelsius = numericInput;
      else if (fromUnit === 'F') valueInCelsius = ((numericInput - 32) * 5) / 9;
      else if (fromUnit === 'K') valueInCelsius = numericInput - 273.15;

      // 2. Convert from base (Celsius) to target
      if (toUnit === 'C') result = valueInCelsius;
      else if (toUnit === 'F') result = (valueInCelsius * 9) / 5 + 32;
      else if (toUnit === 'K') result = valueInCelsius + 273.15;
    }

    // Format output cleanly (maximum 6 decimal places, remove trailing zeros)
    if (result === 0) {
      setOutputValue('0');
    } else {
      const formatted = result.toFixed(6).replace(/\.?0+$/, '');
      setOutputValue(formatted);
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const toolFAQs = [
    {
      question: 'How accurate are these conversions?',
      answer: 'Our converter uses standard international conversion factors (e.g. 1 inch = 2.54 cm, 1 pound = 453.59g). Standard floating-point precision is maintained to guarantee professional results.'
    },
    {
      question: 'Why are there offsets for Temperature?',
      answer: 'Unlike Length or Weight (where 0 units in one system equals 0 in another), Temperature scales have unique origins/zero offsets (e.g., 0°C is 32°F and 273.15 K). We use algebraic formulas for temperature scaling.'
    },
    {
      question: 'Does it support negative numbers?',
      answer: 'Yes! Negative numbers are fully supported, which is especially useful for Celsius and Fahrenheit temperature conversions.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="Universal Unit Converter"
        description="Convert instantly between common length, weight, temperature, area, and volume measurements with precision."
        categoryName="String Utilities"
        categoryHref="/tools?category=developer"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="md:col-span-8 space-y-6">
          
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-6">
            
            {/* Tabs for Categories */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-800">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = category === cat.id;
                return (
                  <button
                    id={`unit-tab-${cat.id}`}
                    key={cat.id}
                    onClick={() => setCategory(cat.id as Category)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-gray-950 text-indigo-600 dark:text-indigo-400 border border-gray-200/60 dark:border-gray-850 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Converting Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* From value and unit */}
              <div className="sm:col-span-5 space-y-2">
                <label htmlFor="unit-from-value" className="block text-xs font-bold text-gray-400 uppercase tracking-wide">From Value</label>
                <div className="space-y-2">
                  <input
                    id="unit-from-value"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none font-semibold shadow-sm"
                  />
                  <select
                    id="unit-from-selector"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none font-bold shadow-sm"
                  >
                    {units[category].map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-2 flex justify-center pt-4 sm:pt-6">
                <button
                  id="unit-swap-btn"
                  onClick={handleSwap}
                  className="p-3 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-950 transition-all shadow-sm cursor-pointer"
                  title="Swap Units"
                >
                  <ArrowLeftRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </button>
              </div>

              {/* To value and unit */}
              <div className="sm:col-span-5 space-y-2">
                <label htmlFor="unit-to-value" className="block text-xs font-bold text-gray-400 uppercase tracking-wide">To Value</label>
                <div className="space-y-2">
                  <input
                    id="unit-to-value"
                    type="text"
                    readOnly
                    value={outputValue}
                    placeholder="Result value"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/30 text-gray-900 dark:text-white focus:outline-none font-bold"
                  />
                  <select
                    id="unit-to-selector"
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none font-bold shadow-sm"
                  >
                    {units[category].map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <FAQ items={toolFAQs} />
        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-950/20 p-5 rounded-2xl border border-gray-150 dark:border-gray-900 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Tool Specifications
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Total categories</span>
                <span className="font-bold text-gray-950 dark:text-white">5 (Configurable)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Unique units</span>
                <span className="font-bold text-gray-950 dark:text-white">24 Options</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Update trigger</span>
                <span className="font-bold text-gray-950 dark:text-white">Real-Time (On Input)</span>
              </li>
              <li className="flex justify-between">
                <span>Calculation engine</span>
                <span className="font-bold text-gray-950 dark:text-white">100% Native Client</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
