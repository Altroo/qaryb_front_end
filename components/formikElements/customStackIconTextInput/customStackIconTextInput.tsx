import React from "react";
import { Theme } from "@mui/material/styles/createTheme";
import { InputBaseComponentProps, Stack, TextField, ThemeProvider } from "@mui/material";
import Image from 'next/image';

type Props = {
	icon: string;
	id: string;
	type: React.HTMLInputTypeAttribute;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	theme: Theme;
	cssClass?: string;
	helperText?: string;
	error?: boolean;
	placeholder?: string;
	label?: string;
	fullWidth?: boolean;
	size?: "small" | "medium";
	inputProps?: InputBaseComponentProps;
};

const CustomStackIconTextInput: React.FC<Props> = (props: Props) => {

	return (
		<ThemeProvider theme={props.theme}>
			<Stack direction="row" spacing={1} alignItems="center">
				<Image
					src={props.icon}
					alt=""
					width="42"
					height="42"
					sizes="100vw"
					/>
				<TextField
					id={props.id}
					type={props.type}
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
					inputProps={props.inputProps}
					color="primary"
				/>
			</Stack>
		</ThemeProvider>
	);
};

export default CustomStackIconTextInput;
