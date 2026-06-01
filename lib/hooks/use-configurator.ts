"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ViewType, UUID } from "@/lib/types";

interface ConfiguratorStore {
  vehicleId: UUID | null;
  colorId: UUID | null;
  wheelId: UUID | null;
  interiorId: UUID | null;
  activeView: ViewType;
  totalPrice: number;
  basePrice: number;
  colorModifier: number;
  wheelModifier: number;
  interiorModifier: number;
  compareVehicleIds: [UUID | null, UUID | null];

  setVehicle: (id: UUID, price: number) => void;
  setColor: (id: UUID | null, priceModifier: number) => void;
  setWheel: (id: UUID | null, priceModifier: number) => void;
  setInterior: (id: UUID | null, priceModifier: number) => void;
  setActiveView: (view: ViewType) => void;
  resetConfiguration: () => void;
  setCompareVehicle: (slot: 0 | 1, id: UUID | null) => void;
}

const DEFAULT_VIEW: ViewType = "side";

function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

export const useConfiguratorStore = create<ConfiguratorStore>()(
  devtools(
    (set) => ({
      vehicleId: null,
      colorId: null,
      wheelId: null,
      interiorId: null,
      activeView: DEFAULT_VIEW,
      totalPrice: 0,
      basePrice: 0,
      colorModifier: 0,
      wheelModifier: 0,
      interiorModifier: 0,
      compareVehicleIds: [null, null],

      setVehicle: (id, price) =>
        set({
          vehicleId: id,
          basePrice: price,
          totalPrice: price,
          colorId: null,
          wheelId: null,
          interiorId: null,
          colorModifier: 0,
          wheelModifier: 0,
          interiorModifier: 0,
          activeView: DEFAULT_VIEW,
        }),

      setColor: (id, priceModifier) =>
        set((state) => ({
          colorId: id,
          colorModifier: priceModifier,
          totalPrice: sum(state.basePrice, priceModifier, state.wheelModifier, state.interiorModifier),
        })),

      setWheel: (id, priceModifier) =>
        set((state) => ({
          wheelId: id,
          wheelModifier: priceModifier,
          totalPrice: sum(state.basePrice, state.colorModifier, priceModifier, state.interiorModifier),
        })),

      setInterior: (id, priceModifier) =>
        set((state) => ({
          interiorId: id,
          interiorModifier: priceModifier,
          totalPrice: sum(state.basePrice, state.colorModifier, state.wheelModifier, priceModifier),
        })),

      setActiveView: (view) => set({ activeView: view }),

      resetConfiguration: () =>
        set((state) => ({
          colorId: null,
          wheelId: null,
          interiorId: null,
          colorModifier: 0,
          wheelModifier: 0,
          interiorModifier: 0,
          totalPrice: state.basePrice,
          activeView: DEFAULT_VIEW,
        })),

      setCompareVehicle: (slot, id) =>
        set((state) => {
          const next: [UUID | null, UUID | null] = [...state.compareVehicleIds] as [UUID | null, UUID | null];
          next[slot] = id;
          return { compareVehicleIds: next };
        }),
    }),
    { name: "LuzionConfigurator" }
  )
);
