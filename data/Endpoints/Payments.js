import { http } from '../config/http'

export const PaymentApi = {
    add: (data) => http.post(`payments/store`, data),
    list: (data) => http.get(`payments`, {params:data}),
    view: (data) => http.get(`payments/view/${data?.id}`),
    update: (data) => http.post(`payments/update`, data),

}
