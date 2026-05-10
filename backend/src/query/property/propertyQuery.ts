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
        minBedrooms ?: number,
        maxBedrooms ?: number,
        minBathrooms ?: number,
        maxBathrooms ?: number,
        minArea ?: number,
        maxArea ?: number,
    },
    pagination:{
        page : number,
        limit : number,
        skip : number,
    },
    sort :{
        field : string,
        order : 1 | -1
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
        minBedrooms,
        maxBedrooms,
        minBathrooms,
        maxBathrooms,
        minArea,
        maxArea,
        sort,
        page = "1",
        limit = "10",
    } = req.query;

    const allowedFields = ["price", "createdAt", "area", "bedrooms", "bathrooms"];

    let sortField = "createdAt";
    let sortOrder: 1 | -1 = -1;

    if(typeof sort === "string"){
        if(sort.startsWith("-")){
            const field = sort.slice(1);
            if(allowedFields.includes(field)){
                sortField = field;
                sortOrder = -1;
            }
        } else {
            if(allowedFields.includes(sort)){
                sortField = sort;
                sortOrder = 1;
            }
        }
        
    }

    return { 
        filters: {
            type: typeof type === "string" ? (type as PropertyType) : undefined,
            city: typeof city === "string" ? city.trim(): undefined,
            state: typeof state === "string" ? state.trim() as string : undefined,
            country: typeof country === "string" ? country.trim() as string : undefined,
            minPrice: typeof minPrice === "string" ? Number(minPrice) : undefined,
            maxPrice: typeof maxPrice === "string" ? Number(maxPrice) : undefined,
            minBedrooms : typeof minBedrooms === "string" ? Number(minBedrooms) : undefined,
            maxBedrooms : typeof maxBedrooms === "string" ? Number(maxBedrooms) : undefined,
            minBathrooms : typeof minBathrooms === "string" ? Number(minBathrooms) : undefined,
            maxBathrooms : typeof maxBathrooms === "string" ? Number(maxBathrooms) : undefined,
            minArea : typeof minArea === "string" ? Number(minArea) : undefined,
            maxArea : typeof maxArea === "string" ? Number(maxArea) : undefined,
            search: typeof search === "string" ? search.trim() as string : undefined,
        },
        pagination: {
            page:Math.max(1, Number(page)),
            limit: Math.max(1, Number(limit)),
            skip: (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit)),
        },
        sort: {
            field: sortField,
            order: sortOrder
        }
    }
}
