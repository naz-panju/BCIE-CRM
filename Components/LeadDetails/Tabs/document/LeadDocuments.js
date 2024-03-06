import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useState } from 'react'
import LeadDocumentModal from './create'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'

function LeadDocuments({ id }) {

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)

    const handleCreate = () => {
        setEditId(0)
    }

    const fetchList = async () => {
        setLoading(true)
        const response = await LeadApi.listDocuments({ lead_id: id })
        setList(response?.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
        <>
            <LeadDocumentModal id={id} editId={editId} setEditId={setEditId} />


            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Documents</h2>
                    <Grid display={'flex'} alignItems={'end'}>
                        <Button onClick={handleCreate} className='bg-sky-500' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Add</Button>
                    </Grid>
                </div>
                {
                    loading ?
                        <Skeleton variant="rectangular" width={'100%'} height={200} />
                        :
                        <div className='no-follw-up-block'>
                            {
                                list?.data?.length > 0 ?

                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        Template
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        Document
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                list?.data?.map((obj, index) => (
                                                    <TableRow key={obj?.id}>
                                                        <TableCell>{obj?.document_template?.name}</TableCell>
                                                        <TableCell><a href={obj?.file} target='_blank'>{obj?.file}</a></TableCell>
                                                    </TableRow>
                                                ))
                                            }

                                        </TableBody>
                                    </Table>

                                    :
                                    <h4>You have no Documents</h4>
                            }
                        </div>
                }

            </div>
        </>
    )
}

export default LeadDocuments
