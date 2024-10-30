import { http } from '../config/http'

export const ListingApi = {
    leads: (data) => http.get(`listing/leads`,{ params: data }),
    country: (data) => http.get(`listing/countries`,{ params: data }),
    stages: (data) => http.get(`listing/stages`, { params: data }),
    substages: (data) => http.get(`listing/substages`, { params: data }),
    universities: (data) => http.get(`listing/universities`, { params: data }),
    universityCountries: (data) => http.get(`listing/university-countries`, { params: data }),
    // courses:(data) => http.get(`listing/courses`, { params: data }),
    users:(data) => http.get(`listing/users`, { params: data }),
    documentTemplate:(data) => http.get(`listing/document-templates`, { params: data }),
    reference:(data) => http.get(`listing/referrals`, { params: data }),
    globalCountry:(data) => http.get(`listing/global-countries`,{ params: data }),
    intakes: (data) => http.get(`listing/intakes`,{ params: data }),
    courseLevel: (data) => http.get(`listing/course-levels`,{ params: data }),
    agencies: (data) => http.get(`listing/agencies`,{ params: data }),
    leadSource: (data) => http.get(`listing/lead-sources`,{ params: data }),
    nameTitle: (data) => http.get(`listing/titles`,{ params: data }),
    subjectAreas:(data) => http.get(`listing/subject-areas`, { params: data }),
    office:(data) => http.get(`listing/offices`, { params: data }),
    events:(data) => http.get(`listing/events`, { params: data }),
    archiveReason:(data) => http.get(`listing/lead-archive-reasons`, { params: data }),
    emailTemplate:(data) => http.get(`listing/email-templates`, { params: data }),
    whatsappTemplate:(data) => http.get(`listing/whatsapp-templates`, { params: data }),
    applicationStages:(data) => http.get(`listing/next-stages/${data?.id}`, { params: data }),
    applications:(data) => http.get(`listing/applications/${data?.id}`, { params: data }),
    counsellors:(data) => http.get(`listing/counselors`, { params: data }),
    uniDocuments:(data) => http.get(`listing/university-documents-leads/${data?.lead_id}`, { params: data }),
    campaigns:(data) => http.get(`listing/lead-campaigns/${data?.source_id}`, { params: data }),

   
    unAssignCounsellor:(data)=>http.get(`listing/counselors/all`, { params: data }),
    unAssignOffice:(data)=>http.get(`listing/offices/all`, { params: data }),

    permissionUser:(data) => http.get(`listing/accessable-users`, { params: data }),
    
    maxFileSize:(data) => http.get(`max-file-upload-size`, { params: data }),

    students:(data) => http.get(`listing/students`, { params: data }),

}


