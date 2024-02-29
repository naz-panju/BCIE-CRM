import { http } from '../config/http'

export const LeadApi = {
    add: (data) => http.post(`leads/store`, data),
}
