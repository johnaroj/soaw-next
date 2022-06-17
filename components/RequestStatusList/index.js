import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router'
import { format } from 'date-fns';

const useStyles = makeStyles({
    root: {
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
    }
});

const RequestStatusList = ({ requests }) => {
    const classes = useStyles();
    const router = useRouter()
    return (
        <Grid item xs={12}>
            <DataGrid
                className={classes.root}
                autoHeight
                columns={[
                    {
                        headerName: 'Formulario', field: 'type', valueGetter: params => {
                            switch (params.row.type) {
                                case 1:
                                    return 'Onderstand'
                                case 2:
                                    return 'Pakete di kuminda'
                                case 3:
                                    return 'Karchi Sosial'
                                default:
                                    break;
                            }
                        }, minWidth: 100, flex: 1
                    },
                    { headerName: 'Fam', field: 'lastName', minWidth: 100, flex: 1 },
                    { headerName: 'Nomber', field: 'firstName', minWidth: 100, flex: 1 },
                    { headerName: 'Number di identifikashon', field: 'identificationNumber', minWidth: 100, flex: 1 },
                    { headerName: 'Fecha di petishon', field: 'created', valueGetter: (params) => (format(new Date(params.row.created), 'dd-MM-yyyy')), minWidth: 100, flex: 1 },
                    { headerName: 'Kambio di petishon', field: 'updated', valueGetter: (params) => (format(new Date(params.row.updated), 'dd-MM-yyyy')), minWidth: 100, flex: 1 },
                    { headerName: 'Status', field: 'status', minWidth: 100, flex: 1 },
                    {
                        field: 'action', sortable: false, minWidth: 100, flex: 1, renderCell: (params) => {
                            return (
                                <>
                                    <IconButton color="secondary" onClick={() => router.push(`/request/${params.row.id}`)}>
                                        <InfoIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => router.push(`/form/aid?id=${params.row.id}`)}>
                                        <EditIcon />
                                    </IconButton>
                                </>
                            );
                        },
                    }
                ]}
                hideFooterSelectedRowCount
                pagination
                paginationMode="server"
                rowCount={requests.count}
                page={requests.page}
                pageSize={10}
                rowsPerPageOptions={[10]}
                onPageChange={(page) => router.pathname.includes('admin') ? router.push(`/admin/request?page=${page}`) : router.push(`/request/page=${page}`)}
                rows={requests.items}
            // onRowClick={(params, event, details) => {
            //     router.pathname.includes('admin') ? router.push(`/admin/request/${params.id}`) : router.push(`/request/${params.id}`)
            // }}
            />
        </Grid>
    )
}

export default RequestStatusList
