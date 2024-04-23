import { http } from '../config/http'

export const FollowupApi = {
    notesAndFollowUp: (data) => http.get(`leads/notes-and-followups/${data?.id}`, { params: data }),
    add: (data) => http.post(`follow-ups/store`, data),
    update: (data) => http.post(`follow-ups/update`, data),
    list: (data) => http.get(`follow-ups/${data?.id}`, { params: data }),
    complete: (data) => http.post(`follow-ups/completed`, data),
    delete: (data) => http.post(`follow-ups/delete`, data),
}
