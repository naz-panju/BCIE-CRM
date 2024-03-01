import { http } from '../config/http'

export const LeadApi = {
    add: (data) => http.post(`leads/store`, data),
    list: (data) => http.get(`leads`, {params:data}),
}
