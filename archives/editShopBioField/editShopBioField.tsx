import React from "react";
// @ts-ignore
import Styles from "./editShopBioField.module.sass";
import { Stack, ThemeProvider } from "@mui/material";
import { Theme } from '@mui/material/styles/createTheme';
import TextField from "@mui/material/TextField";

type Props = {
	type: React.HTMLInputTypeAttribute;
	id: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
	minRows: number; // 4
	multiline: boolean; // true
	theme: Theme;
	cssClass?: string;
	helperText?: string;
	error?: boolean;
	placeholder?: string;
	label?: string;
	fullWidth?: boolean;
	size?: "small" | "medium";
};

const EditShopBioField: React.FC<Props> = (props: Props) => {
	return (
		<ThemeProvider theme={props.theme}>
			<TextField
				multiline={props.multiline}
				minRows={props.minRows}
				type={props.type}
				id={props.id}
				value={props.value}
				onChange={props.onChange}
				onBlur={props.onBlur}
				helperText={props.helperText}
				error={props.error}
				placeholder={props.placeholder}
				label={props.label}
				fullWidth={props.fullWidth}
				className={props.cssClass}
				size={props.size}
				color="primary"
			/>
			<Stack direction="row" justifyContent="flex-end">
				<span className={Styles.span}>{props.value.length}/300</span>
			</Stack>
		</ThemeProvider>
	);
};

export default EditShopBioField;
