import React, { useState, useEffect } from 'react';
import Styles from './customSwipeModal.module.sass';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { Box, ThemeProvider } from "@mui/material";
import { TransitionProps } from '@mui/material/transitions';
import { useAppSelector } from '../../../../utils/hooks';
import { getShopObj } from '../../../../store/selectors';
import { customModalTheme } from "../../../../utils/themes";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles/createTheme";
import Image from "next/image";
import CloseSVG from "../../../../public/assets/svgs/navigationIcons/close.svg";

type Props = {
	open: boolean;
	handleClose: () => void;
	fullScreen?: boolean;
	direction?: 'left' | 'right' | 'up' | 'down';
	keepMounted?: boolean;
	cssClasse?: string;
	// sx?: SxProps<Theme>;
	showCloseIcon?: boolean;
	children?: React.ReactNode;
};

const CustomSwipeModal: React.FC<Props> = (props: Props) => {
	const [mountDialog, setMountDialog] = useState<boolean>(false);
	const shopObj = useAppSelector(getShopObj);
	const {direction, fullScreen,
		cssClasse, keepMounted, open, handleClose, showCloseIcon, children} = props;

	useEffect(() => {
		if (typeof keepMounted === 'boolean') {
			setMountDialog(keepMounted);
		}
		if (shopObj) {
			setMountDialog(true);
		}
	}, [shopObj, keepMounted]);

	const Transition = React.forwardRef(function Transition(
		props: TransitionProps & {
			// eslint-disable-next-line
			children: React.ReactElement<any, any>;
		},
		ref: React.Ref<unknown>,
	) {
		return (
			<Slide direction={direction ? direction : 'left'} ref={ref} {...props}>
				{props.children}
			</Slide>
		);
	});

	return (
		<ThemeProvider theme={customModalTheme()}>
			<Dialog
				keepMounted={mountDialog}
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
				fullScreen={typeof fullScreen !== 'undefined' ? fullScreen : true}
				className={`${Styles.dialog} ${cssClasse}`}
				// sx={props.sx}
			>
				{showCloseIcon && <Box className={Styles.closeButtonWrapper}>
					<Image
						src={CloseSVG}
						width={40}
						height={40}
						alt=""
						onClick={handleClose}
						style={{ cursor: 'pointer' }}
					/>
				</Box>}
				{children}
			</Dialog>
		</ThemeProvider>
	);
};

export default CustomSwipeModal;
