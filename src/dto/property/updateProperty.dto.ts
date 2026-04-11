export interface UpdatePropertyDTO {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    type?: "RENT" | "SALE";
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    imagesToRemove?: string[]; 
}