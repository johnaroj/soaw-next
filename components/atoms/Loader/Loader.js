import { Backdrop, Box, LinearProgress } from "@mui/material"
import Image from "next/image"

const Loading = ({ loading }) => {
    return (

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}>

            <Image src="/images/logos/loader.gif" height={400} width={400} objectFit="contain" />
        </Backdrop>


    )
}

export default Loading
