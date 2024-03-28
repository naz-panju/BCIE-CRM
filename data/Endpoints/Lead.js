import { http } from '../config/http'

export const LeadApi = {
    add: (data) => http.post(`leads/store`, data),
    list: (data) => http.get(`leads`, {params:data}),
    view: (data) => http.get(`leads/view/${data?.id}`, {params:data}),
    update: (data) => http.post(`leads/update`, data),

    timeline: (data) => http.get(`leads/timeline/${data?.id}`, {params:data}),

    addDocument: (data) => http.post(`documents/store`, data),   
    updateDocument: (data) => http.post(`documents/update`, data),   
    listDocuments: (data) => http.get(`documents`, {params:data}),
    viewDocuments: (data) => http.get(`documents/view/${data?.id}`, {params:data}),
    requestDocument: (data) => http.post(`documents/request`, data),   

    convertToStudent: (data) => http.post(`documents/request`, data),   

    addNote: (data) => http.post(`leads/notes/store`, data),
    listNote: (data) => http.get(`leads/notes/${data?.id}`, {params:data}),
    viewNote: (data) => http.get(`leads/notes/view/${data?.id}`, {params:data}),
    updateNote: (data) => http.post(`leads/notes/update`, data),
    deleteNote:(data) => http.post(`leads/notes/delete`, data),

    sendMail: (data) => http.post(`emails/store`, data),

    closeLead: (data) => http.post(`leads/close`, data),

    bulkAssign: (data) => http.post(`leads/bulk-assign`, data),


}
