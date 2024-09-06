import { http } from '../config/http'

export const EventsApi = {
    add: (data) => http.post(`events/store`, data),
    list: (data) => http.get(`events`, { params: data }),
    view: (data) => http.get(`events/view/${data?.id}`, { params: data }),
    update: (data) => http.post(`events/update`, data),
    changeStage: (id, data) => http.get(`events/change-stage/${id}`, { params: data }),
}
