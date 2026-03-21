import React, { useState } from 'react';
import { BottomNavBar } from './BottomNavBar';
import { Card } from './Card';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  slotsLeft?: number;
}

interface PickupSchedulingScreenProps {
  onBack?: () => void;
  onConfirm?: (date: number, timeSlot: string) => void;
}

export function PickupSchedulingScreen({ onBack, onConfirm }: PickupSchedulingScreenProps) {
  const [selectedDate, setSelectedDate] = useState(20); // Today
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const dates = [
    { day: 'TODAY', date: 20, isToday: true },
    { day: 'TUE', date: 21, isToday: false },
    { day: 'WED', date: 22, isToday: false },
    { day: 'THU', date: 23, isToday: false },
    { day: 'FRI', date: 24, isToday: false },
    { day: 'SAT', date: 25, isToday: false },
    { day: 'SUN', date: 26, isToday: false }
  ];

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '7 AM – 9 AM', available: true, slotsLeft: 5 },
    { id: '2', time: '9 AM – 11 AM', available: true, slotsLeft: 3 },
    { id: '3', time: '11 AM – 1 PM', available: true },
    { id: '4', time: '2 PM – 4 PM', available: false },
    { id: '5', time: '4 PM – 6 PM', available: true, slotsLeft: 2 },
    { id: '6', time: '6 PM – 8 PM', available: true }
  ];

  const handleConfirm = () => {
    if (selectedTimeSlot) {
      onConfirm?.(selectedDate, selectedTimeSlot);
    }
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

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 600,
            color: '#0F2E2A'
          }}
        >
          Schedule Pickup
        </h1>
      </div>

      {/* Scrollable content */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: 'calc(844px - 100px - 114px - 72px)',
          paddingBottom: '24px'
        }}
      >
        {/* Pickup Address Card */}
        <div className="px-4 mt-4">
          <div
            className="flex items-center gap-3 rounded-2xl"
            style={{
              background: '#0F2E2A',
              padding: '16px 20px',
              height: '72px'
            }}
          >
            {/* Location icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
                stroke="#D6B97B" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
                stroke="#D6B97B" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>

            {/* Address text */}
            <div className="flex-1">
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#F3EFE6',
                  opacity: 0.6,
                  marginBottom: '2px'
                }}
              >
                Pickup from
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F3EFE6',
                  lineHeight: 1.3
                }}
              >
                02-007, Emaar Palm Square, Sector 66
              </p>
            </div>

            {/* Change link */}
            <button
              className="transition-opacity hover:opacity-70"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#D6B97B',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Change
            </button>
          </div>
        </div>

        {/* Date Selection Section */}
        <div className="mt-7" style={{ paddingLeft: '24px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#4A5568',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Pick a date
          </p>

          {/* Date pills - horizontal scroll */}
          <div 
            className="flex gap-2 mt-3 overflow-x-auto pb-2"
            style={{ 
              paddingLeft: '0px',
              paddingRight: '16px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {dates.map((dateItem) => {
              const isSelected = selectedDate === dateItem.date;
              
              return (
                <button
                  key={dateItem.date}
                  onClick={() => setSelectedDate(dateItem.date)}
                  className="flex flex-col items-center justify-center transition-all active:scale-95 relative"
                  style={{
                    width: '52px',
                    height: '70px',
                    borderRadius: '14px',
                    background: isSelected ? '#0F2E2A' : '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: isSelected 
                      ? '0px 4px 16px rgba(15,46,42,0.2)' 
                      : '0px 2px 8px rgba(15,46,42,0.04)'
                  }}
                >
                  {/* Today marker */}
                  {dateItem.isToday && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '6px',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#D6B97B'
                      }}
                    />
                  )}

                  {/* Day */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: isSelected ? '#F3EFE6' : '#4A5568',
                      marginBottom: '4px'
                    }}
                  >
                    {dateItem.day}
                  </p>

                  {/* Date */}
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: isSelected ? '#F3EFE6' : '#0F2E2A',
                      lineHeight: 1
                    }}
                  >
                    {dateItem.date}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Section */}
        <div className="mt-8 px-4">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#4A5568',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Choose a time slot
          </p>

          {/* 2-column grid */}
          <div 
            className="grid grid-cols-2 gap-[10px] mt-3"
          >
            {timeSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.id;
              const isAvailable = slot.available;
              
              return (
                <Card
                  key={slot.id}
                  isSelected={isSelected}
                  isDisabled={!isAvailable}
                  onClick={() => isAvailable && setSelectedTimeSlot(slot.id)}
                  className="!w-[173px] !h-[60px] !p-[14px]"
                >
                  <div className="flex items-center gap-2 h-full">
                    {/* Clock icon */}
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ flexShrink: 0 }}
                    >
                      <circle 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke={isSelected ? '#D6B97B' : '#0F2E2A'} 
                        strokeWidth="2"
                      />
                      <path 
                        d="M12 6V12L16 14" 
                        stroke={isSelected ? '#D6B97B' : '#0F2E2A'} 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Time and availability text */}
                    <div className="flex-1 text-left">
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0F2E2A',
                          lineHeight: 1.2,
                          marginBottom: '2px'
                        }}
                      >
                        {slot.time}
                      </p>
                      {isAvailable ? (
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '11px',
                            fontWeight: 400,
                            color: '#9CAB9A'
                          }}
                        >
                          {slot.slotsLeft ? `${slot.slotsLeft} slots left` : 'Available'}
                        </p>
                      ) : (
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '10px',
                            fontWeight: 400,
                            color: '#991B1B'
                          }}
                        >
                          Unavailable
                        </p>
                      )}
                    </div>

                    {/* Radio circle */}
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#D6B97B' : '#9CAB9A'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#D6B97B'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Estimated Delivery Callout */}
        <div className="mt-6 px-4">
          <div
            style={{
              background: 'rgba(214,185,123,0.10)',
              border: '1px solid rgba(214,185,123,0.30)',
              borderRadius: '12px',
              padding: '14px 16px'
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#0F2E2A',
                lineHeight: 1.4
              }}
            >
              ✦ Estimated return delivery: Wednesday, 22 March
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA - Sticky Footer */}
      <div
        className="absolute bottom-[72px] left-0 right-0"
        style={{
          background: '#FFFFFF',
          boxShadow: '0px -4px 16px rgba(15,46,42,0.06)',
          padding: '16px 24px',
          paddingBottom: '32px'
        }}
      >
        {/* CTA Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedTimeSlot}
          className="w-full rounded-full transition-all active:scale-98"
          style={{
            background: selectedTimeSlot ? '#D6B97B' : '#E8D4A8',
            border: 'none',
            padding: '14px 28px',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#0F2E2A',
            cursor: selectedTimeSlot ? 'pointer' : 'not-allowed',
            boxShadow: selectedTimeSlot 
              ? '0px 4px 16px rgba(214,185,123,0.3)' 
              : 'none',
            height: '52px'
          }}
        >
          Confirm Pickup Slot
        </button>

        {/* Cancellation note */}
        <p
          className="text-center mt-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 400,
            color: '#9CAB9A',
            lineHeight: 1.4
          }}
        >
          Free cancellation up to 1 hour before pickup
        </p>
      </div>

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