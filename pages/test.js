
import { Box, Grid } from "@mui/material"
import Image from "next/image"

function test() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            backgroundColor="primary.main"
        >
            <Image src="/images/logos/loader.gif" height={250} width={250} objectFit="cover" />
        </Box>
    )
}

export default test
