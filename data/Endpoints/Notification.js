import { http } from '../config/http'

export const NotificationApi = {
    list: (data) => http.get(`notifications`, {params:data}),
    read: (data) => http.get(`notifications/read`, {params:data}),
    count: (data) => http.get(`notifications/count`, {params:data}),
    delete: (data) => http.post(`notifications/delete`, data),
}
