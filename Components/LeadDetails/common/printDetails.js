import React from 'react'

function PrintDetails({leadData}) {
  return (
    <div className='lead-tabpanel-content-item'>

    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div>
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Name </label>
                {leadData?.name}
            </div>
        </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leadData?.stage &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Lead Stage </label> {leadData?.stage?.name}
            </div>}

        <div>
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Email Address </label>
                {leadData?.email || 'NA'}
            </div>
        </div>

        <div>
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Mobile Number  </label>
                {leadData?.phone_number ? '+' : ''}{leadData?.phone_number || 'NA'}
            </div>
        </div>

        <div>
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Alternate Mobile Number </label>
                {leadData?.alternate_phone_number ? ` + ${leadData?.alternate_phone_number}` : ' NA'}
            </div>
        </div>

        <div>
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>WhatsApp Number </label>
                {leadData?.whatsapp_number ? ` +${leadData?.whatsapp_number}` : ' NA'}
            </div>
        </div>

        {leadData?.country_of_birth &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Country of Birth </label> {leadData?.country_of_birth?.name}
            </div>}

        {leadData?.country_of_residence &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Country of Residence </label> {leadData?.country_of_residence?.name}
            </div>}

        {leadData?.city &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>City </label> {leadData?.city}
            </div>}

        {leadData?.address &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Address </label> {leadData?.address}
            </div>}

        {leadData?.date_of_birth &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Date of Birth </label> {moment(leadData?.date_of_birth).format('DD-MM-YYYY')}
            </div>}

        <div>
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Preferred Courses </label> {leadData?.preferred_course || 'NA'}
            </div>
        </div>

        {leadData?.preferred_countries &&
            <div>
                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                    <label style={{ fontWeight: 'bold' }}>Preferred Countries </label> {leadData?.preferred_countries}
                </div>
            </div>}

        {leadData?.passport &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Passport Number </label> {leadData?.passport}
            </div>}

        {leadData?.passport_exp_date &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Passport Expiry Date </label>{moment(leadData?.passport_exp_date).format('DD-MM-YYYY')}
            </div>}

        {leadData?.lead_source &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Lead Source </label> {leadData?.lead_source?.name}
            </div>}

        {leadData?.lead_source?.id == 5 &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Referred Student </label> {leadData?.referredStudent?.name || 'NA'}
            </div>}

        {leadData?.lead_source?.id == 6 &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Referred Agency </label> {leadData?.agency?.name || 'NA'}
            </div>}

        {leadData?.lead_source?.id == 7 &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Referred University </label> {leadData?.referred_university?.name || 'NA'}
            </div>}

        {leadData?.lead_source?.id == 11 &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Event </label> {leadData?.event?.name || 'NA'}
            </div>}

        {leadData?.sponser_details &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Sponser Detail </label> {leadData?.sponser_details || 'NA'}
            </div>}

        {leadData?.referrance_from &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Here about us from </label> {leadData?.referrance_from}
            </div>}

        {leadData?.campaign &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Campaign </label> {leadData?.campaign?.name}
            </div>}

        <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
            <label style={{ fontWeight: 'bold' }}>Sign up for external parties </label>
            {leadData?.sign_up_for_external_parties ? 'yes' : 'no'}
        </div>

        {leadData?.note &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Note </label> {leadData?.note}
            </div>}

        {leadData?.substage &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Lead Sub Stage </label>: {leadData?.substage?.name}
            </div>}

        {leadData?.closed == 1 && leadData?.archive_reason &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Archive Reason </label> {leadData?.archive_reason}
            </div>}

        {leadData?.closed == 1 && leadData?.win_reason &&
            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                <label style={{ fontWeight: 'bold' }}>Win Reason </label> {leadData?.win_reason}
            </div>}
    </div>
</div>
  )
}

export default PrintDetails
