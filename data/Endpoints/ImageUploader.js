import { http } from '../config/http'

export const ImageUploadApi = {
    upload: (data) => http.post(`email-templates/file-uploads`, data),
    // list: (data) => http.get(`email-templates`, {params:data}),
    // view: (data) => http.get(`email-templates/view/${data?.id}`, {params:data}),
    // update: (data) => http.post(`email-templates/update`, data),

}
