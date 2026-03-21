import React, { useState } from 'react';
import { BottomNavBar } from './BottomNavBar';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface ServiceDetailScreenProps {
  onBack?: () => void;
  onAddToCart?: (items: { id: string; name: string; price: number; quantity: number }[]) => void;
}

export function ServiceDetailScreen({ onBack, onAddToCart }: ServiceDetailScreenProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const items: Item[] = [
    { id: '1', name: 'Shirt', price: 49 },
    { id: '2', name: 'Trouser', price: 59 },
    { id: '3', name: 'T-Shirt', price: 39 },
    { id: '4', name: 'Jeans', price: 69 },
    { id: '5', name: 'Kurta', price: 79 },
    { id: '6', name: 'Saree', price: 199 },
    { id: '7', name: 'Blazer', price: 149 },
    { id: '8', name: 'Suit (2-piece)', price: 249 },
    { id: '9', name: 'Dress', price: 89 },
    { id: '10', name: 'Skirt', price: 59 }
  ];

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const hasItems = totalItems > 0;

  const handleAddToCart = () => {
    const cartItems = Object.entries(quantities).map(([id, quantity]) => {
      const item = items.find(i => i.id === id)!;
      return { ...item, quantity };
    });
    onAddToCart?.(cartItems);
  };

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#F3EFE6]">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 bg-[#F3EFE6] flex items-center justify-center"
        style={{ 
          height: '100px',
          paddingTop: '47px',
          borderBottom: '1px solid rgba(15,46,42,0.08)'
        }}
      >
        {/* Back arrow */}
        <button 
          onClick={onBack}
          className="absolute left-4 w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M15 18L9 12L15 6" 
              stroke="#0F2E2A" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Service name */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 600,
            color: '#0F2E2A'
          }}
        >
          Wash & Iron
        </h1>
      </div>

      {/* Scrollable content */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: hasItems ? 'calc(844px - 100px - 88px - 72px)' : 'calc(844px - 100px - 72px)',
          paddingBottom: '24px'
        }}
      >
        {/* Hero Section */}
        <div className="px-5 pt-5">
          <div
            className="w-full rounded-[20px] overflow-hidden"
            style={{
              background: '#0F2E2A',
              padding: '32px 24px'
            }}
          >
            {/* Turnaround badge */}
            <div
              className="inline-flex items-center gap-1 rounded-full mb-3"
              style={{
                background: 'rgba(214,185,123,0.15)',
                border: '1px solid rgba(214,185,123,0.3)',
                padding: '6px 12px'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D6B97B" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#D6B97B'
                }}
              >
                24–48 hrs
              </span>
            </div>

            {/* Service name */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                color: '#F3EFE6',
                lineHeight: 1.2,
                marginBottom: '12px'
              }}
            >
              Wash & Iron
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.85,
                lineHeight: 1.5,
                maxWidth: '300px'
              }}
            >
              Professional wash + steam iron. Fresh, crisp, wardrobe-ready.
            </p>

            {/* Price */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(214,185,123,0.2)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#F3EFE6',
                  opacity: 0.6
                }}
              >
                Starting from
              </span>
              <div className="mt-1">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#D6B97B'
                  }}
                >
                  ₹79
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#F3EFE6',
                    opacity: 0.6,
                    marginLeft: '4px'
                  }}
                >
                  / item
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Item Selector Section */}
        <div className="px-5 mt-8">
          {/* Section heading */}
          <h3
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: '#0F2E2A'
            }}
          >
            Select items
          </h3>

          {/* Item list */}
          <div className="space-y-3">
            {items.map(item => {
              const quantity = quantities[item.id] || 0;
              
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl transition-all duration-200"
                  style={{
                    background: '#FFFFFF',
                    border: quantity > 0 ? '1.5px solid #D6B97B' : '1px solid #EAE4D8',
                    padding: '16px 20px',
                    boxShadow: quantity > 0 
                      ? '0px 4px 16px rgba(214,185,123,0.15)' 
                      : '0px 2px 8px rgba(15,46,42,0.04)'
                  }}
                >
                  {/* Item name */}
                  <div className="flex-1">
                    <h4
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        marginBottom: '2px'
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#D6B97B'
                      }}
                    >
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Quantity stepper */}
                  <div className="flex items-center gap-3">
                    {quantity === 0 ? (
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="transition-all active:scale-95"
                        style={{
                          background: '#0F2E2A',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#D6B97B',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="transition-all active:scale-90"
                          style={{
                            background: '#0F2E2A',
                            border: 'none',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D6B97B" strokeWidth="2.5">
                            <path d="M5 12h14" />
                          </svg>
                        </button>

                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#0F2E2A',
                            minWidth: '24px',
                            textAlign: 'center'
                          }}
                        >
                          {quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="transition-all active:scale-90"
                          style={{
                            background: '#0F2E2A',
                            border: 'none',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D6B97B" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating bottom bar */}
      {hasItems && (
        <div
          className="absolute bottom-[72px] left-0 right-0 flex items-center justify-between px-5 transition-all duration-300"
          style={{
            background: '#0F2E2A',
            height: '88px',
            paddingBottom: '16px',
            boxShadow: '0px -4px 24px rgba(15,46,42,0.15)'
          }}
        >
          {/* Items count */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.7,
                marginBottom: '2px'
              }}
            >
              {totalItems} {totalItems === 1 ? 'item' : 'items'} added
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#F3EFE6'
              }}
            >
              Ready to add
            </p>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="rounded-full transition-all active:scale-95"
            style={{
              background: '#D6B97B',
              border: 'none',
              padding: '14px 28px',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              fontWeight: 600,
              color: '#0F2E2A',
              cursor: 'pointer',
              boxShadow: '0px 4px 16px rgba(214,185,123,0.3)'
            }}
          >
            Add to Cart
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0">
        <BottomNavBar 
          activeTab="services" 
          onTabChange={(tab) => console.log('Navigate to:', tab)} 
        />
      </div>
    </div>
  );
}