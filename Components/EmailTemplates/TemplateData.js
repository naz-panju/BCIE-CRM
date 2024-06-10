import { AddCircleOutline, ContentCopyOutlined, CopyAllOutlined } from '@mui/icons-material';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'

function TemplateData({ handleToggleTable, setValue, body }) {

    const Datas = [
        { title: 'Lead name', key: "{{1}}" },
        { title: 'Email', key: "{{2}}" },
        { title: 'Phone Number', key: "{{3}}" },
        { title: 'Alternate Phone Number', key: "{{4}}" },
        { title: 'Whatsapp Number', key: "{{5}}" },
        { title: 'Preferred Countries', key: "{{6}}" },
        { title: 'Course Level', key: "{{7}}" },
        { title: 'Preferred Courses', key: "{{8}}" },
        { title: 'Date of Birth', key: "{{9}}" },
        { title: 'Country of Birth', key: "{{10}}" },
        { title: 'Country of Residence', key: "{{11}}" },
        { title: 'Address', key: "{{12}}" },
        { title: 'Lead Course', key: "{{13}}" },
        { title: 'Reference From', key: "{{14}}" },
        { title: 'Lead Note', key: "{{15}}" },
        { title: 'Counsellor', key: "{{16}}" },
        { title: 'Branch', key: "{{17}}" },
        { title: 'Stage', key: "{{18}}" },
        { title: 'Student ID', key: "{{19}}" },
        { title: 'Applied Country', key: "{{30}}" },
        { title: 'Applied University', key: "{{31}}" },
        { title: 'Applied Course Level', key: "{{32}}" },
        { title: 'Applied Intake', key: "{{33}}" },
        { title: 'Applied Course', key: "{{34}}" },
        { title: 'Applied Subject Area', key: "{{35}}" },
        { title: 'Application Coordinator', key: "{{36}}" },
        { title: 'Application Stage', key: "{{37}}" },
        { title: 'Application Number', key: "{{38}}" },
        { title: 'Deposit Paid', key: "{{39}}" },
        { title: 'Deposit Paid On', key: "{{40}}" }
    ];

    const [searchKey, setSearchKey] = useState('');

    const filteredData = Datas.filter(item =>
        item.title.toLowerCase().includes(searchKey.toLowerCase()) ||
        item.key.toLowerCase().includes(searchKey.toLowerCase())
    );

    const [copied, setcopied] = useState()

    const addToTextBox = (text) => {
        setValue(text)
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setcopied(text)
            setTimeout(() => {
                setcopied()
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    return (

        <div>
            <Grid className='modal_title d-flex align-items-center  '>

                <a className='back_modal' onClick={handleToggleTable}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                        <path d="M9.0415 15.5H21.9582M21.9582 15.5L16.7918 20.6666M21.9582 15.5L16.7918 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                    </svg>

                </a>
                <a className='back_modal_head'> Template Data Table </a>
            </Grid>
            <div className='search-document-block' >
                <div className='search-document-block-input'>
                    <input onChange={(e) => setSearchKey(e.target.value)} placeholder='Search' />
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">  <path d="M12.5 12.5L17.5 17.5M8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" /></svg>
                </div>
            </div>

            <div className=''>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={'60%'}>

                                    <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">

                                        Title
                                    </Typography>

                                </TableCell>
                                <TableCell>
                                    {/* className='app-tab-title' */}
                                    <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                        Key
                                    </Typography>
                                </TableCell>
                                <TableCell width={'20%'}>

                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filteredData?.length == 0 &&
                                <TableRow>
                                    <TableCell sx={{ border: 'none' }} colSpan={3}>

                                        <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>No Data Found</Grid>
                                    </TableCell>
                                </TableRow>

                            }
                            {
                                filteredData?.map((obj, index) => (

                                    <TableRow sx={{ p: '5px' }} key={index}>
                                        <TableCell>{obj?.title}</TableCell>
                                        <TableCell>{obj?.key}</TableCell>
                                        <TableCell>
                                            <Tooltip title={'Add to the Textbox'}> <AddCircleOutline sx={{ cursor: 'pointer' ,mr:2}} color='primary' fontSize='small' onClick={()=>addToTextBox(obj?.key)} /></Tooltip>
                                            {
                                                copied == obj?.key ?
                                                    <a style={{ color: 'grey' }}>copied</a>
                                                    :
                                                    <ContentCopyOutlined sx={{ cursor: 'pointer', color: 'grey' }} onClick={() => copyToClipboard(obj?.key)} fontSize='small' />
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }


                        </TableBody>
                    </Table>

                </TableContainer>
            </div>
        </div>
    )
}

export default TemplateData
