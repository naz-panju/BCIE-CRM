import { http } from '../config/http'

export const ReferralApi = {
    add: (data) => http.post(`referral-links/store`, data),
    list: (data) => http.get(`referral-links`, {params:data}),
    view: (data) => http.get(`referral-links/view/${data?.id}`, {params:data}),
    update: (data) => http.post(`referral-links/update`, data),
    checkForm: (data) => http.get(`referral-links/form/${data?.id}`),
    changeStage: (id, data) => http.get(`referral-links/change-stage/${id}`, { params: data }),
}
