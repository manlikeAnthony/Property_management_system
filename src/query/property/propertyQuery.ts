import { Request } from "express";
import type { PropertyType } from "../../models/property.model";

export type PropertyQuery = {
    filters:{
        type ?: PropertyType,
        city ?: string,
        state ?: string,
        country ?: string,
        minPrice ?: number,
        maxPrice ?: number,
        search ?: string,
        // minBedrooms ?: number,
        // maxBedrooms ?: number,
        // minBathrooms ?: number,
        // maxBathrooms ?: number,
        // minArea ?: number,
        // maxArea ?: number,
    },
    pagination:{
        page : number,
        limit : number,
        skip : number,
    }
}

export const parsePropertyQuery = (req: Request): PropertyQuery => {
    const {
        type,
        city,
        state,
        country,
        minPrice,
        maxPrice,
        search,
        page = "1",
        limit = "10",
    } = req.query;

    return { 
        filters: {
            type: typeof type === "string" ? (type as PropertyType) : undefined,
            city: typeof city === "string" ? city.trim(): undefined,
            state: typeof state === "string" ? state.trim() as string : undefined,
            country: typeof country === "string" ? country.trim() as string : undefined,
            minPrice: typeof minPrice === "string" ? Number(minPrice) : undefined,
            maxPrice: typeof maxPrice === "string" ? Number(maxPrice) : undefined,
            search: typeof search === "string" ? search.trim() as string : undefined,
        },
        pagination: {
            page:Math.max(1, Number(page)),
            limit: Math.max(1, Number(limit)),
            skip: (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit)),
        }
    }
}
