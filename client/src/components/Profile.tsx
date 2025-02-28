import { Button, Card } from '@mui/material'
import { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {DragEndEvent} from '@dnd-kit/core'

const Profile = () => {


    return (
        <div>
            <Card>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >Upload profile picture
                </Button>
            </Card>
        </div>
    )
}

export default Profile
