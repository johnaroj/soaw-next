import React from "react";
import { Select, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";


const StatusSelect = ({ name, label, control, required, error }) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                return <Select
                    {...field}
                    fullWidth
                    label={label}
                    variant="outlined"
                    required={required}
                    error={error}
                >
                    <MenuItem value={""}></MenuItem>
                    {statusList?.map((status) => (<MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>))}
                </Select>
            }}

        />
    );
}


const statusList = [
    { value: "ongehuwd", label: 'No ta kasá òf tin un konbibensia legalisá di pareha' },
    { value: "gehuwd", label: "Kasá" },
    { value: "geregistreerd partnerschap", label: "Konbibensia legalisá di pareha" },
    { value: "gescheiden", label: "Divorsiá" },
    { value: "gescheiden partnerschap", label: "Divorsiá for di konbibensia legalisá di pareha" },
    { value: "weduwe", label: "Viuda/o" }
]

export default StatusSelect;