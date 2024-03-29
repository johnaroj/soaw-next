import { Backdrop, Box, LinearProgress } from "@mui/material"
import Image from "next/image"

const Loading = ({ loading }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}>

            <Image alt="Loading" src="/images/logos/loader.gif" placeholder="blur"
                blurDataURL="/images/logos/loader-placeholder.svg"
                height={400} width={400} style={{objectFit:"contain"}} />
        </Backdrop>



    )
}

export default Loading
