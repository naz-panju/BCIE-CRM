import { http } from "../config/http";


export const DeleteApI = {

    deleteGet: (data) => http.get(data),
    deletePost: (data) => http.post(`${data?.url}`,data?.body),

}
