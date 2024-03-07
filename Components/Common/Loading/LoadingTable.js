import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Skeleton } from '@mui/material';

export default function LoadingTable({ columns, rows, columnWidth, columnHeight, rowWidth, rowHeight }) {

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <TableHead>
                                <TableRow>
                                    {[...Array(columns)].map((_, index) => (
                                        <TableCell key={index} align="left">
                                            <Skeleton variant='rounded' width={columnWidth} height={columnHeight} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    [...Array(rows)]?.map((_, index) => (
                                        <TableRow key={index} className='table-custom-tr'>
                                            {
                                                [...Array(columns)]?.map((_, colindex) => (
                                                    <TableCell key={colindex} align="left"><Skeleton variant='rounded' width={rowWidth} height={rowHeight} /></TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </>
    );
}