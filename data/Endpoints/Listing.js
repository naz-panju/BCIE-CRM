import { http } from '../config/http'

export const ListingApi = {
    country: (data) => http.get(`listing/countries`,{ params: data }),
    stages: (data) => http.get(`listing/stages`, { params: data }),
    substages: (data) => http.get(`listing/substages`, { params: data }),
    universities: (data) => http.get(`listing/universities`, { params: data }),
    courses:(data) => http.get(`listing/courses`, { params: data }),
    users:(data) => http.get(`listing/users`, { params: data }),
}
