import { http } from '../config/http'

export const FollowupApi = {
    add: (data) => http.post(`follow-ups/store`, data),
    list: (data) => http.get(`follow-ups/${data?.id}`, { params: data }),
    complete: (data) => http.post(`follow-ups/completed`, data),
}
