import { ScholarshipDurationResponse } from '@/pages/mileage/types/scholarship';

export const getIsScholarshipDuration = (
  today: string,
  scholarshipDuration: ScholarshipDurationResponse,
) => {
  const { regStart, regEnd } = scholarshipDuration;

  return (
    new Date(regStart) <= new Date(today) && new Date(today) <= new Date(regEnd)
  );
};
