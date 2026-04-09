import { PropertyType } from "../../models/property.model"

export interface addressDTO {
    street : string,
    city : string,
    state : string,
    country : string,
}

export interface createPropertyDTO {
    title: string,
    description : string,
    price : number,
    type : PropertyType,
    address : addressDTO,
    bedrooms ?: number,
    bathrooms ?: number,
    area ?: number,
}

export interface createPropertyWithImages extends createPropertyDTO {
    images : {
        url : string,
        key : string
    }[]
}