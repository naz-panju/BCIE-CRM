import { LeadApi } from '@/data/Endpoints/Lead';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';
import XLSX from 'sheetjs-style';

function ExportExcel({ from, fileName, params }) {
    const [loading, setLoading] = useState(false)
    const [csvData, setcsvData] = useState([])

    const fetchList = () => {
        setLoading(true)
        let action;
        if (from == 'lead') {
            action = LeadApi.list(params)

        }
        action.then((response) => {
            // setcsvData(response?.data?.data)
            filterArray(response?.data?.data)
            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setLoading(false)
        })
    }

    const filterArray = (array) => {
        array?.map((obj) => (
            csvData.push({
                "Lead Id": obj?.lead_unique_id || 'NA',
                "Registered Name": obj?.name || 'NA',
                "Office": obj?.assignedToOffice?.name || 'NA',
                "Country of Residence": obj?.country_of_residence?.name || 'NA',
                "City of Student": obj?.city || 'NA',
                "Preferred Country": obj?.preferred_countries || 'NA',
                "Assigned To": obj?.assignedToCounsellor?.name || 'NA',
                "Stage": obj?.stage?.name || 'NA',
            })
        ))
    }

    useEffect(() => {
        fetchList()
    }, [])


    return (
        <div className='flex justify-end'>

            <Button variant='outlined' className='bg-sky-500 mb-3 hover:bg-sky-700 '>
                <CSVLink
                    style={{ textDecoration: 'none' }} data={csvData} filename={fileName}> Export</CSVLink>
            </Button>
        </div>
    )
}

export default ExportExcel
