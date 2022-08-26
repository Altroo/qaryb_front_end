import { createTheme } from '@mui/material/styles';
import { hexToRGB } from './helpers';

export const CustomTheme = (primaryColor: string | undefined = undefined) => {
	let rippleColor = '#0D070B';
	if (primaryColor) {
		if (primaryColor !== '#FFFFFF') {
			rippleColor = hexToRGB(primaryColor, 0.5);
		} else {
			rippleColor = hexToRGB(rippleColor, 0.5);
		}
	}
	return createTheme({
		palette: {
			primary: {
				main: rippleColor,
			},
			/*secondary: {
				light: '#0066ff',
				main: '#0044ff',
				contrastText: '#ffcc00',
			},*/
		},
	});
};

export const getDefaultTheme = (primaryColor: string | undefined = undefined) => {
	const defaultColor = '#0274D7';
	if (primaryColor) {
		return CustomTheme(primaryColor);
	} else {
		return CustomTheme(defaultColor);
	}
};

// Shop name text input
export const shopNameTextInputTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);

	return createTheme({
		...defaultTheme,
		components: {
			MuiInputBase: {
				styleOverrides: {
					// input wrapper (div)
					root: {
						fontFamily: 'Poppins',
						fontSize: '19px',
						height: '55px',
						padding: '10px',
						'& fieldset': {
							padding: '10px 18px',
							height: '59px',
							fontFamily: 'Poppins',
							fontSize: '19px',
							borderRadius: '16px',
							border: '2px solid #A3A3AD',
						},
					},
				},
			},
			MuiFormControl: {
				styleOverrides: {
					root: {
						width: '100%',
						height: '100%',
					},
				},
			},
		},
	});
};
// Edit Shop name text input
export const editShopNameTextInputTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);
	const blueColor = '#0274d7';
	return createTheme({
		...defaultTheme,
		components: {
			MuiInputBase: {
				styleOverrides: {
					root: {
						height: '82px',
						padding: '10px',
						'& fieldset': {
							borderRadius: '16px',
							border: '2px solid #A3A3AD',
						},
					},
					input: {
						fontFamily: 'Poppins-SemiBold',
						fontSize: '28px',
						caretColor: blueColor,
					},
				},
			},
			MuiFormControl: {
				styleOverrides: {
					root: {
						'& .MuiFormLabel-root': {
							fontFamily: 'Poppins',
							fontSize: '14px',
							// top: '15%',
						},
						'& .MuiFormLabel-root.Mui-focused': {
							top: '0%',
						},
					},
				},
			},
		},
	});
};
// Offer title text input
export const offerTitleTextInputTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);

	return createTheme({
		...defaultTheme,
		components: {
			MuiInputBase: {
				styleOverrides: {
					// input wrapper (div)
					root: {
						fontFamily: 'Poppins',
						fontSize: '19px',
						height: '55px',
						padding: '10px',
						width: '100%',
						'& fieldset': {
							padding: '10px 18px',
							height: '59px',
							fontFamily: 'Poppins',
							fontSize: '19px',
							borderRadius: '16px',
							border: '2px solid #A3A3AD',
						},
					},
				},
			},
			MuiFormControl: {
				styleOverrides: {
					root: {
						width: 'auto',
						height: '100%',
					},
				},
			},
		},
	});
};
// Shop bio text area
export const bioTextAreaTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);
	const blueColor = '#0274d7';

	return createTheme({
		...defaultTheme,
		components: {
			MuiInputBase: {
				styleOverrides: {
					root: {
						padding: '10px',
						'& fieldset': {
							borderRadius: '16px',
							border: '2px solid #A3A3AD',
						},
					},
					input: {
						fontFamily: 'Poppins',
						fontSize: '17px',
						caretColor: blueColor,
					},
				},
			},
			MuiFormControl: {
				styleOverrides: {
					root: {
						'& .MuiFormLabel-root': {
							fontFamily: 'Poppins',
							fontSize: '14px',
						},
					},
				},
			},
		},
	});
};
// Shop coordonées text input
export const coordonneeTextInputTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);
	const blueColor = '#0274d7';

	return createTheme({
		...defaultTheme,
		components: {
			MuiInputBase: {
				styleOverrides: {
					root: {
						'& fieldset': {
							borderRadius: '16px',
							border: '2px solid #A3A3AD',
						},
					},
					input: {
						fontFamily: 'Poppins',
						fontSize: '19px',
						caretColor: blueColor,
					},
				},
			},
			MuiFormControl: {
				styleOverrides: {
					root: {
						'& .MuiFormLabel-root': {
							fontFamily: 'Poppins',
							fontSize: '16px',
						},
					},
				},
			},
		},
	});
};
// Offer title tooltip
export const offerTitleTooltipTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);
	const blueColor = '#0274d7';

	return createTheme({
		...defaultTheme,
		components: {
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						fontFamily: 'Poppins',
						fontSize: '13px',
						backgroundColor: blueColor,
					},
				},
			},
		},
	});
};
// Offer for whom dropdown
export const offerForWhomDropdownTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);
	const blueColor = '#0274d7';

	return createTheme({
		...defaultTheme,
		components: {
			MuiInputBase: {
				styleOverrides: {
					root: {
						'& fieldset': {
							borderRadius: '16px',
							border: '2px solid #A3A3AD',
							// borderTopLeftRadius: '21px',
							// borderTopRightRadius: '21px',
						},
					},
					input: {
						fontFamily: 'Poppins',
						fontSize: '19px',
						caretColor: blueColor,
					},
				},
			},
			MuiFormControl: {
				styleOverrides: {
					root: {
						'& .MuiFormLabel-root': {
							fontFamily: 'Poppins',
							fontSize: '16px',
						},
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					gutters: {
						fontFamily: 'Poppins',
						fontSize: '16px',
					}
				}
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						border: `1px solid ${blueColor}`,
						borderBottomLeftRadius: '21px',
						borderBottomRightRadius: '21px'
					}
				}
			}
		},
	});
};

// Offer switch button
export const offerSwitchTheme = (primaryColor: string | undefined = undefined) => {
	const defaultTheme = getDefaultTheme(primaryColor);
	return createTheme({
		...defaultTheme,
		components: {
			MuiFormControlLabel: {
				styleOverrides: {
					root: {
						marginRight: '0px',
					}
				}
			},
			MuiSwitch: {
				styleOverrides: {
					root: {
						marginRight: '0px !important',
						marginLeft: '0px !important',
					}
				}
			}
		}
	});
};