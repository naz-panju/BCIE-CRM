import { http } from '../config/http'

export const ApplicationStagesApi = {
    appliedInUniversity: (data) => http.post(`applications/status/applied-in-university`, data),
    universityRejected: (data) => http.post(`applications/status/university-rejected`, data),
    universityAccepted: (data) => http.post(`applications/status/university-accepted`, data),
    casApproved: (data) => http.post(`applications/status/cas-approved`, data),
    casRejected: (data) => http.post(`applications/status/cas-rejected`, data),
    visaApplied: (data) => http.post(`applications/status/visa-applied`, data),
    visaApproved: (data) => http.post(`applications/status/visa-approved`, data),
    visaRejected: (data) => http.post(`applications/status/visa-rejected`, data),
    universityFeePaid: (data) => http.post(`applications/status/university-fee-paid`, data),
    admissionCompleted: (data) => http.post(`applications/status/admission-completed`, data),
}
