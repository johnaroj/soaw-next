import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Controller } from "react-hook-form";


const StatusSelect = ({ label, control, required, error }) => {
    return (
        <Controller
            render={props => (
                <Autocomplete
                    {...props}
                    options={statusList}
                    getOptionLabel={option => option.label}
                    getOptionSelected={(option, value) => {
                        return option.value === value.value
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={label}
                            variant="outlined"
                            required={required}
                            error={error}
                        />
                    )}
                    onChange={(_, data) => {
                        return props.onChange(data)
                    }}
                />
            )}
            name="maritalStatus"
            control={control}
        />
    );
}



const statusList = [
    { value: "single", label: 'Soltero' },
    { value: "marriedOrPartnership", label: "Kasá of bibá" },
    { value: "divorced", label: "Divorsiá" },
    { value: "widow", label: "Viuda/o" }
]

export default StatusSelect;