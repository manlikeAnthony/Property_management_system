import { PropertyType } from "../../models/property.model"

export interface AddressDTO {
    street : string,
    city : string,
    state : string,
    country : string,
}

export interface CreatePropertyDTO {
    title: string,
    description : string,
    price : number,
    type : PropertyType,
    address : AddressDTO,
    bedrooms ?: number,
    bathrooms ?: number,
    area ?: number,
}

export interface CreatePropertyWithImagesDTO extends CreatePropertyDTO {
    images : {
        url : string,
        key : string
    }[]
}