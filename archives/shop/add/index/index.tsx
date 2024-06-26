export {}
// import { NextPage } from 'next';
// import LeftSideBar from '../../../components/shop/add/leftSideBar/leftSideBar';
// import DesktopTopNavigationBar from '../../../components/desktop/navbars/desktopTopNavigationBar/desktopTopNavigationBar';
// import Styles from '../../../styles/shop/add/shopAddShared.module.sass';
// import MobileStepsBar from '../../../components/mobile/navbars/mobileStepsBar/mobileStepsBar';
// import HelperH1Header from '../../../components/headers/helperH1Header/helperH1Header';
// import TextInput from '../../../components/htmlElements/textInput/textInput';
// import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
// import React, { useEffect, useState } from 'react';
// import { setShopNameAction } from '../../../store/actions/shop/shopActions';
// import { cookiesPoster } from '../../../store/services/_init/_initAPI';
// import PrimaryAnchorButton from '../../../components/htmlElements/buttons/primaryAnchorButton/primaryAnchorButton';
// import MobileTopNavigationBar from '../../../components/mobile/navbars/mobileTopNavigationBar/mobileTopNavigationBar';
// import { getNewShopName } from "../../../store/selectors";
//
// const ShopName: NextPage = () => {
// 	const activeStep = '1';
// 	const dispatch = useAppDispatch();
// 	const shopName = useAppSelector(getNewShopName);
// 	// redux states
// 	// page states
// 	const [inputShopName, setInputShopName] = useState<string>('');
//
// 	useEffect(() => {
// 		if (shopName) {
// 			setInputShopName(shopName);
// 		}
// 	}, [shopName]);
//
// 	const shopNameInputChangeHandler = (value: string) => {
// 		setInputShopName(value);
// 		cookiesPoster('/cookies', { shop_name: 1 }).then();
// 	};
//
// 	const shopNameHandler = () => {
// 		dispatch(setShopNameAction(inputShopName));
// 	};
//
// 	return (
// 		<>
// 			<LeftSideBar step={activeStep} />
// 			<main className={Styles.main}>
// 				<div>
// 					<DesktopTopNavigationBar backHref="/shop/add" />
// 					<MobileTopNavigationBar backHref="/shop/add" />
// 					<MobileStepsBar activeStep={activeStep} />
// 					<HelperH1Header header="Nommez votre boutique" HelpText="Comment choisir son nom ?" />
// 					<TextInput
// 						value={inputShopName}
// 						placeholder="Ma boutique"
// 						onChange={(e: React.ChangeEvent<HTMLInputElement>) => shopNameInputChangeHandler(e.target.value)}
// 					/>
// 				</div>
// 				<div className={Styles.primaryButtonWrapper}>
// 					<PrimaryAnchorButton
// 						buttonText="Continuer"
// 						active={inputShopName !== ''}
// 						onClick={shopNameHandler}
// 						nextPage="/shop/add/avatar"
// 					/>
// 				</div>
// 			</main>
// 		</>
// 	);
// };
//
// export default ShopName;
