import { http } from '../config/http'

export const EventRegistrationApi = {
    add: (data) => http.post(`events/registrations/store`, data),
    list: (data) => http.get(`events/registrations`, {params:data}),
    view: (data) => http.get(`events/registrations/view/${data?.id}`, {params:data}),
    // update: (data) => http.post(`events/registrations/update`, data),
}
