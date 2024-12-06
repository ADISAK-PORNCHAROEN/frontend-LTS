import { DatePickerProps } from "@mui/x-date-pickers/DatePicker";

export interface FormDatePickerProps extends DatePickerProps<Date> {
    // Add any additional custom props if needed
    name: string;
    control: any;
    label: string;
    setValue?: any;
}