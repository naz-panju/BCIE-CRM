import { http } from '../config/http'

export const GoalsApi = {
    // add: (data) => http.post(`events/store`, data),
    list: (data) => http.get(`targets-and-goals`, {params:data}),
    // view: (data) => http.get(`events/view/${data?.id}`, {params:data}),
    // update: (data) => http.post(`events/update`, data),
}
