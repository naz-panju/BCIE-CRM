import { http } from '../config/http'

export const ApplicationApi = {
    add: (data) => http.post(`applications/store`, data),
    // list: (data) => http.get(`leads`, {params:data}),
    // view: (data) => http.get(`leads/view/${data?.id}`, {params:data}),
    // update: (data) => http.post(`leads/update`, data),

}
