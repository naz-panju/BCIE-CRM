import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'

function TemplateData({ handleToggleTable }) {

    const Datas = [
        { title: 'lead name', key: 1 },
        { title: 'Email', key: 2 },
    ]

    return (

        <div>
            <Grid className='modal_title d-flex align-items-center  '>

                <a className='back_modal' onClick={handleToggleTable}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                        <path d="M9.0415 15.5H21.9582M21.9582 15.5L16.7918 20.6666M21.9582 15.5L16.7918 10.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </a>
                <a className='back_modal_head'> Template Data Table </a>
            </Grid>
            <div className=''>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>


                                    <Typography  variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">

                                        Title
                                    </Typography>

                                </TableCell>
                                <TableCell>
                                {/* className='app-tab-title' */}
                                    <Typography  variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                        Key Word
                                    </Typography>
                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                Datas?.map((obj, index) => (

                                    <TableRow sx={{p:'5px'}} key={index}>
                                        <TableCell>{obj?.title}</TableCell>
                                        <TableCell>{obj?.key}</TableCell>
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
