import { http } from '../config/http'

export const TaskApi = {
    add: (data) => http.post(`tasks/store`, data),
    list: (data) => http.get(`tasks`, {params:data}),
    view: (data) => http.get(`tasks/view/${data?.id}`, {params:data}),
    update: (data) => http.post(`tasks/update`, data),

    listNotes: (data) => http.get(`tasks/notes/${data?.id}`, {params:data}),
    addNote: (data) => http.post(`tasks/notes/store`, data),
    updateNote: (data) => http.post(`tasks/notes/update`, data),
    viewNote: (data) => http.get(`tasks/notes/view/${data?.id}`, {params:data}),
}

