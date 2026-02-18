import type { DateIndicator } from '@/types';

const PublicHolidayIndicator: DateIndicator = {
  id: "public-holiday",
  color: "bg-red-500",
  label: "Public Holiday",
};

const DefaultHolidayIndicator: DateIndicator = {
  id: "pto",
  color: "bg-gray-500",
  label: "PTO Indicator",
};

export {
  PublicHolidayIndicator,
  DefaultHolidayIndicator,
};