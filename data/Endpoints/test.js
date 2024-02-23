import { http } from '../config/http'

export const BranchesApi = {
    get: (data) => http.get(`/projects/tasks`, data),
}
