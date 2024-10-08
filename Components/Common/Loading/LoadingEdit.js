import { Grid, Skeleton, Typography } from '@mui/material'
import React from 'react'

function LoadingEdit({ item, leftMD, rightMD }) {
    return (
        <div>
            {
                item?.map((obj, index) => (
                    <Grid key={index} display={'flex'}  container p={1.5} item xs={12}>
                        {/* <Grid item xs={12} md={leftMD || 4}>
                            <Skeleton variant='rounded' width={'90%'} height={25} />
                        </Grid> */}
                        <Grid item xs={12} md={rightMD || 12}>
                            {
                                obj?.multi ?
                                    <Skeleton variant='rounded' width={'100%'} height={70} />
                                    :
                                    <Skeleton variant='rounded' width={'100%'} height={37} />
                            }
                        </Grid>
                    </Grid>
                ))
            }

        </div>
    )
}

export default LoadingEdit
