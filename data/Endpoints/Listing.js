import { http } from '../config/http'

export const ListingApi = {
    country: (data) => http.get(`listing/countries`,{ params: data }),
    stages: (data) => http.get(`listing/stages`, { params: data }),
    substages: (data) => http.get(`listing/substages`, { params: data }),
    universities: (data) => http.get(`listing/universities`, { params: data }),
    courses:(data) => http.get(`listing/courses`, { params: data }),
    users:(data) => http.get(`listing/users`, { params: data }),
    documentTemplate:(data) => http.get(`listing/document-templates`, { params: data }),
    reference:(data) => http.get(`listing/referrals`, { params: data }),
    globalCountry:(data) => http.get(`listing/global-countries`,{ params: data }),
    intakes: (data) => http.get(`listing/intakes`,{ params: data }),
    courseLevel: (data) => http.get(`listing/course-levels`,{ params: data }),
    agencies: (data) => http.get(`listing/agencies`,{ params: data }),
    leadSource: (data) => http.get(`listing/lead-sources`,{ params: data }),
    nameTitle: (data) => http.get(`listing/titles`,{ params: data }),
}


