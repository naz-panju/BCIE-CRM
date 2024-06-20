import { http } from '../config/http'

export const TaskApi = {
    add: (data) => http.post(`tasks/store`, data),
    list: (data) => http.get(`tasks`, { params: data }),
    view: (data) => http.get(`tasks/view/${data?.id}`, { params: data }),
    update: (data) => http.post(`tasks/update`, data),

    archive: (data) => http.post(`tasks/archive`, data),
    reopen: (data) => http.post(`tasks/reopen`, data),

    listNotes: (data) => http.get(`tasks/notes/${data?.id}`, { params: data }),
    addNote: (data) => http.post(`tasks/notes/store`, data),
    updateNote: (data) => http.post(`tasks/notes/update`, data),
    viewNote: (data) => http.get(`tasks/notes/view/${data?.id}`, { params: data }),
    deleteNote: (data) => http.post(`tasks/notes/delete`, data),

    listChecklist: (data) => http.get(`tasks/checklists/${data?.id}`, { params: data }),
    addChecklist: (data) => http.post(`tasks/checklists/store`, data),
    viewChecklist: (data) => http.get(`tasks/checklists/view/${data?.id}`, { params: data }),
    updateChecklist: (data) => http.post(`tasks/checklists/update`, data),
    deleteChecklist: (data) => http.post(`tasks/checklists/delete`, data),
    completeChecklist: (data) => http.post(`tasks/checklists/completed`, data),

    statusChange: (data) => http.post(`tasks/change-status`, data),
    statusTimeline: (data) => http.get(`tasks/timeline/${data?.id}`, { params: data }),

}

