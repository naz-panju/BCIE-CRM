import { http } from '../config/http'

export const StudentApi = {
    add: (data) => http.post(`students/create`, data),
    list: (data) => http.get(`students`, {params:data}),
    // view: (data) => http.get(`leads/view/${data?.id}`, {params:data}),
    // update: (data) => http.post(`leads/update`, data),

}
