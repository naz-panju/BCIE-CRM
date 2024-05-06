import { http } from '../config/http'

export const PhoneCallApi = {
    add: (data) => http.post(`phone-calls/store`, data),
    list: (data) => http.get(`phone-calls/${data?.lead_id}`, {params:data}),
    view: (data) => http.get(`phone-calls/view/${data?.id}`, {params:data}),
    update: (data) => http.post(`phone-calls/update`, data),
    delete: (data) => http.post(`phone-calls/delete`, data),
    summmary: (data) => http.get(`phone-calls/summary`, {params:data}),
}
