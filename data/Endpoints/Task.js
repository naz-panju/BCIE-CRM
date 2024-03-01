import { http } from '../config/http'

export const TaskApi = {
    add: (data) => http.post(`tasks/store`, data),
    list: (data) => http.get(`tasks`, {params:data}),
}
