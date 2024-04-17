import { http } from '../config/http'

export const ApplicationApi = {
    add: (data) => http.post(`applications/store`, data),
    list: (data) => http.get(`applications`, {params:data}),
    view: (data) => http.get(`applications/view/${data?.id}`, {params:data}),
    update: (data) => http.post(`applications/update`, data),

    timeline: (data) => http.get(`applications/timeline/${data?.id}`, {params:data}),

    acceptanceLetter: (data) => http.post(`applications/upload-acceptance-letter`, data),
    feeReciept: (data) => http.post(`applications/upload-fee-receipt`, data),
    casDocument: (data) => http.post(`applications/upload-cas-document`, data),

}
