import { http } from '../config/http'

export const CommunicationLogApi = {
    // add: (data) => http.post(`events/store`, data),
    list: (data) => http.get(`communication-log`, {params:data}),
    view: (data) => http.get(`communication-log/view/${data?.id}`, {params:data}),
    // update: (data) => http.post(`events/update`, data),
}
