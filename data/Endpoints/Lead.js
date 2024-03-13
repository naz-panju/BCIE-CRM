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


}
