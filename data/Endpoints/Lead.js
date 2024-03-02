import { http } from '../config/http'

export const LeadApi = {
    add: (data) => http.post(`leads/store`, data),
    list: (data) => http.get(`leads`, {params:data}),
    view: (data) => http.get(`leads/view/${data?.id}`, {params:data}),
}
