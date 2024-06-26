import React, { ForwardedRef, forwardRef, HTMLAttributeAnchorTarget } from "react";
import Styles from './iconAnchorButton.module.sass';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Link from 'next/link';
import {CustomTheme} from "../../../../utils/themes";
import { ThemeProvider } from "@mui/material";

type Props = {
	buttonText: string;
	svgIcon: string;
	nextPage?: string;
	onClick?: () => void;
	backgroundColor?: string | null;
	textColor?: string | null;
	border?: string;
	active?: boolean;
	cssClass?: string;
	target?: HTMLAttributeAnchorTarget;
	children?: React.ReactNode;
};

const IconAnchorButton = forwardRef<HTMLAnchorElement, Props>((props: Props, ref: ForwardedRef<HTMLAnchorElement>) => {
	// nextPage IconButton that opens a link
	let cssStyle = {};
	if (props.backgroundColor) {
		cssStyle = {...cssStyle, backgroundColor: props.backgroundColor};
	}
	if (props.textColor) {
		cssStyle = {...cssStyle, color: props.textColor};
	}
	if (props.border) {
		cssStyle = {...cssStyle, border: props.border};
	}
	let customTheme = CustomTheme();
	if (props.backgroundColor) {
		customTheme = CustomTheme(props.backgroundColor);
	}

	return props.nextPage ? (
		<ThemeProvider theme={customTheme}>
		<Link href={props.nextPage} ref={ref} target={props.target} rel="noreferrer">
			<Button
				color="primary"
				disabled={!props.active}
				className={`${Styles.iconButton} 
				${props.active ? Styles.active : ''}
				${props.cssClass && props.cssClass}
				`}
				style={{...cssStyle}}>
				<Image src={props.svgIcon} width={20} height={20} alt="" className={Styles.icon} />
				{props.buttonText}
			</Button>
		</Link>
		</ThemeProvider>
	) : (
		<Button
			onClick={props.onClick}
			color="primary"
			className={`${Styles.iconButton} ${props.active ? Styles.active : ''} 
			${props.cssClass && props.cssClass}`}
			disabled={!props.active}
			style={{...cssStyle}}>
			<Image src={props.svgIcon} width={20} height={20} alt="" className={Styles.icon} />
			{props.buttonText}
		</Button>
	);
});
IconAnchorButton.displayName = 'IconButton';

export default IconAnchorButton;
