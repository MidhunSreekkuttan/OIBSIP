import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('pizzacraft_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('pizzacraft_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Pre-made Pizza
  const addPremadeToCart = (pizza, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.type === 'premade' && item.pizzaId === pizza._id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          id: `premade_${pizza._id}_${Date.now()}`,
          pizzaId: pizza._id,
          name: pizza.name,
          type: 'premade',
          price: pizza.price,
          quantity,
          image: pizza.image,
          description: pizza.description,
          customization: {
            base: pizza.base,
            sauce: pizza.sauce,
            cheese: pizza.cheese,
            vegetables: pizza.vegetables || [],
          },
        },
      ];
    });
  };

  // Add Custom Pizza
  const addCustomPizzaToCart = (customPizza) => {
    // customPizza: { name, base, sauce, cheese, vegetables, price, image }
    setCartItems((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: customPizza.name || 'Custom Crafted Pizza',
        type: 'custom',
        price: customPizza.price,
        quantity: 1,
        image: customPizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
        description: `Custom build: ${customPizza.base} crust, ${customPizza.sauce}, ${customPizza.cheese}, with ${customPizza.vegetables.join(', ')}`,
        customization: {
          base: customPizza.base,
          sauce: customPizza.sauce,
          cheese: customPizza.cheese,
          vegetables: customPizza.vegetables,
        },
      },
    ]);
  };

  // Update item quantity
  const updateQuantity = (itemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item
  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Apply Coupon
  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'PIZZA50') {
      setDiscountCode('PIZZA50');
      setDiscountAmount(50);
      return { success: true, message: '₹50 discount applied!' };
    } else if (cleanCode === 'CRUST100') {
      setDiscountCode('CRUST100');
      setDiscountAmount(100);
      return { success: true, message: '₹100 discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try PIZZA50 or CRUST100' };
  };

  const removePromoCode = () => {
    setDiscountCode('');
    setDiscountAmount(0);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setDiscountCode('');
    setDiscountAmount(0);
  };

  // Computed Totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 600 || subtotal === 0 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const totalAmount = Math.max(0, subtotal + deliveryFee + tax - discountAmount);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        deliveryFee,
        tax,
        discountCode,
        discountAmount,
        totalAmount,
        addPremadeToCart,
        addCustomPizzaToCart,
        updateQuantity,
        removeFromCart,
        applyPromoCode,
        removePromoCode,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

