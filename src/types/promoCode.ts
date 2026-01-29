export interface PromoCodeForm {
  // Шаг 1
  name: string;
  title: string;
  description: string;
  points: number | null;

  // Шаг 2
  startDate: Date | null;
  endDate: Date | null;
  hasNoEndDate: boolean;
  activationLimit: number | null;
  receiveMethod: 'auto' | 'manual' | null;
}

export interface PromoCode {
  id: string;
  name: string;
  title: string;
  description?: string;
  points: number;
  startDate: string;
  endDate?: string | null;
  hasNoEndDate: boolean;
  activationLimit?: number | null;
  receiveMethod?: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  usedCount: number;
  remainingUses: number;
}

export type PromoCodeStep = 1 | 2;

export interface PromoCodeValidationErrors {
  [key: string]: string;
}
