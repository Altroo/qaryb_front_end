import React from 'react';
import Styles from './helperH1Header.module.sass';
import { Stack } from "@mui/material";

type Props = {
	header: string,
	HelpText?: string,
	headerClasses?: string;
	children?: React.ReactNode;
};

const HelperH1Header: React.FC<Props> = (props: Props) => {
	return (
		<div className={Styles.headerWrapper}>
			<Stack direction="column" className={Styles.helpTextWrapper}>
				<h1 className={`${Styles.header} ${props.headerClasses}`}>{props.header}</h1>
				{props.HelpText && <span>{props.HelpText}</span>}
			</Stack>
		</div>
	);
};

export default HelperH1Header;
