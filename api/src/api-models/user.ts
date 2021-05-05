export interface InputUser {
  publicId: string;
  email: string;
  syndications?: string[];
  enabled?: boolean;
  comicDeliveryHoursInNewYork?: number;
  comicDeliveryMinutesInNewYork?: number;
}
