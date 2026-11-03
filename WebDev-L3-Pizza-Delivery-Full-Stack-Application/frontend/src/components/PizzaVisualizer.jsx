import React from 'react';

export default function PizzaVisualizer({ base, sauce, cheese, vegetables = [] }) {
  // Determine sauce styling
  const getSauceStyle = () => {
    if (!sauce) return 'bg-amber-100/40';
    const s = sauce.toLowerCase();
    if (s.includes('marinara')) return 'bg-red-600/90';
    if (s.includes('peri-peri')) return 'bg-orange-600/95';
    if (s.includes('alfredo')) return 'bg-amber-50/95 border border-amber-200';
    if (s.includes('bbq')) return 'bg-amber-950/90';
    if (s.includes('pesto')) return 'bg-emerald-600/90';
    return 'bg-red-500';
  };

  // Determine cheese layer styling
  const getCheeseStyle = () => {
    if (!cheese) return 'opacity-0';
    const c = cheese.toLowerCase();
    if (c.includes('cheddar')) return 'bg-amber-300/85';
    if (c.includes('provolone')) return 'bg-yellow-100/90';
    if (c.includes('ricotta')) return 'bg-stone-100/90';
    if (c.includes('vegan')) return 'bg-amber-50/80';
    return 'bg-amber-100/90'; // Mozzarella
  };

  // Determine crust rim styling
  const getCrustBorder = () => {
    if (!base) return 'border-[#d49755] bg-[#deb887]';
    const b = base.toLowerCase();
    if (b.includes('thin')) return 'border-[#c68642] bg-[#d2a679] scale-95';
    if (b.includes('burst')) return 'border-[#e69500] ring-8 ring-amber-300/60 bg-[#deb887]';
    if (b.includes('wheat')) return 'border-[#8b5a2b] bg-[#a0522d] text-amber-100';
    if (b.includes('gluten') || b.includes('cauliflower')) return 'border-[#c8b79b] bg-[#e6dfd3]';
    return 'border-[#c68642] bg-[#deb887]';
  };

  // Pre-calculated aesthetic scattered positions for vegetables
  const toppingCoordinates = [
    { top: '22%', left: '34%' },
    { top: '28%', left: '60%' },
    { top: '48%', left: '22%' },
    { top: '42%', left: '48%' },
    { top: '45%', left: '72%' },
    { top: '68%', left: '38%' },
    { top: '64%', left: '62%' },
    { top: '35%', left: '36%' },
    { top: '56%', left: '50%' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl text-white shadow-2xl border border-stone-800">
      
      {/* Wood Baking Peel / Stone background effect */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        
        {/* Outer Crust Base */}
        <div
          className={`w-60 h-60 sm:w-68 sm:h-68 rounded-full border-[14px] shadow-2xl flex items-center justify-center relative transition-all duration-500 overflow-hidden ${getCrustBorder()}`}
        >
          {/* Sauce Layer */}
          <div
            className={`w-[86%] h-[86%] rounded-full transition-colors duration-500 relative flex items-center justify-center ${getSauceStyle()}`}
          >
            {/* Swirl texture */}
            <div className="absolute inset-0 rounded-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-black" />

            {/* Melted Cheese Layer */}
            <div
              className={`w-[94%] h-[94%] rounded-full transition-all duration-500 relative flex items-center justify-center ${getCheeseStyle()}`}
            >
              {/* Melted bubbles effect */}
              {cheese && (
                <>
                  <div className="absolute w-4 h-4 rounded-full bg-amber-400/40 top-5 left-10 blur-[1px]" />
                  <div className="absolute w-6 h-6 rounded-full bg-amber-500/30 bottom-8 right-12 blur-[1px]" />
                  <div className="absolute w-5 h-5 rounded-full bg-yellow-400/40 top-14 right-10 blur-[1px]" />
                  <div className="absolute w-7 h-7 rounded-full bg-amber-600/30 bottom-14 left-8 blur-[1px]" />
                </>
              )}

              {/* Toppings (Vegetables Scatter) */}
              {vegetables.map((veg, vIdx) => {
                const getVegIcon = () => {
                  const vl = veg.toLowerCase();
                  if (vl.includes('pepper')) return '🫑';
                  if (vl.includes('olive')) return '🫒';
                  if (vl.includes('jalapeño') || vl.includes('jalapeno')) return '🌶️';
                  if (vl.includes('onion')) return '🧅';
                  if (vl.includes('mushroom')) return '🍄';
                  if (vl.includes('tomato')) return '🍅';
                  if (vl.includes('corn')) return '🌽';
                  if (vl.includes('spinach')) return '🥬';
                  return '🌿';
                };

                const coords = toppingCoordinates[vIdx % toppingCoordinates.length];

                return (
                  <span
                    key={`${veg}-${vIdx}`}
                    style={{ top: coords.top, left: coords.left }}
                    className="absolute text-xl sm:text-2xl transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md select-none animate-bounce-short"
                    title={veg}
                  >
                    {getVegIcon()}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer Legend Indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
          Live Artisan Visualizer
        </p>
        <p className="text-xs text-stone-400 mt-0.5">
          {base ? `${base}` : 'Select Crust'} • {sauce ? `${sauce}` : 'Select Sauce'} • {cheese ? `${cheese}` : 'Select Cheese'}
        </p>
        {vegetables.length > 0 && (
          <p className="text-[11px] text-stone-300 mt-1">
            Toppings ({vegetables.length}): {vegetables.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}

