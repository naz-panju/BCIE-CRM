import { http } from '../config/http'

export const WhatsAppTemplateApi = {
    add: (data) => http.post(`whatsapp-templates/store`, data),
    list: (data) => http.get(`whatsapp-templates`, {params:data}),
    view: (data) => http.get(`whatsapp-templates/view/${data?.id}`, {params:data}),
    update: (data) => http.post(`whatsapp-templates/update`, data),    
}