import { http } from '../config/http'

export const DashboardApi = {
    list: (data) => http.get(`dashboard`, {params:data}),
}
