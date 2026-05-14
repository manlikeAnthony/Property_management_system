import { api } from "@/services/api/client";
import type {
  ApiResponse,
  PaginatedCollection,
  QueryOptions,
} from "@/types/api";
import type {
  Property,
  PropertyFilters,
  PropertyFormValues,
} from "@/types/property";

export const propertyApi = {
  listProperties: async (filters?: PropertyFilters & QueryOptions) => {
    const { data } = await api.get<
      ApiResponse<PaginatedCollection<Property> | Property[]>
    >("/property", {
      params: filters,
    });
    return data;
  },
  getProperty: async (id: string) => {
    const { data } = await api.get<ApiResponse<Property>>(`/property/${id}`);
    return data;
  },
  createProperty: async (values: PropertyFormValues) => {
    const formData = new FormData();

    formData.append("title", values.title);
    if (values.description?.trim()) {
      formData.append("description", values.description.trim());
    }
    formData.append("price", String(values.price));
    formData.append("type", values.type);
    if (values.bedrooms !== undefined) {
      formData.append("bedrooms", String(values.bedrooms));
    }
    if (values.bathrooms !== undefined) {
      formData.append("bathrooms", String(values.bathrooms));
    }
    if (values.area !== undefined) {
      formData.append("area", String(values.area));
    }
    // Backend Joi schema expects a nested address object in multipart payload.
    formData.append("address[street]", values.street);
    formData.append("address[city]", values.city);
    formData.append("address[state]", values.state);
    formData.append("address[country]", values.country);

    values.images.forEach((file) => formData.append("images", file));

    const { data } = await api.post<ApiResponse<Property>>(
      "/property",
      formData,
    );

    return data;
  },
  updateProperty: async (
    id: string,
    values: Partial<PropertyFormValues> & {
      imagesToRemove?: string[];
      images?: File[];
    },
  ) => {
    const formData = new FormData();

    if (values.title !== undefined) formData.append("title", values.title);
    if (values.description !== undefined) {
      formData.append("description", values.description);
    }
    if (values.price !== undefined)
      formData.append("price", String(values.price));
    if (values.type !== undefined) formData.append("type", values.type);
    if (values.bedrooms !== undefined) {
      formData.append("bedrooms", String(values.bedrooms));
    }
    if (values.bathrooms !== undefined) {
      formData.append("bathrooms", String(values.bathrooms));
    }
    if (values.area !== undefined) formData.append("area", String(values.area));

    if (values.street !== undefined)
      formData.append("address[street]", values.street);
    if (values.city !== undefined)
      formData.append("address[city]", values.city);
    if (values.state !== undefined)
      formData.append("address[state]", values.state);
    if (values.country !== undefined) {
      formData.append("address[country]", values.country);
    }

    values.images?.forEach((file) => formData.append("images", file));
    if (values.imagesToRemove) {
      formData.append("imagesToRemove", JSON.stringify(values.imagesToRemove));
    }

    const { data } = await api.put<ApiResponse<Property>>(
      `/property/${id}`,
      formData,
    );
    return data;
  },
  deleteProperty: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/property/${id}`);
    return data;
  },
};
