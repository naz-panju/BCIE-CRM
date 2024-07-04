import { http } from '../config/http'

export const PasswordApi = {
    forgot: (data) => http.post(`forgot-password`, data),
    reset: (data) => http.post(`forgot-password-save`, data),
}
