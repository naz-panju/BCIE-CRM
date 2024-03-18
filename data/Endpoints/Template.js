

import { http } from '../config/http'

export const TemplateApi = {
    add: (data) => http.post(`email-templates/store`, data),
    list: (data) => http.get(`email-templates`, {params:data}),
    view: (data) => http.get(`email-templates/view/${data?.id}`, {params:data}),
    update: (data) => http.post(`email-templates/update`, data),

}
