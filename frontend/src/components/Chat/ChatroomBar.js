import React from 'react'
import { AppBar, Toolbar } from '@mui/material';

export default function ChatroomBar(props) {
return (
    <AppBar>
        <Toolbar style={{
            fontWeight:"600",
            fontSize: "20px"
        }}>
            VibeChat
        </Toolbar>
    </AppBar>
)
}