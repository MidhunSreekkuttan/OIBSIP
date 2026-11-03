import React from 'react';
import { CheckCircle2, Clock, Flame, Bike, PartyPopper } from 'lucide-react';

export default function OrderTimeline({ currentStatus, statusHistory = [] }) {
  const steps = [
    {
      id: 'Order Received',
      label: 'Order Received',
      sublabel: 'Payment confirmed & sent to kitchen queue',
      icon: Clock,
      color: 'amber',
    },
    {
      id: 'In Kitchen',
      label: 'In Kitchen',
      sublabel: 'Chefs are topping and firing your pizza in the wood oven',
      icon: Flame,
      color: 'orange',
    },
    {
      id: 'Sent to Delivery',
      label: 'Sent to Delivery',
      sublabel: 'Rider is on the way with your hot pizza',
      icon: Bike,
      color: 'blue',
    },
    {
      id: 'Delivered',
      label: 'Delivered',
      sublabel: 'Delivered fresh and hot. Buon appetito!',
      icon: PartyPopper,
      color: 'emerald',
    },
  ];

  // Helper to get step index
  const getStatusIndex = (status) => {
    switch (status) {
      case 'Order Received':
        return 0;
      case 'In Kitchen':
        return 1;
      case 'Sent to Delivery':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStatusIndex(currentStatus);

  if (currentStatus === 'Cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800">
        <h3 className="font-bold text-lg">Order Cancelled</h3>
        <p className="text-sm mt-1 text-rose-600">This order has been cancelled and refunded.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Live Order Status
          </span>
          <h3 className="text-2xl font-bold font-serif text-stone-900 mt-1">
            {currentStatus}
          </h3>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live WebSocket Tracking</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="hidden sm:block absolute top-7 left-12 right-12 h-1 bg-stone-200 -z-0">
          <div
            className="h-full bg-orange-600 transition-all duration-700"
            style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;
            const StepIcon = step.icon;

            // Find history entry for this step
            const historyItem = statusHistory.find((h) => h.status === step.id);

            return (
              <div
                key={step.id}
                className={`flex sm:flex-col items-start sm:items-center text-left sm:text-center p-3 rounded-xl transition-all ${
                  isCurrent ? 'bg-orange-50/70 border border-orange-200' : ''
                }`}
              >
                {/* Step Icon Badge */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-orange-600 text-white ring-4 ring-orange-200 scale-110 animate-pulse'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <StepIcon className="w-7 h-7" />
                  )}
                </div>

                {/* Step Info */}
                <div className="ml-4 sm:ml-0 sm:mt-4">
                  <h4
                    className={`font-bold text-sm ${
                      isCurrent
                        ? 'text-orange-600 text-base'
                        : isCompleted
                        ? 'text-stone-900'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                    {step.sublabel}
                  </p>
                  {historyItem && (
                    <span className="inline-block mt-1 text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                      {new Date(historyItem.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

