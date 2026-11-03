import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import PizzaVisualizer from '../../components/PizzaVisualizer';
import { useCart } from '../../context/CartContext';
import { Check, ArrowRight, ArrowLeft, ShoppingBag, AlertCircle, Sparkles, Info } from 'lucide-react';

export default function CustomPizzaBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCustomPizzaToCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    vegetables: [],
  });

  // Selected State
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVegetables, setSelectedVegetables] = useState([]);
  const [customPizzaName, setCustomPizzaName] = useState('My Masterpiece Pizza');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Fetch categorized builder options from backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await apiFetch('/inventory/builder-options');
        if (res.data) {
          setOptions(res.data);

          // If coming from a prefilled pizza (e.g. from PizzaCard "Customize")
          const prefill = location.state?.prefill;
          if (prefill) {
            const baseMatch = res.data.bases.find((b) => b.name === prefill.base);
            const sauceMatch = res.data.sauces.find((s) => s.name === prefill.sauce);
            const cheeseMatch = res.data.cheeses.find((c) => c.name === prefill.cheese);
            if (baseMatch) setSelectedBase(baseMatch);
            if (sauceMatch) setSelectedSauce(sauceMatch);
            if (cheeseMatch) setSelectedCheese(cheeseMatch);
            if (prefill.vegetables) {
              const vegMatches = res.data.vegetables.filter((v) =>
                prefill.vegetables.includes(v.name)
              );
              setSelectedVegetables(vegMatches);
            }
            setCustomPizzaName(`Customized ${prefill.name}`);
          } else {
            // Default select first available base and sauce
            if (res.data.bases.length > 0) setSelectedBase(res.data.bases[0]);
            if (res.data.sauces.length > 0) setSelectedSauce(res.data.sauces[0]);
            if (res.data.cheeses.length > 0) setSelectedCheese(res.data.cheeses[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load pizza builder options:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [location.state]);

  // Calculate dynamic total price
  const baseCost = selectedBase?.unitPrice || 0;
  const sauceCost = selectedSauce?.unitPrice || 0;
  const cheeseCost = selectedCheese?.unitPrice || 0;
  const vegCost = selectedVegetables.reduce((acc, v) => acc + (v.unitPrice || 0), 0);
  const baseStartingPrice = 199; // Base pizza making & oven firing price
  const totalPrice = baseStartingPrice + baseCost + sauceCost + cheeseCost + vegCost;

  // Toggle vegetable selection
  const toggleVegetable = (veg) => {
    if (selectedVegetables.some((v) => v._id === veg._id)) {
      setSelectedVegetables(selectedVegetables.filter((v) => v._id !== veg._id));
    } else {
      setSelectedVegetables([...selectedVegetables, veg]);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      alert('Please complete selections for base, sauce, and cheese.');
      return;
    }

    addCustomPizzaToCart({
      name: customPizzaName || 'Custom Crafted Pizza',
      base: selectedBase.name,
      sauce: selectedSauce.name,
      cheese: selectedCheese.name,
      vegetables: selectedVegetables.map((v) => v.name),
      price: totalPrice,
      image: selectedBase.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    });

    setAddedSuccess(true);
    setTimeout(() => {
      navigate('/cart');
    }, 800);
  };

  const stepsList = [
    { num: 1, title: 'Pizza Base', desc: 'Choose 1 of 5 crusts' },
    { num: 2, title: 'Sauce', desc: 'Choose 1 of 5 sauces' },
    { num: 3, title: 'Cheese', desc: 'Select cheese type' },
    { num: 4, title: 'Vegetables', desc: 'Select fresh toppings' },
    { num: 5, title: 'Review & Bake', desc: 'Confirm & Add to Cart' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center space-y-3">
          <span className="text-4xl animate-spin">🍕</span>
          <p className="text-sm font-semibold text-stone-600">Loading fresh kitchen pantry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 4-Step Builder</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold">
              Build Your Custom Artisan Pizza
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              Select each ingredient tailored to your taste buds with live price calculation and stock checks.
            </p>
          </div>

          {/* Current Running Price Badge */}
          <div className="bg-stone-800/90 border border-stone-700 p-4 rounded-2xl flex items-center space-x-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Calculated Price
              </span>
              <span className="text-3xl font-extrabold text-orange-400 font-mono">
                ₹{totalPrice}
              </span>
            </div>
            {step === 5 ? (
              <button
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-orange-600/30 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedSuccess ? 'Adding...' : 'Add to Cart'}</span>
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 sm:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between overflow-x-auto gap-3 py-1">
            {stepsList.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`flex items-center space-x-2 flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-orange-600 text-white shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isCurrent
                        ? 'bg-white text-orange-600'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace: Left Pizza Visualizer, Right Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Column: Live Pizza Visualizer */}
          <div className="lg:col-span-5 sticky top-36">
            <PizzaVisualizer
              base={selectedBase?.name}
              sauce={selectedSauce?.name}
              cheese={selectedCheese?.name}
              vegetables={selectedVegetables.map((v) => v.name)}
            />

            {/* Custom Pizza Name input */}
            <div className="mt-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Name Your Creation
              </label>
              <input
                type="text"
                value={customPizzaName}
                onChange={(e) => setCustomPizzaName(e.target.value)}
                placeholder="e.g. Midnight Truffle Fire"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold text-stone-800"
              />
            </div>
          </div>

          {/* Right Column: Step by Step Option Selector */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            
            {/* STEP 1: Choose a Pizza Base (5 options) */}
            {step === 1 && (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Step 1 of 4
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    Choose Your Pizza Base
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Select 1 of 5 freshly fermented artisan doughs (baked fresh daily in our brick ovens).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {options.bases.map((base) => {
                    const isSelected = selectedBase?._id === base._id;
                    const isOutOfStock = base.stockQuantity <= 0;

                    return (
                      <div
                        key={base._id}
                        onClick={() => !isOutOfStock && setSelectedBase(base)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 shadow-md ring-2 ring-orange-200'
                            : isOutOfStock
                            ? 'opacity-40 border-stone-200 cursor-not-allowed bg-stone-100'
                            : 'border-stone-200 hover:border-orange-300 hover:shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-stone-900 text-base">{base.name}</h4>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">{base.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-stone-900">
                            +₹{base.unitPrice}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-700'
                                : base.stockQuantity <= (base.threshold || 20)
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOutOfStock
                              ? 'Out of Stock'
                              : `${base.stockQuantity} in stock`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedBase}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <span>Proceed to Sauces</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Choose a Sauce (5 options) */}
            {step === 2 && (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Step 2 of 4
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    Choose Your Sauce
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Select 1 of 5 signature house-simmered sauces spread evenly across the dough.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {options.sauces.map((sauce) => {
                    const isSelected = selectedSauce?._id === sauce._id;
                    const isOutOfStock = sauce.stockQuantity <= 0;

                    return (
                      <div
                        key={sauce._id}
                        onClick={() => !isOutOfStock && setSelectedSauce(sauce)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 shadow-md ring-2 ring-orange-200'
                            : isOutOfStock
                            ? 'opacity-40 border-stone-200 cursor-not-allowed bg-stone-100'
                            : 'border-stone-200 hover:border-orange-300 hover:shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div>
                          <h4 className="font-bold text-stone-900 text-base">{sauce.name}</h4>
                          <p className="text-xs text-stone-500 mt-1">{sauce.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-stone-900">
                            +₹{sauce.unitPrice}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-700'
                                : sauce.stockQuantity <= (sauce.threshold || 20)
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOutOfStock
                              ? 'Out of Stock'
                              : `${sauce.stockQuantity} in stock`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm flex items-center space-x-2 hover:bg-stone-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedSauce}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <span>Proceed to Cheeses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Choose a Cheese Type */}
            {step === 3 && (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Step 3 of 4
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    Choose Your Cheese Type
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Select your preferred cheese layer for the melt and pull you crave.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {options.cheeses.map((cheese) => {
                    const isSelected = selectedCheese?._id === cheese._id;
                    const isOutOfStock = cheese.stockQuantity <= 0;

                    return (
                      <div
                        key={cheese._id}
                        onClick={() => !isOutOfStock && setSelectedCheese(cheese)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 shadow-md ring-2 ring-orange-200'
                            : isOutOfStock
                            ? 'opacity-40 border-stone-200 cursor-not-allowed bg-stone-100'
                            : 'border-stone-200 hover:border-orange-300 hover:shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div>
                          <h4 className="font-bold text-stone-900 text-base">{cheese.name}</h4>
                          <p className="text-xs text-stone-500 mt-1">{cheese.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-stone-900">
                            +₹{cheese.unitPrice}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-700'
                                : cheese.stockQuantity <= (cheese.threshold || 20)
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOutOfStock
                              ? 'Out of Stock'
                              : `${cheese.stockQuantity} in stock`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm flex items-center space-x-2 hover:bg-stone-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!selectedCheese}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <span>Proceed to Vegetables</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Choose Vegetables (Multiple Select) */}
            {step === 4 && (
              <div>
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Step 4 of 4
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                      Choose Your Fresh Vegetables
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Pick as many farm-fresh toppings as you like! (Multiple select enabled).
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                    {selectedVegetables.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {options.vegetables.map((veg) => {
                    const isSelected = selectedVegetables.some((v) => v._id === veg._id);
                    const isOutOfStock = veg.stockQuantity <= 0;

                    return (
                      <div
                        key={veg._id}
                        onClick={() => !isOutOfStock && toggleVegetable(veg)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex items-center justify-between ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/60 shadow-sm ring-1 ring-orange-200'
                            : isOutOfStock
                            ? 'opacity-40 border-stone-200 cursor-not-allowed bg-stone-100'
                            : 'border-stone-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                              isSelected
                                ? 'bg-orange-600 border-orange-600 text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm">{veg.name}</h4>
                            <p className="text-[11px] text-stone-400">
                              +₹{veg.unitPrice} • {veg.stockQuantity} available
                            </p>
                          </div>
                        </div>

                        {isOutOfStock && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            Sold Out
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm flex items-center space-x-2 hover:bg-stone-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center space-x-2 transition-all"
                  >
                    <span>Review & Finalize</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Final Review & Confirmation */}
            {step === 5 && (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Step 5: Masterpiece Complete
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    Review Your Custom Pizza
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Check your selections before sending to the cart.
                  </p>
                </div>

                {/* Breakdown List */}
                <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-600">Base Artisanal Dough & Firing:</span>
                    <span className="font-mono font-bold">₹{baseStartingPrice}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <div>
                      <span className="font-semibold text-stone-900 block">{selectedBase?.name}</span>
                      <span className="text-xs text-stone-500">Crust selection</span>
                    </div>
                    <span className="font-mono font-bold">+₹{selectedBase?.unitPrice || 0}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <div>
                      <span className="font-semibold text-stone-900 block">{selectedSauce?.name}</span>
                      <span className="text-xs text-stone-500">Sauce layer</span>
                    </div>
                    <span className="font-mono font-bold">+₹{selectedSauce?.unitPrice || 0}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <div>
                      <span className="font-semibold text-stone-900 block">{selectedCheese?.name}</span>
                      <span className="text-xs text-stone-500">Cheese layer</span>
                    </div>
                    <span className="font-mono font-bold">+₹{selectedCheese?.unitPrice || 0}</span>
                  </div>

                  <div className="flex justify-between items-start pb-2 border-b border-stone-200">
                    <div>
                      <span className="font-semibold text-stone-900 block">
                        Fresh Vegetables ({selectedVegetables.length})
                      </span>
                      <span className="text-xs text-stone-500">
                        {selectedVegetables.length > 0
                          ? selectedVegetables.map((v) => v.name).join(', ')
                          : 'No vegetables added'}
                      </span>
                    </div>
                    <span className="font-mono font-bold">+₹{vegCost}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-base font-extrabold text-stone-900">
                    <span>Total Custom Pizza Price:</span>
                    <span className="font-mono text-xl text-orange-600">₹{totalPrice}</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(4)}
                    className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm flex items-center space-x-2 hover:bg-stone-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Edit Vegetables</span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={addedSuccess}
                    className="px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm flex items-center space-x-2 shadow-lg shadow-orange-600/30 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addedSuccess ? 'Adding to Cart...' : 'Add to Cart & Checkout'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

