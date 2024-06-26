import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import Image from 'next/image';
import Styles from '../../../../../styles/offers/create/overview.module.sass';
import { Stack, ThemeProvider, ImageListItem, Box, Grid, Skeleton, createTheme } from '@mui/material';
import { useRouter } from 'next/router';
import {
	OfferGetRootProductInterface,
	OfferGetRootProductResponseType,
	OfferGetRootServiceInterface,
	OfferGetRootServiceResponseType,
	OfferProductPriceByType,
	OfferSolderByType,
	OfferSolderInterface,
} from '../../../../../types/offer/offerTypes';
import CreatorIlluSVG from '../../../../../public/assets/images/creator-illu.svg';
import CreatorBgIlluSVG from '../../../../../public/assets/images/creator-bg-illu.svg';
import CreatorIconSVG from '../../../../../public/assets/svgs/globalIcons/creator.svg';
import DeliverySVG from '../../../../../public/assets/svgs/globalIcons/delivery-icon-white.svg';
import DeliveryDisabledSVG from '../../../../../public/assets/svgs/globalIcons/delivery-icon-gray.svg';
import ClickAndCollectSVG from '../../../../../public/assets/svgs/globalIcons/click-and-collect-icon-white.svg';
import ClickAndCollectDisabledSVG from '../../../../../public/assets/svgs/globalIcons/click-and-collect-icon-gray.svg';
import Chip from '@mui/material/Chip';
import {
	getCategoriesDataArray,
	getColorsDataArray,
	getDateFromDayCountNumber,
	getForWhomDataArray,
	getProductPriceByData,
	getServiceAvailabilityDaysArray,
	getServicePriceByData,
	getSizesDataArray,
} from '../../../../../utils/rawData';
import Link from 'next/link';
import {
	REAL_SHOP_BY_SHOP_LINK_ROUTE,
	NOT_FOUND_404,
	REAL_OFFER_ADD_PRODUCT_CATEGORIES,
	REAL_OFFER_ADD_SERVICE_CATEGORIES,
} from '../../../../../utils/routes';
import PrimaryButton from '../../../../../components/htmlElements/buttons/primaryButton/primaryButton';
import Divider from '@mui/material/Divider';
import {
	customCartModalTheme,
	customImageModalTheme,
	customMobileImageModalTheme,
	CustomTheme,
	doubleTabNavigationTheme,
	getDefaultTheme,
	OfferReadOnlyTheme,
	SolderPourcentageChipTheme,
} from '../../../../../utils/themes';
import { Lazy, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/lazy';
import {
	defaultInstance,
	Desktop,
	getServerSideCookieTokens,
	isAuthenticatedInstance,
	TabletAndMobile,
} from '../../../../../utils/helpers';
import { getApi } from '../../../../../store/services/_init/_initAPI';
import UserMainNavigationBar from '../../../../../components/layouts/userMainNavigationBar/userMainNavigationBar';
import CustomFooter from '../../../../../components/layouts/footer/customFooter';
import ReactCountryFlag from 'react-country-flag';
import { DropDownActionType } from '../../../../../types/ui/uiTypes';
import EditBlackSVG from '../../../../../public/assets/svgs/globalIcons/edit-black.svg';
// import EpinglerActiveSVG from '../../../../../public/assets/svgs/globalIcons/epingler-active.svg';
// import EpinglerInactiveSVG from '../../../../../public/assets/svgs/globalIcons/epingler-inactive.svg';
// import SolderEditActiveSVG from '../../../../../public/assets/svgs/globalIcons/solder-edit-active.svg';
// import SolderEditInactiveSVG from '../../../../../public/assets/svgs/globalIcons/solder-edit-inactive.svg';
import SupprimerSVG from '../../../../../public/assets/svgs/globalIcons/close-black.svg';
import { ImageListType as ImageUploadingType } from 'react-images-uploading/dist/typings';
import {
	offerDeleteRootAction,
	offerDeleteSolderAction,
	offerPatchSolderAction,
	// offerPostPinAction,
	offerPostSolderAction,
	setOfferProductToEdit,
	setOfferServiceToEdit,
	setSelectedOfferAction,
} from '../../../../../store/actions/offer/offerActions';
import { useAppDispatch } from '../../../../../utils/hooks';
import CustomSwipeModal from '../../../../../components/desktop/modals/rightSwipeModal/customSwipeModal';
import TopBarSaveClose from '../../../../../components/groupedComponents/temp-shop/edit/renseignerMesInfos-Modals/topBar-Save-Close/topBarSaveClose';
import HelperDescriptionHeader from '../../../../../components/headers/helperDescriptionHeader/helperDescriptionHeader';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CurrencyInput from 'react-currency-input-field';
import Button from '@mui/material/Button';
import ActionModals from '../../../../../components/htmlElements/modals/actionModal/actionModals';
import { AccountGetCheckAccountResponseType } from '../../../../../types/account/accountTypes';
import {
	ApiErrorResponseType,
	// OfferPinSagaCallBackType,
	SagaCallBackResponseType,
} from '../../../../../types/_init/_initTypes';
import ReadAdresse from '../../../../../components/groupedComponents/shop/get/shopInfoTabContent/readAdresse/readAdresse';
import ApiProgress from '../../../../../components/formikElements/apiLoadingResponseOrError/apiProgress/apiProgress';
import DropDownMenu from '../../../../../components/htmlElements/buttons/dropDownMenu/dropDownMenu';
import EditIconSVG from '../../../../../public/assets/svgs/globalIcons/blue-pencil.svg';
import ImageModal from '../../../../../components/desktop/modals/imageModal/imageModal';
import GetProductCart from '../../../../../components/groupedComponents/cart/getProductCart/getProductCart';
import { getCookie } from 'cookies-next';
import { CookieSerializeOptions, serialize } from 'cookie';
import ActiveCheckBlue from '../../../../../public/assets/svgs/globalIcons/active-check-blue.svg';
import {
	cartGetCartCounterAction,
	cartPostProductRootUniqueIDAction,
	cartPostServiceRootUniqueIDAction,
} from '../../../../../store/actions/cart/cartActions';
import { CartPostProductRoot, CartPostServiceRoot } from '../../../../../types/cart/cartTypes';
import GetServiceCart from '../../../../../components/groupedComponents/cart/getServiceCart/getServiceCart';

// const NoCommentsAvailableContent = () => {
// 	return (
// 		<>
// 			<Stack
// 				direction="row"
// 				justifyContent="space-between"
// 				alignItems="center"
// 				className={Styles.noCommentsAvailableContent}
// 			>
// 				<span className={Styles.noAvailableComments}>Pas encore de commentaires</span>
// 				<span>
// 					<Stack direction="row">
// 						<Image src={GrayRatingSVG} width={20} height={20} alt="" />
// 						<Image src={GrayRatingSVG} width={20} height={20} alt="" />
// 						<Image src={GrayRatingSVG} width={20} height={20} alt="" />
// 						<Image src={GrayRatingSVG} width={20} height={20} alt="" />
// 						<Image src={GrayRatingSVG} width={20} height={20} alt="" />
// 						<span className={Styles.noAvailableRatings}>(0 notes)</span>
// 					</Stack>
// 				</span>
// 			</Stack>
// 			<p className={Styles.noComments}>Effectuez votre première vente pour obtenir un commentaire</p>
// 		</>
// 	);
// };
const customCartTheme = customCartModalTheme();
const customTheme = OfferReadOnlyTheme();
const navigationTheme = doubleTabNavigationTheme();

const customThemeButton = CustomTheme('#0274d7');
const buttonTheme = createTheme({
	...customThemeButton,
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					padding: '0px',
				},
			},
		},
	},
});
const OfferCreatorBanner = () => {
	return (
		<Box
			sx={{
				background: `url(${CreatorBgIlluSVG.src}) center center no-repeat scroll #0D070B`,
				msFilter: `progid:DXImageTransform.Microsoft.AlphaImageLoader(src='${CreatorBgIlluSVG.src}', 
		sizingMethod='scale')`,
				backgroundSize: 'contain',
			}}
			className={Styles.creatorBannerWrapper}
		>
			<Stack direction="column" spacing={4}>
				<Stack direction="column" spacing={2}>
					<Image
						className={Styles.creatorImage}
						src={CreatorIlluSVG}
						alt="creator"
						width="105"
						height="56"
						sizes="100vw"
					/>
					<span className={Styles.creatorText}>
						Parce que soutenir l’économie locale est une des valeurs chères à notre cœur, Qaryb a créé un label pour
						permettre aux créateurs de notre pays d’être valorisé.
					</span>
				</Stack>
			</Stack>
		</Box>
	);
};

const AlreadyExistsInCartButton = () => {
	return (
		<ThemeProvider theme={getDefaultTheme()}>
			<Button color="primary" className={Styles.alreadyExistInCartButton} disabled>
				<Image
					src={ActiveCheckBlue}
					width={24}
					height={24}
					alt=""
					sizes="100vw"
					className={Styles.alreadyExistInCartIcon}
				/>
				Ajouté au panier !
			</Button>
		</ThemeProvider>
	);
};

type deliveriesObj = {
	delivery_city: string | null;
	all_cities: boolean | null;
	delivery_price: string | null;
	delivery_days: string | null;
};

type ProductProps = {
	permission: 'OWNER' | 'NOT_OWNER';
	data: OfferGetRootProductInterface;
	unique_id: string | null;
	children?: React.ReactNode;
};
const Product: React.FC<ProductProps> = (props: ProductProps) => {
	const router = useRouter();
	const { data, permission, unique_id } = props;
	const dispatch = useAppDispatch();
	const {
		pk,
		title,
		description,
		offer_categories,
		picture_1,
		picture_1_thumb,
		picture_2,
		picture_2_thumb,
		picture_3,
		picture_3_thumb,
		picture_4,
		picture_4_thumb,
		details_offer,
		price,
		solder_type,
		solder_value,
		shop_name,
		deliveries,
		for_whom,
		creator_label,
		made_in_label,
		pinned,
		exist_in_cart,
		// tags,
	} = data;

	const [availableImages, setAvailableImages] = useState<Array<string>>([]);
	const [availableThumbnails, setAvailableThumbnails] = useState<Array<string>>([]);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [clickedImage, setClickedImage] = useState<string | null>(null);
	const [clickedMobileImage, setClickedMobileImage] = useState<string | null>(null);

	const [categoriesListString, setCategoriesListString] = useState<Array<string>>([]);
	const [colorsListString, setColorsListString] = useState<Array<string>>([]);
	const [forWhomListString, setForWhomListString] = useState<Array<string>>([]);
	const [sizesListString, setSizesListString] = useState<Array<string>>([]);
	const [deliveriesListString, setDeliveriesListString] = useState<Array<deliveriesObj>>([]);
	const [newPrice, setNewPrice] = useState<number | null>(null);
	// const customPourcentageInput = useRef<HTMLInputElement>(null);
	// const [customPourcentageState, setCustomPourcentageState] = useState<string>('');
	const [solderByState, setSolderByState] = useState<OfferSolderByType>(solder_type ? solder_type : 'F');
	const [newSolderValue, setNewSolderValue] = useState<string>(
		typeof solder_value === 'number' ? solder_value.toString() : '0.00',
	);
	const [isSolderValid, setIsSolderValid] = useState<boolean>(false);
	const [fivePourcentSolder, setFivePourcentSolder] = useState<boolean>(false);
	const [tenPourcentSolder, setTenPourcentSolder] = useState<boolean>(false);
	const [twentyPourcentSolder, setTwentyPourcentSolder] = useState<boolean>(false);
	const [thirtyPourcentSolder, setThirtyPourcentSolder] = useState<boolean>(false);
	const [fiftyPourcentSolder, setFiftyPourcentSolder] = useState<boolean>(false);
	const [seventyPourcentSolder, setSeventyPourcentSolder] = useState<boolean>(false);
	const [solderPourcentageForApi, setSolderPourcentageForApi] = useState<string | null>(null);
	const [newSolderPourcentageValue, setNewSolderPourcentageValue] = useState<string>('0.00');
	const [openSolderModal, setOpenSolderModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	// const [pinnedIconState, setPinnedIconState] = useState(!pinned ? EpinglerInactiveSVG : EpinglerActiveSVG);
	const [voirPlus, setVoirPlus] = useState<boolean>(true);
	const [showDesktopCartModal, setShowDesktopCartModal] = useState<boolean>(false);
	const [showMobileCartModal, setShowMobileCartModal] = useState<boolean>(false);

	useEffect(() => {
		// set images
		const availableImages: Array<string> = [];
		if (picture_1) {
			availableImages.push(picture_1);
			setSelectedImage(picture_1);
			setSelectedImageIndex(0);
		} else {
			setSelectedImage(null);
		}
		if (picture_2) {
			availableImages.push(picture_2);
		}
		if (picture_3) {
			availableImages.push(picture_3);
		}
		if (picture_4) {
			availableImages.push(picture_4);
		}
		setAvailableImages(availableImages);
		const thumbnails: Array<string> = [];
		if (picture_1_thumb) {
			thumbnails.push(picture_1_thumb);
		}
		if (picture_2_thumb) {
			thumbnails.push(picture_2_thumb);
		}
		if (picture_3_thumb) {
			thumbnails.push(picture_3_thumb);
		}
		if (picture_4_thumb) {
			thumbnails.push(picture_4_thumb);
		}
		setAvailableThumbnails(thumbnails);
		// if (pinned) {
		// 	setPinnedIconState(EpinglerActiveSVG);
		// } else {
		// 	setPinnedIconState(EpinglerInactiveSVG);
		// }

		// check solder values
		if (
			fivePourcentSolder ||
			tenPourcentSolder ||
			twentyPourcentSolder ||
			thirtyPourcentSolder ||
			fiftyPourcentSolder ||
			seventyPourcentSolder
		) {
			if (fivePourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (tenPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (twentyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (thirtyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (fiftyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (seventyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			}
		} else {
			setNewSolderValue('0.00');
			setIsSolderValid(false);
		}

		let categoriesListString: Array<string> = [];
		if (offer_categories) {
			categoriesListString = getCategoriesDataArray(offer_categories);
			setCategoriesListString(categoriesListString);
		}
		// set colors
		let colorsArrayString: Array<string> = [];
		const { product_colors, product_sizes } = details_offer;
		if (product_colors) {
			colorsArrayString = getColorsDataArray(product_colors);
			setColorsListString(colorsArrayString);
		}
		let forWhomArrayString: Array<string> = [];
		if (for_whom) {
			forWhomArrayString = getForWhomDataArray(for_whom);
			setForWhomListString(forWhomArrayString);
		}
		let sizesArrayString: Array<string> = [];
		if (product_sizes) {
			sizesArrayString = getSizesDataArray(product_sizes);
			setSizesListString(sizesArrayString);
		}
		const deliveriesObjList: Array<deliveriesObj> = [];
		if (deliveries) {
			deliveries.map((delivery) => {
				const deliveryObj: deliveriesObj = {
					delivery_city: null,
					delivery_days: null,
					delivery_price: null,
					all_cities: null,
				};
				deliveryObj.delivery_city = delivery.delivery_city.join(',');
				deliveryObj.all_cities = delivery.all_cities;
				deliveryObj.delivery_price = delivery.delivery_price.toString();
				deliveryObj.delivery_days = delivery.delivery_days.toString();
				deliveriesObjList.push(deliveryObj);
			});
			setDeliveriesListString(deliveriesObjList);
		}
		if (price) {
			if (solder_type !== null && solder_type && solder_value !== null && solder_value) {
				if (solder_type === 'F') {
					setNewPrice((price as number) - solder_value);
				} else if (solder_type === 'P') {
					setNewPrice((price as number) - ((price as number) * solder_value) / 100);
				}
			}
		}
		if (description) {
			if (description.length > 300) {
				setVoirPlus(false);
			}
		}
	}, [
		pinned,
		deliveries,
		details_offer,
		fiftyPourcentSolder,
		fivePourcentSolder,
		for_whom,
		newSolderPourcentageValue,
		offer_categories,
		picture_1,
		picture_2,
		picture_3,
		picture_4,
		price,
		seventyPourcentSolder,
		solder_type,
		solder_value,
		tenPourcentSolder,
		thirtyPourcentSolder,
		twentyPourcentSolder,
		description,
		picture_1_thumb,
		picture_2_thumb,
		picture_3_thumb,
		picture_4_thumb,
	]);
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

	const showThumbnail = useCallback(
		(index: number) => {
			setSelectedImage(availableImages[index]);
			setSelectedImageIndex(index);
		},
		[availableImages],
	);

	const showImage = (src: string) => {
		setClickedImage(src);
	};

	const showMobileImage = (src: string) => {
		setClickedMobileImage(src);
	};

	const setSolderPourcentageInput = useCallback(
		(value: string) => {
			if (typeof price === 'number') {
				const newValue = price - (price * parseFloat(value)) / 100;
				setNewSolderPourcentageValue(newValue.toString());
			}
			setSolderPourcentageForApi(value);
			switch (value) {
				case '5':
					setFivePourcentSolder((prevState) => !prevState);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '10':
					setTenPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '20':
					setTwentyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '30':
					setThirtyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '50':
					setFiftyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '70':
					setSeventyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					break;
			}
		},
		[price],
	);

	const editOfferHandler = useCallback(() => {
		const pictures: ImageUploadingType = [];
		if (picture_1) {
			pictures.push({
				dataURL: picture_1,
			});
		}
		if (picture_2) {
			pictures.push({
				dataURL: picture_2,
			});
		}
		if (picture_3) {
			pictures.push({
				dataURL: picture_3,
			});
		}
		if (picture_4) {
			pictures.push({
				dataURL: picture_4,
			});
		}
		const thumbnails: Array<string> = [];
		if (picture_1_thumb) {
			thumbnails.push(picture_1_thumb);
		}
		if (picture_2_thumb) {
			thumbnails.push(picture_2_thumb);
		}
		if (picture_3_thumb) {
			thumbnails.push(picture_3_thumb);
		}
		if (picture_4_thumb) {
			thumbnails.push(picture_4_thumb);
		}
		const deliveriesObjList: {
			delivery_city_1: string;
			all_cities_1: boolean;
			delivery_price_1: string;
			delivery_days_1: string;
			delivery_city_2: string;
			all_cities_2: boolean;
			delivery_price_2: string;
			delivery_days_2: string;
			delivery_city_3: string;
			all_cities_3: boolean;
			delivery_price_3: string;
			delivery_days_3: string;
		} = {
			delivery_city_1: '',
			all_cities_1: false,
			delivery_price_1: '',
			delivery_days_1: '',
			delivery_city_2: '',
			all_cities_2: false,
			delivery_price_2: '',
			delivery_days_2: '',
			delivery_city_3: '',
			all_cities_3: false,
			delivery_price_3: '',
			delivery_days_3: '',
		};
		if (deliveries.length === 1) {
			if (deliveries[0].delivery_city) {
				deliveriesObjList.delivery_city_1 = deliveries[0].delivery_city.join(',');
			}
			deliveriesObjList.all_cities_1 = deliveries[0].all_cities;
			deliveriesObjList.delivery_price_1 = deliveries[0].delivery_price.toString();
			deliveriesObjList.delivery_days_1 = deliveries[0].delivery_days.toString();
		} else if (deliveries.length === 2) {
			if (deliveries[0].delivery_city) {
				deliveriesObjList.delivery_city_1 = deliveries[0].delivery_city.join(',');
			}
			deliveriesObjList.all_cities_1 = deliveries[0].all_cities;
			deliveriesObjList.delivery_price_1 = deliveries[0].delivery_price.toString();
			deliveriesObjList.delivery_days_1 = deliveries[0].delivery_days.toString();

			if (deliveries[1].delivery_city) {
				deliveriesObjList.delivery_city_2 = deliveries[1].delivery_city.join(',');
			}
			deliveriesObjList.all_cities_2 = deliveries[1].all_cities;
			deliveriesObjList.delivery_price_2 = deliveries[1].delivery_price.toString();
			deliveriesObjList.delivery_days_2 = deliveries[1].delivery_days.toString();
		} else if (deliveries.length === 3) {
			if (deliveries[0].delivery_city) {
				deliveriesObjList.delivery_city_1 = deliveries[0].delivery_city.join(',');
			}
			deliveriesObjList.all_cities_1 = deliveries[0].all_cities;
			deliveriesObjList.delivery_price_1 = deliveries[0].delivery_price.toString();
			deliveriesObjList.delivery_days_1 = deliveries[0].delivery_days.toString();

			if (deliveries[1].delivery_city) {
				deliveriesObjList.delivery_city_2 = deliveries[1].delivery_city.join(',');
			}
			deliveriesObjList.all_cities_2 = deliveries[1].all_cities;
			deliveriesObjList.delivery_price_2 = deliveries[1].delivery_price.toString();
			deliveriesObjList.delivery_days_2 = deliveries[1].delivery_days.toString();

			if (deliveries[2].delivery_city) {
				deliveriesObjList.delivery_city_3 = deliveries[2].delivery_city.join(',');
			}
			deliveriesObjList.all_cities_3 = deliveries[2].all_cities;
			deliveriesObjList.delivery_price_3 = deliveries[2].delivery_price.toString();
			deliveriesObjList.delivery_days_3 = deliveries[2].delivery_days.toString();
		}
		const action = setOfferProductToEdit({
			pk: pk,
			categoriesList: offer_categories,
			title: title,
			description: description,
			pictures: pictures,
			thumbnails: thumbnails,
			forWhom: for_whom.join(','),
			colors: details_offer.product_colors.join(','),
			sizes: details_offer.product_sizes.join(','),
			quantity: details_offer.product_quantity,
			made_in: made_in_label?.name as string,
			creator: creator_label as boolean,
			prix: price as string,
			prix_par: details_offer.product_price_by,
			clickAndCollect: {
				longitude: details_offer.product_longitude ? parseFloat(details_offer.product_longitude) : null,
				latitude: details_offer.product_latitude ? parseFloat(details_offer.product_latitude) : null,
				address_name: details_offer.product_address,
			},
			deliveries: deliveriesObjList,
		});
		dispatch({
			...action,
			onComplete: ({ error, cancelled, data }: { error: ApiErrorResponseType; cancelled: boolean; data: boolean }) => {
				if (!error && !cancelled && data) {
					router.push(REAL_OFFER_ADD_PRODUCT_CATEGORIES(router.query.shop_link as string)).then();
				}
			},
		});
	}, [
		creator_label,
		deliveries,
		description,
		details_offer.product_address,
		details_offer.product_colors,
		details_offer.product_latitude,
		details_offer.product_longitude,
		details_offer.product_price_by,
		details_offer.product_quantity,
		details_offer.product_sizes,
		dispatch,
		for_whom,
		made_in_label?.name,
		offer_categories,
		picture_1,
		picture_1_thumb,
		picture_2,
		picture_2_thumb,
		picture_3,
		picture_3_thumb,
		picture_4,
		picture_4_thumb,
		pk,
		price,
		router,
		title,
	]);

	// const togglePinOfferHandler = useCallback(() => {
	// 	const action = offerPostPinAction(pk);
	// 	dispatch({
	// 		...action,
	// 		onComplete: ({ error, cancelled, data }: OfferPinSagaCallBackType) => {
	// 			if (!error && !cancelled && data) {
	// 				router
	// 					.replace(router.asPath, undefined, {
	// 						scroll: false,
	// 					})
	// 					.then();
	// 			}
	// 		},
	// 	});
	// }, [dispatch, pk, router]);
	//
	// const showSolderOfferNav = () => {
	// 	setOpenSolderModal(true);
	// };

	const deleteOfferHandler = useCallback(() => {
		const action = offerDeleteRootAction(pk);
		dispatch({
			...action,
			onComplete: ({ error, cancelled, data }: { error: ApiErrorResponseType; cancelled: boolean; data: boolean }) => {
				if (!error && !cancelled && data) {
					router.replace(REAL_SHOP_BY_SHOP_LINK_ROUTE(router.query.shop_link as string)).then();
				}
			},
		});
		// dispatch(offerDeleteRootAction(pk, router));
		setShowDeleteModal(false);
	}, [dispatch, pk, router]);

	const deleteModalActions = useMemo(() => {
		return [
			{
				active: true,
				text: 'Oui',
				onClick: deleteOfferHandler,
			},
			{
				active: false,
				text: 'Non',
				onClick: () => setShowDeleteModal(false),
			},
		];
	}, [deleteOfferHandler]);

	const showDeleteOfferModal = () => {
		setShowDeleteModal(true);
	};

	const handleSaveSolder = useCallback(() => {
		let valueToSend;
		if (solderPourcentageForApi && solderByState === 'P') {
			valueToSend = solderPourcentageForApi;
		} else {
			valueToSend = newSolderValue;
		}
		if (!solder_value) {
			// dispatch post
			const action = offerPostSolderAction(pk, solderByState, parseFloat(valueToSend));
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<OfferSolderInterface>) => {
					if (!error && !cancelled && data) {
						router.replace(router.asPath).then(() => {
							setOpenSolderModal(false);
						});
					}
				},
			});
		} else {
			// dispatch patch
			const action = offerPatchSolderAction(pk, solderByState, parseFloat(valueToSend));
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<OfferSolderInterface>) => {
					if (!error && !cancelled && data) {
						router.replace(router.asPath).then(() => {
							setOpenSolderModal(false);
						});
					}
				},
			});
		}
	}, [dispatch, newSolderValue, pk, router, solderByState, solderPourcentageForApi, solder_value]);

	const deleteSolderHandler = useCallback(() => {
		// dispatch delete
		const action = offerDeleteSolderAction(pk);
		dispatch({
			...action,
			onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<boolean>) => {
				if (!error && !cancelled && data) {
					router.replace(router.asPath).then(() => {
						setOpenSolderModal(false);
						setNewSolderValue('0.00');
					});
				}
			},
		});
	}, [dispatch, pk, router]);

	const solderTabHandleChange = (event: React.SyntheticEvent, solderBy: OfferSolderByType) => {
		setSolderByState(solderBy);
	};

	const dropDownActions: DropDownActionType = [
		{
			icon: EditBlackSVG,
			text: 'Modifier',
			onClick: editOfferHandler,
		},
		// {
		// 	icon: pinned ? EpinglerActiveSVG : EpinglerInactiveSVG,
		// 	text: 'Épingler',
		// 	onClick: togglePinOfferHandler,
		// },
		// {
		// 	icon: solder_value !== null ? SolderEditActiveSVG : SolderEditInactiveSVG,
		// 	text: 'Solder',
		// 	onClick: showSolderOfferNav,
		// },
		{
			icon: SupprimerSVG,
			text: 'Supprimer',
			onClick: showDeleteOfferModal,
		},
	];

	const voirPlusHandler = (value: boolean) => {
		setVoirPlus(value);
	};

	const VoirPlusMoinButtons = () => {
		if (description && description.length > 300) {
			if (voirPlus) {
				return (
					<ThemeProvider theme={buttonTheme}>
						<Button color="primary" className={Styles.seeMoreButton} onClick={() => voirPlusHandler(false)}>
							voir moin
						</Button>
					</ThemeProvider>
				);
			} else {
				return (
					<ThemeProvider theme={buttonTheme}>
						<Button color="primary" className={Styles.seeMoreButton} onClick={() => voirPlusHandler(true)}>
							voir plus
						</Button>
					</ThemeProvider>
				);
			}
		} else {
			return null;
		}
	};

	const [addedToCart, setAddedToCart] = useState<boolean>(exist_in_cart);

	const AddProductToCartHandler = useCallback(
		async (picked_color: string | null, picked_size: string | null, picked_quantity: number) => {
			if (picked_quantity <= 0) {
				return;
			}
			const action = cartPostProductRootUniqueIDAction(pk, 'V', unique_id, picked_color, picked_size, picked_quantity);
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<CartPostProductRoot>) => {
					if (!error && !cancelled && data) {
						router.replace(router.asPath).then(() => {
							setAddedToCart(true);
							dispatch(cartGetCartCounterAction(unique_id));
							setShowMobileCartModal(false);
							setShowDesktopCartModal(false);
						});
					}
				},
			});
		},
		[dispatch, pk, router, unique_id],
	);

	return (
		<ThemeProvider theme={customTheme}>
			<Stack direction="column">
				<UserMainNavigationBar />
				<main className={Styles.main}>
					{permission === 'OWNER' && (
						<Stack direction="row" justifyContent="flex-end">
							<DropDownMenu
								dropDownText="Modifier"
								dropDownIcon={EditIconSVG}
								actions={dropDownActions}
								menuID="desktop-validate-menu"
								buttonID="desktop-validate-menu-btn"
							/>
						</Stack>
					)}
					<Box className={`${Styles.pageWrapper} ${permission === 'NOT_OWNER' && Styles.removeTopMargin}`}>
						<Stack direction="row" spacing={10} className={Styles.imagesWrapper} justifyContent="center">
							<Desktop>
								<Stack direction="column" spacing={5} sx={{ maxWidth: '55%' }}>
									<Stack direction="row" spacing={3}>
										<Stack direction="column" spacing={1.8}>
											{availableThumbnails.length > 0 ? (
												availableThumbnails.map((image, index) => (
													<ImageListItem key={index}>
														{image && (
															<Image
																className={`${Styles.thumbnails} ${
																	selectedImageIndex === index ? Styles.selectedThumbnail : null
																}`}
																src={image}
																width={80}
																height={80}
																sizes="100vw"
																onClick={() => showThumbnail(index)}
																alt=""
															/>
														)}
													</ImageListItem>
												))
											) : (
												<>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
												</>
											)}
										</Stack>
										{!selectedImage ? (
											<Box className={Styles.mainImageWrapper}>
												<Skeleton variant="rectangular" width={590} height={500} className={Styles.selectedImage} />
											</Box>
										) : (
											<Box className={Styles.mainImageWrapper}>
												<Image
													className={Styles.selectedImage}
													src={selectedImage}
													width={590}
													height={500}
													sizes="100vw"
													onClick={() => {
														showImage(selectedImage);
													}}
													alt=""
												/>
												{creator_label && (
													<Image
														className={Styles.creatorImageTag}
														src={CreatorIconSVG}
														alt="creator"
														width="0"
														height="0"
														sizes="100vw"
													/>
												)}
											</Box>
										)}
									</Stack>
									{clickedImage && (
										<ImageModal
											open={!!clickedImage}
											handleClose={() => setClickedImage(null)}
											direction="up"
											onBackdrop={() => setClickedImage(null)}
											fullScreen={true}
											theme={customImageModalTheme()}
											cssClasse={Styles.clickedImageModal}
										>
											<Box className={Styles.clickedImageBox}>
												<Image
													className={Styles.clickedImage}
													src={clickedImage}
													width={590}
													height={500}
													sizes="100vw"
													alt=""
												/>
											</Box>
										</ImageModal>
									)}
									{/* Desktop creator banner goes here */}
									{creator_label && <OfferCreatorBanner />}
									{/*<NoCommentsAvailableContent />*/}
								</Stack>
							</Desktop>
							<TabletAndMobile>
								<div style={{ display: 'block', marginLeft: '0' }}>
									<>
										<Swiper
											pagination={{
												clickable: true,
												enabled: true,
												bulletActiveClass: 'activekOfferBullet',
												clickableClass: 'paginationOfferBullet',
											}}
											modules={[Navigation, Pagination, Lazy]}
											scrollbar={{ enabled: false }}
											className={Styles.swiperSlide}
										>
											{availableThumbnails.length > 0 ? (
												availableThumbnails.map((image, index) => {
													return (
														<SwiperSlide key={index}>
															<Box className={Styles.mainImageWrapper}>
																<Image
																	className={Styles.selectedImage}
																	src={image}
																	width={365}
																	height={240}
																	onClick={() => showMobileImage(availableImages[index])}
																	sizes="100vw"
																	alt=""
																/>
																{creator_label && (
																	<Image
																		className={Styles.creatorImageTag}
																		src={CreatorIconSVG}
																		alt="creator"
																		width="0"
																		height="0"
																		sizes="100vw"
																	/>
																)}
															</Box>
														</SwiperSlide>
													);
												})
											) : (
												<SwiperSlide>
													<Box className={Styles.mainImageWrapper}>
														<Skeleton variant="rectangular" width={365} height={240} className={Styles.selectedImage} />
													</Box>
												</SwiperSlide>
											)}
										</Swiper>
										{clickedMobileImage && (
											<ImageModal
												open={!!clickedMobileImage}
												handleClose={() => setClickedMobileImage(null)}
												direction="up"
												onBackdrop={() => setClickedMobileImage(null)}
												fullScreen={true}
												theme={customMobileImageModalTheme()}
												cssClasse={Styles.clickedImageModal}
											>
												<Box className={Styles.clickedImageBox}>
													<Image
														className={Styles.clickedImage}
														src={clickedMobileImage}
														width={365}
														height={240}
														sizes="100vw"
														alt=""
													/>
												</Box>
											</ImageModal>
										)}
									</>
								</div>
							</TabletAndMobile>
							<Stack direction="column" spacing={1} className={Styles.offerWrapper}>
								<Stack direction="column" spacing={4}>
									<Stack direction="column" spacing={2}>
										<Stack direction="column">
											<h1 className={Styles.title}>{title}</h1>
											{/*<Stack direction="row">*/}
											{/*	<Image src={BlackStarSVG} width={20} height={20} alt="" />*/}
											{/*	<span className={Styles.rating}>0 (0 notes)</span>*/}
											{/*</Stack>*/}
											<Link href={REAL_SHOP_BY_SHOP_LINK_ROUTE(router.query.shop_link as string)}>
												<span className={Styles.shopName}>{shop_name}</span>
											</Link>
										</Stack>
										<Stack direction="column" spacing={1}>
											<Stack direction="row" flexWrap="wrap" className={Styles.rootChipStack}>
												{categoriesListString.map((category, index) => {
													return <Chip key={index} label={category} variant="filled" className={Styles.chip} />;
												})}
											</Stack>
											{made_in_label && (
												<Stack direction="row" spacing={1} alignItems="center">
													<ReactCountryFlag
														svg
														aria-label={made_in_label.name}
														className={Styles.madeInFlag}
														countryCode={made_in_label.code}
													/>
													<span className={Styles.madeInSpan}>Made in {made_in_label.name}</span>
												</Stack>
											)}
										</Stack>
									</Stack>
									<Stack direction="column" spacing={2} className={Styles.descriptionWrapper}>
										<Stack direction="column" spacing={1}>
											<span className={Styles.descriptionTitle}>Description</span>
											<p className={Styles.descriptionBody}>
												{!voirPlus
													? description && description.length > 300
														? description.substring(0, 300).concat('...')
														: description
													: description}
											</p>
											<Box sx={{ width: 'auto' }}>
												<VoirPlusMoinButtons />
											</Box>
										</Stack>
										<Stack direction="column" spacing={1}>
											{colorsListString.length > 0 && (
												<p className={Styles.colorBody}>
													<span className={Styles.colorTitle}>Couleurs : </span>
													{colorsListString.join(', ')}
												</p>
											)}
											{sizesListString.length > 0 && (
												<p className={Styles.sizesBody}>
													<span className={Styles.sizesTitle}>Taille : </span>
													{sizesListString.join(', ')}
												</p>
											)}
											{forWhomListString.length > 0 && (
												<p className={Styles.forWhomBody}>
													<span className={Styles.forWhomTitle}>Pour : </span>
													{forWhomListString.join(', ')}
												</p>
											)}
										</Stack>
									</Stack>
									<Stack direction="column" className={Styles.priceWrapper}>
										<Stack direction="row" spacing={1}>
											<span className={`${Styles.price} ${solder_value !== null && Styles.oldPrice}`}>
												{price + ' DH'}
											</span>
											<span className={Styles.solderPrice}>{solder_value !== null ? newPrice + ' DH' : null}</span>
										</Stack>
										<Stack direction="row" justifyContent="space-between">
											<span className={Styles.priceBy}>
												par {getProductPriceByData(details_offer.product_price_by as OfferProductPriceByType)}
											</span>
											{details_offer.product_quantity && (
												<span className={Styles.quantity}>{details_offer.product_quantity} restant</span>
											)}
										</Stack>
									</Stack>
								</Stack>
								<Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
									<Desktop>
										<div className={`${Styles.primaryButtonWrapper} ${Styles.primaryButton}`}>
											{addedToCart ? (
												<AlreadyExistsInCartButton />
											) : (
												<PrimaryButton
													buttonText="Ajouter au panier"
													active={
														permission !== 'OWNER' &&
														(!details_offer.product_quantity || details_offer.product_quantity > 0)
													}
													onClick={() => {
														setShowDesktopCartModal(true);
													}}
												/>
											)}
										</div>
									</Desktop>

									<TabletAndMobile>
										<div className={`${Styles.primaryButtonWrapper} ${Styles.primaryButton}`}>
											{addedToCart ? (
												<AlreadyExistsInCartButton />
											) : (
												<PrimaryButton
													buttonText="Ajouter au panier"
													active={
														permission !== 'OWNER' &&
														(!details_offer.product_quantity || details_offer.product_quantity > 0)
													}
													onClick={() => {
														setShowMobileCartModal(true);
													}}
												/>
											)}
										</div>
									</TabletAndMobile>

									<Box className={Styles.clickAnddeliveriesWrapper}>
										<Stack
											direction="column"
											divider={<Divider orientation="horizontal" flexItem className={Styles.divider} />}
										>
											{details_offer.product_address ? (
												<Stack
													direction="row"
													justifyContent="space-between"
													className={Styles.deliveryRow}
													alignItems="center"
												>
													<Stack direction="row" alignItems="center">
														<Image src={ClickAndCollectSVG} width={40} height={40} alt="" />
														<Stack direction="column">
															<span className={Styles.deliveriesTitle}>Click & collect</span>
															<span className={Styles.deliveryDetails}>Dès demain</span>
															<span className={Styles.deliveryDetails}>{details_offer.product_address}</span>
														</Stack>
													</Stack>
													<span className={Styles.deliveryPrice}>Gratuite</span>
												</Stack>
											) : (
												<Stack
													direction="row"
													justifyContent="space-between"
													className={Styles.deliveryNotFoundRow}
													alignItems="center"
												>
													<Stack direction="row" alignItems="center">
														<Image src={ClickAndCollectDisabledSVG} width={40} height={40} alt="" />
														<Stack direction="column">
															<span className={Styles.deliveriesTitleNotFound}>Click & collect</span>
															<span className={Styles.deliveryDetailsNotFound}>Non disponible</span>
														</Stack>
													</Stack>
												</Stack>
											)}
											{deliveriesListString.length > 0 ? (
												deliveriesListString.map((delivery, index) => {
													return (
														<Stack
															key={index}
															direction="row"
															justifyContent="space-between"
															className={Styles.deliveryRow}
															alignItems="center"
														>
															<Stack direction="row" alignItems="center">
																<Image src={DeliverySVG} width={40} height={40} alt="" />
																<Stack direction="column">
																	<span className={Styles.deliveriesTitle}>
																		{delivery.all_cities
																			? 'Tout le Maroc'
																			: delivery.delivery_city?.split(',').join(', ')}
																	</span>
																	<span className={Styles.deliveryDetails}>
																		{getDateFromDayCountNumber(parseInt(delivery.delivery_days as string))}
																	</span>
																</Stack>
															</Stack>
															<span className={Styles.deliveryPrice}>
																{delivery.delivery_price === '0' ? 'Gratuite' : delivery.delivery_price + 'DH'}
															</span>
														</Stack>
													);
												})
											) : (
												<Stack
													direction="row"
													justifyContent="space-between"
													className={Styles.deliveryNotFoundRow}
													alignItems="center"
												>
													<Stack direction="row" alignItems="center">
														<Image src={DeliveryDisabledSVG} width={40} height={40} alt="" />
														<Stack direction="column">
															<span className={Styles.deliveriesTitleNotFound}>Livraison</span>
															<span className={Styles.deliveryDetailsNotFound}>Non disponible</span>
														</Stack>
													</Stack>
												</Stack>
											)}
										</Stack>
									</Box>
								</Stack>
								<TabletAndMobile>
									<Stack direction="column" spacing={3}>
										<Divider orientation="horizontal" flexItem className={Styles.divider} />
										{/* mobile creator banner goes here */}
										{creator_label && <OfferCreatorBanner />}
										{/*<NoCommentsAvailableContent />*/}
									</Stack>
								</TabletAndMobile>
							</Stack>
						</Stack>
					</Box>
					{permission === 'OWNER' && (
						<CustomSwipeModal transition open={openSolderModal} handleClose={() => setOpenSolderModal(false)}>
							<Stack
								direction="column"
								justifyContent="space-between"
								alignContent="space-between"
								className={Styles.rootTopActionsStack}
							>
								<TopBarSaveClose
									buttonText="Terminer"
									handleClose={() => setOpenSolderModal(false)}
									handleSubmit={handleSaveSolder}
									isValid={isSolderValid}
									cssClasses={Styles.topContainer}
								/>
								<HelperDescriptionHeader
									header="Solder une offre"
									headerClasses={Styles.header}
									descriptionClasses={Styles.description}
									cssClasses={Styles.topContainer}
								/>
								<Stack direction="column" justifyContent="space-around" className={Styles.doubleTabWrapper}>
									<ThemeProvider theme={navigationTheme}>
										<BottomNavigation value={solderByState} onChange={solderTabHandleChange} showLabels>
											<BottomNavigationAction label="Prix Fixe" value="F" />
											<BottomNavigationAction label="Pourcentage" value="P" />
										</BottomNavigation>
									</ThemeProvider>
									{solderByState === 'F' ? (
										<Stack
											direction="column"
											spacing={1}
											sx={{ margin: '12px 32px 12px', height: '100%' }}
											justifyContent="space-between"
										>
											<Stack direction="column" spacing={1} alignItems="center">
												<CurrencyInput
													className={Styles.priceInputField}
													id="solder-fix"
													name="solder-fix"
													placeholder="0.00"
													value={newSolderValue}
													decimalsLimit={2}
													onValueChange={(value) => {
														if (value) {
															if (price) {
																if ((price as number) <= parseFloat(value)) {
																	return;
																}
															}
															setNewSolderValue(value);
														} else {
															setNewSolderValue('0.00');
														}
														setIsSolderValid(true);
													}}
												/>
												{price ? (
													<>
														<p className={Styles.oldSolderValue}>{price} DH</p>
														<p className={Styles.oldSolderText}>ancien prix</p>
													</>
												) : null}
											</Stack>
											{solder_value ? (
												<Button onClick={deleteSolderHandler} color="primary" className={Styles.cancelButton}>
													Annuler la réduction
												</Button>
											) : null}
										</Stack>
									) : (
										<Stack
											direction="column"
											spacing={1}
											sx={{ margin: '12px 32px 12px', height: '100%' }}
											justifyContent="space-between"
										>
											<Stack direction="column" spacing={1} alignItems="center">
												<CurrencyInput
													className={Styles.priceInputField}
													id="solder-pourcentage"
													name="solder-pourcentage"
													readOnly={true}
													placeholder="0.00"
													value={newSolderValue}
													decimalsLimit={2}
												/>
												{price ? (
													<>
														<p className={Styles.oldSolderValue}>{price} DH</p>
														<p className={Styles.oldSolderText}>ancien prix</p>
													</>
												) : null}
												<ThemeProvider theme={SolderPourcentageChipTheme()}>
													{/* TODO check rowSpacing */}
													<Grid
														container
														rowSpacing={2}
														wrap="wrap"
														justifyContent="center"
														alignItems="center"
														className={Styles.rootGridChip}
													>
														<Grid item xs="auto">
															<Chip
																label="-5 %"
																variant={fivePourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	// setDeliveryPriceState('0');
																	setSolderPourcentageInput('5');
																}}
																size="medium"
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-10 %"
																variant={tenPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('10');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-20 %"
																variant={twentyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('20');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-30 %"
																variant={thirtyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('30');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-50 %"
																variant={fiftyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('50');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-70 %"
																variant={seventyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('70');
																}}
															/>
														</Grid>
													</Grid>
												</ThemeProvider>
												{/*<Stack direction="row" justifyContent="center" sx={{ marginTop: '2rem !important' }}>*/}
												{/*	<ThemeProvider theme={customPourcentageTheme}>*/}
												{/*		<TextField*/}
												{/*			inputMode="numeric"*/}
												{/*			inputProps={{ min: 1, max: 99 }}*/}
												{/*			ref={customPourcentageInput}*/}
												{/*			color="primary"*/}
												{/*			placeholder="Autre"*/}
												{/*			value={customPourcentageState}*/}
												{/*			onChange={(e) => {*/}
												{/*				let value = parseInt(e.target.value, 10);*/}
												{/*				if (value > 99) value = 99;*/}
												{/*				if (value < 1) value = 1;*/}
												{/*				setCustomPourcentageState(value.toString());*/}
												{/*				setSolderPourcentageInput(value.toString());*/}
												{/*			}}*/}
												{/*			// variant="standard"*/}
												{/*			fullWidth={false}*/}
												{/*			size="medium"*/}
												{/*			type="number"*/}
												{/*			className={Styles.customField}*/}
												{/*			disabled={*/}
												{/*				fivePourcentSolder ||*/}
												{/*				tenPourcentSolder ||*/}
												{/*				twentyPourcentSolder ||*/}
												{/*				thirtyPourcentSolder ||*/}
												{/*				fiftyPourcentSolder ||*/}
												{/*				seventyPourcentSolder*/}
												{/*			}*/}
												{/*		/>*/}
												{/*	</ThemeProvider>*/}
												{/*</Stack>*/}
											</Stack>
											{solder_value ? (
												<Button onClick={deleteSolderHandler} color="primary" className={Styles.cancelButton}>
													Annuler la réduction
												</Button>
											) : null}
										</Stack>
									)}
								</Stack>
							</Stack>
						</CustomSwipeModal>
					)}
					{showDeleteModal && permission === 'OWNER' && (
						<ActionModals title="Supprimer cette offre ?" actions={deleteModalActions} />
					)}
					{/* Solder modal */}
				</main>
				<CustomFooter />
				{/* Desktop Cart Modal */}
				<Desktop>
					<Box>
						<CustomSwipeModal
							transition
							showCloseIcon
							direction="left"
							open={showDesktopCartModal}
							handleClose={() => setShowDesktopCartModal(false)}
						>
							<GetProductCart
								colorsListString={colorsListString}
								sizesListString={sizesListString}
								productQuantity={details_offer.product_quantity}
								AddProductToCartHandler={AddProductToCartHandler}
							/>
						</CustomSwipeModal>
					</Box>
				</Desktop>

				{/* Mobile Cart Modal */}
				<TabletAndMobile>
					<Box>
						<CustomSwipeModal
							theme={customCartTheme}
							showCloseIcon
							fullScreen={true}
							transition={false}
							open={showMobileCartModal}
							handleClose={() => setShowMobileCartModal(false)}
						>
							<GetProductCart
								colorsListString={colorsListString}
								sizesListString={sizesListString}
								productQuantity={details_offer.product_quantity}
								AddProductToCartHandler={AddProductToCartHandler}
							/>
						</CustomSwipeModal>
					</Box>
				</TabletAndMobile>
			</Stack>
		</ThemeProvider>
	);
};

type ServiceProps = {
	permission: 'OWNER' | 'NOT_OWNER';
	data: OfferGetRootServiceInterface;
	unique_id: string | null;
	children?: React.ReactNode;
};
const Service: React.FC<ServiceProps> = (props: ServiceProps) => {
	const router = useRouter();
	const { data, permission, unique_id } = props;
	const dispatch = useAppDispatch();
	// const { offer_pk } = router.query;
	const {
		pk,
		title,
		description,
		offer_categories,
		picture_1,
		picture_1_thumb,
		picture_2,
		picture_2_thumb,
		picture_3,
		picture_3_thumb,
		picture_4,
		picture_4_thumb,
		details_offer,
		price,
		solder_type,
		solder_value,
		shop_name,
		for_whom,
		exist_in_cart,
		// pinned,
		// tags,
	} = data;
	const [availableImages, setAvailableImages] = useState<Array<string>>([]);
	const [availableThumbnails, setAvailableThumbnails] = useState<Array<string>>([]);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [clickedImage, setClickedImage] = useState<string | null>(null);
	const [clickedMobileImage, setClickedMobileImage] = useState<string | null>(null);

	const [categoriesListString, setCategoriesListString] = useState<Array<string>>([]);
	const [forWhomListString, setForWhomListString] = useState<Array<string>>([]);
	const [newPrice, setNewPrice] = useState<number | null>(null);
	const [availabilityDays, setAvailabilityDays] = useState<Array<string>>([]);
	const [morningHourFrom, setMorningHourFrom] = useState<string | null>(null);
	const [morningHourTo, setMorningHourTo] = useState<string | null>(null);
	const [afternoonHourFrom, setAfternoonHourFrom] = useState<string | null>(null);
	const [afternoonHourTo, setAfternoonHourTo] = useState<string | null>(null);
	const [solderByState, setSolderByState] = useState<OfferSolderByType>(solder_type ? solder_type : 'F');
	const [newSolderValue, setNewSolderValue] = useState<string>(
		typeof solder_value === 'number' ? solder_value.toString() : '0.00',
	);
	const [isSolderValid, setIsSolderValid] = useState<boolean>(false);
	const [fivePourcentSolder, setFivePourcentSolder] = useState<boolean>(false);
	const [tenPourcentSolder, setTenPourcentSolder] = useState<boolean>(false);
	const [twentyPourcentSolder, setTwentyPourcentSolder] = useState<boolean>(false);
	const [thirtyPourcentSolder, setThirtyPourcentSolder] = useState<boolean>(false);
	const [fiftyPourcentSolder, setFiftyPourcentSolder] = useState<boolean>(false);
	const [seventyPourcentSolder, setSeventyPourcentSolder] = useState<boolean>(false);
	const [solderPourcentageForApi, setSolderPourcentageForApi] = useState<string | null>(null);
	const [newSolderPourcentageValue, setNewSolderPourcentageValue] = useState<string>('0.00');
	const [openSolderModal, setOpenSolderModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	// const [pinnedIconState, setPinnedIconState] = useState(!pinned ? EpinglerInactiveSVG : EpinglerActiveSVG);
	const [voirPlus, setVoirPlus] = useState<boolean>(true);
	const [showDesktopCartModal, setShowDesktopCartModal] = useState<boolean>(false);
	const [showMobileCartModal, setShowMobileCartModal] = useState<boolean>(false);

	useEffect(() => {
		const availableImages: Array<string> = [];
		if (picture_1) {
			availableImages.push(picture_1);
			setSelectedImage(picture_1);
		} else {
			setSelectedImage(null);
		}
		if (picture_2) {
			availableImages.push(picture_2);
		}
		if (picture_3) {
			availableImages.push(picture_3);
		}
		if (picture_4) {
			availableImages.push(picture_4);
		}
		setAvailableImages(availableImages);
		const thumbnails: Array<string> = [];
		if (picture_1_thumb) {
			thumbnails.push(picture_1_thumb);
		}
		if (picture_2_thumb) {
			thumbnails.push(picture_2_thumb);
		}
		if (picture_3_thumb) {
			thumbnails.push(picture_3_thumb);
		}
		if (picture_4_thumb) {
			thumbnails.push(picture_4_thumb);
		}
		setAvailableThumbnails(thumbnails);
		// if (pinned) {
		// 	setPinnedIconState(EpinglerActiveSVG);
		// } else {
		// 	setPinnedIconState(EpinglerInactiveSVG);
		// }
		// check solder values
		if (
			fivePourcentSolder ||
			tenPourcentSolder ||
			twentyPourcentSolder ||
			thirtyPourcentSolder ||
			fiftyPourcentSolder ||
			seventyPourcentSolder
		) {
			if (fivePourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (tenPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (twentyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (thirtyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (fiftyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			} else if (seventyPourcentSolder) {
				setNewSolderValue(newSolderPourcentageValue.toString());
				setIsSolderValid(true);
			}
		} else {
			setNewSolderValue('0.00');
			setIsSolderValid(false);
		}

		let categoriesListString: Array<string> = [];
		if (offer_categories) {
			categoriesListString = getCategoriesDataArray(offer_categories);
			setCategoriesListString(categoriesListString);
		}
		let availabilityDaysArray: Array<string> = [];
		const {
			service_availability_days,
			service_morning_hour_from,
			service_morning_hour_to,
			service_afternoon_hour_from,
			service_afternoon_hour_to,
		} = details_offer;
		if (service_availability_days) {
			availabilityDaysArray = getServiceAvailabilityDaysArray(service_availability_days);
			setAvailabilityDays(availabilityDaysArray);
		}
		if (service_morning_hour_from) {
			setMorningHourFrom(service_morning_hour_from);
		}
		if (service_morning_hour_to) {
			setMorningHourTo(service_morning_hour_to);
		}
		if (service_afternoon_hour_from) {
			setAfternoonHourFrom(service_afternoon_hour_from);
		}
		if (service_afternoon_hour_to) {
			setAfternoonHourTo(service_afternoon_hour_to);
		}

		let forWhomArrayString: Array<string> = [];
		if (for_whom) {
			forWhomArrayString = getForWhomDataArray(for_whom);
			setForWhomListString(forWhomArrayString);
		}
		if (price) {
			if (solder_type !== null && solder_type && solder_value !== null && solder_value) {
				if (solder_type === 'F') {
					setNewPrice((price as number) - solder_value);
				} else if (solder_type === 'P') {
					setNewPrice((price as number) - ((price as number) * solder_value) / 100);
				}
			}
		}
		if (description) {
			if (description.length > 300) {
				setVoirPlus(false);
			}
		}
	}, [
		description,
		details_offer,
		fiftyPourcentSolder,
		fivePourcentSolder,
		for_whom,
		newSolderPourcentageValue,
		offer_categories,
		picture_1,
		picture_1_thumb,
		picture_2,
		picture_2_thumb,
		picture_3,
		picture_3_thumb,
		picture_4,
		picture_4_thumb,
		price,
		seventyPourcentSolder,
		solder_type,
		solder_value,
		tenPourcentSolder,
		thirtyPourcentSolder,
		twentyPourcentSolder,
	]);

	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const showThumbnail = useCallback(
		(index: number) => {
			setSelectedImage(availableImages[index]);
			setSelectedImageIndex(index);
		},
		[availableImages],
	);

	const showImage = (src: string) => {
		setClickedImage(src);
	};

	const showMobileImage = (src: string) => {
		setClickedMobileImage(src);
	};

	const setSolderPourcentageInput = useCallback(
		(value: string) => {
			if (typeof price === 'number') {
				const newValue = price - (price * parseFloat(value)) / 100;
				setNewSolderPourcentageValue(newValue.toString());
			}
			setSolderPourcentageForApi(value);
			switch (value) {
				case '5':
					setFivePourcentSolder((prevState) => !prevState);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '10':
					setTenPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '20':
					setTwentyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '30':
					setThirtyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '50':
					setFiftyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setSeventyPourcentSolder(false);
					break;
				case '70':
					setSeventyPourcentSolder((prevState) => !prevState);
					setFivePourcentSolder(false);
					setTenPourcentSolder(false);
					setTwentyPourcentSolder(false);
					setThirtyPourcentSolder(false);
					setFiftyPourcentSolder(false);
					break;
			}
		},
		[price],
	);

	const editOfferHandler = useCallback(() => {
		const pictures: ImageUploadingType = [];
		if (picture_1) {
			pictures.push({
				dataURL: picture_1,
			});
		}
		if (picture_2) {
			pictures.push({
				dataURL: picture_2,
			});
		}
		if (picture_3) {
			pictures.push({
				dataURL: picture_3,
			});
		}
		if (picture_4) {
			pictures.push({
				dataURL: picture_4,
			});
		}
		const thumbnails: Array<string> = [];
		if (picture_1_thumb) {
			thumbnails.push(picture_1_thumb);
		}
		if (picture_2_thumb) {
			thumbnails.push(picture_2_thumb);
		}
		if (picture_3_thumb) {
			thumbnails.push(picture_3_thumb);
		}
		if (picture_4_thumb) {
			thumbnails.push(picture_4_thumb);
		}
		const action = setOfferServiceToEdit({
			pk: pk,
			categoriesList: offer_categories,
			title: title,
			description: description,
			pictures: pictures,
			thumbnails: thumbnails,
			forWhom: for_whom.join(','),
			service_availability_days: details_offer.service_availability_days,
			service_morning_hour_from: details_offer.service_morning_hour_from,
			service_morning_hour_to: details_offer.service_morning_hour_to,
			service_afternoon_hour_from: details_offer.service_afternoon_hour_from,
			service_afternoon_hour_to: details_offer.service_afternoon_hour_to,
			service_zone_by: details_offer.service_zone_by,
			service_longitude: details_offer.service_longitude,
			service_latitude: details_offer.service_latitude,
			service_address: details_offer.service_address,
			service_km_radius: details_offer.service_km_radius,
			// tags: tags.join(','),
			price: price as string,
			service_price_by: details_offer.service_price_by,
		});
		dispatch({
			...action,
			onComplete: ({ error, cancelled, data }: { error: ApiErrorResponseType; cancelled: boolean; data: boolean }) => {
				if (!error && !cancelled && data) {
					router.push(REAL_OFFER_ADD_SERVICE_CATEGORIES(router.query.shop_link as string)).then();
				}
			},
		});
	}, [
		description,
		details_offer.service_address,
		details_offer.service_afternoon_hour_from,
		details_offer.service_afternoon_hour_to,
		details_offer.service_availability_days,
		details_offer.service_km_radius,
		details_offer.service_latitude,
		details_offer.service_longitude,
		details_offer.service_morning_hour_from,
		details_offer.service_morning_hour_to,
		details_offer.service_price_by,
		details_offer.service_zone_by,
		dispatch,
		for_whom,
		offer_categories,
		picture_1,
		picture_1_thumb,
		picture_2,
		picture_2_thumb,
		picture_3,
		picture_3_thumb,
		picture_4,
		picture_4_thumb,
		pk,
		price,
		router,
		title,
	]);

	// const togglePinOfferHandler = () => {
	// 	const action = offerPostPinAction(pk);
	// 	dispatch({
	// 		...action,
	// 		onComplete: ({ error, cancelled, data }: OfferPinSagaCallBackType) => {
	// 			if (!error && !cancelled && data) {
	// 				router
	// 					.replace(router.asPath, undefined, {
	// 						scroll: false,
	// 					})
	// 					.then();
	// 			}
	// 		},
	// 	});
	// };

	// const showSolderOfferNav = () => {
	// 	setOpenSolderModal(true);
	// };

	const deleteOfferHandler = useCallback(() => {
		const action = offerDeleteRootAction(pk);
		dispatch({
			...action,
			onComplete: ({ error, cancelled, data }: { error: ApiErrorResponseType; cancelled: boolean; data: boolean }) => {
				if (!error && !cancelled && data) {
					router.replace(REAL_SHOP_BY_SHOP_LINK_ROUTE(router.query.shop_link as string)).then();
				}
			},
		});
		setShowDeleteModal(false);
	}, [dispatch, pk, router]);

	const deleteModalActions = useMemo(() => {
		return [
			{
				active: true,
				text: 'Oui',
				onClick: deleteOfferHandler,
			},
			{
				active: false,
				text: 'Non',
				onClick: () => setShowDeleteModal(false),
			},
		];
	}, [deleteOfferHandler]);

	const showDeleteOfferModal = () => {
		setShowDeleteModal(true);
	};

	const handleSaveSolder = useCallback(() => {
		let valueToSend;
		if (solderPourcentageForApi && solderByState === 'P') {
			valueToSend = solderPourcentageForApi;
		} else {
			valueToSend = newSolderValue;
		}
		if (!solder_value) {
			// dispatch post
			const action = offerPostSolderAction(pk, solderByState, parseFloat(valueToSend));
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<OfferSolderInterface>) => {
					if (!error && !cancelled && data) {
						router.replace(router.asPath).then(() => {
							setOpenSolderModal(false);
						});
					}
				},
			});
		} else {
			// dispatch patch
			const action = offerPatchSolderAction(pk, solderByState, parseFloat(valueToSend));
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<OfferSolderInterface>) => {
					if (!error && !cancelled && data) {
						router.replace(router.asPath).then(() => {
							setOpenSolderModal(false);
						});
					}
				},
			});
		}
	}, [dispatch, newSolderValue, pk, router, solderByState, solderPourcentageForApi, solder_value]);

	const deleteSolderHandler = useCallback(() => {
		// dispatch delete
		const action = offerDeleteSolderAction(pk);
		dispatch({
			...action,
			onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<boolean>) => {
				if (!error && !cancelled && data) {
					router.replace(router.asPath).then(() => {
						setOpenSolderModal(false);
						setNewSolderValue('0.00');
					});
				}
			},
		});
	}, [dispatch, pk, router]);

	const solderTabHandleChange = useCallback((event: React.SyntheticEvent, solderBy: OfferSolderByType) => {
		setSolderByState(solderBy);
	}, []);

	const dropDownActions: DropDownActionType = [
		{
			icon: EditBlackSVG,
			text: 'Modifier',
			onClick: editOfferHandler,
		},
		// {
		// 	icon: pinnedIconState,
		// 	text: 'Épingler',
		// 	onClick: togglePinOfferHandler,
		// },
		// {
		// 	icon: solder_value !== null ? SolderEditActiveSVG : SolderEditInactiveSVG,
		// 	text: 'Solder',
		// 	onClick: showSolderOfferNav,
		// },
		{
			icon: SupprimerSVG,
			text: 'Supprimer',
			onClick: showDeleteOfferModal,
		},
	];

	const voirPlusHandler = (value: boolean) => {
		setVoirPlus(value);
	};

	const VoirPlusMoinButtons = () => {
		if (description && description.length > 300) {
			if (voirPlus) {
				return (
					<ThemeProvider theme={buttonTheme}>
						<Button color="primary" className={Styles.seeMoreButton} onClick={() => voirPlusHandler(false)}>
							voir moin
						</Button>
					</ThemeProvider>
				);
			} else {
				return (
					<ThemeProvider theme={buttonTheme}>
						<Button color="primary" className={Styles.seeMoreButton} onClick={() => voirPlusHandler(true)}>
							voir plus
						</Button>
					</ThemeProvider>
				);
			}
		} else {
			return null;
		}
	};

	const [addedToCart, setAddedToCart] = useState<boolean>(exist_in_cart);

	const AddServiceToCartHandler = useCallback(
		async (picked_date: string, picked_hour: string) => {
			const action = cartPostServiceRootUniqueIDAction(pk, 'S', unique_id, picked_date, picked_hour);
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackResponseType<CartPostServiceRoot>) => {
					if (!error && !cancelled && data) {
						router.replace(router.asPath).then(() => {
							setAddedToCart(true);
							dispatch(cartGetCartCounterAction(unique_id));
							setShowMobileCartModal(false);
							setShowDesktopCartModal(false);
						});
					}
				},
			});
		},
		[dispatch, pk, router, unique_id],
	);

	return (
		<ThemeProvider theme={customTheme}>
			<Stack direction="column">
				<UserMainNavigationBar />
				<main className={Styles.main}>
					{permission === 'OWNER' && (
						<Stack direction="row" justifyContent="flex-end">
							<DropDownMenu
								dropDownText="Modifier"
								dropDownIcon={EditIconSVG}
								actions={dropDownActions}
								menuID="desktop-validate-menu"
								buttonID="desktop-validate-menu-btn"
							/>
						</Stack>
					)}
					<Box className={`${Styles.pageWrapper} ${permission === 'NOT_OWNER' && Styles.removeTopMargin}`}>
						<Stack direction="row" spacing={10} className={Styles.imagesWrapper} justifyContent="center">
							<Desktop>
								<Stack direction="column" spacing={5} sx={{ maxWidth: '55%' }}>
									<Stack direction="row" spacing={3}>
										<Stack direction="column" spacing={1.8}>
											{availableThumbnails.length > 0 ? (
												availableThumbnails.map((image, index) => (
													<ImageListItem key={index}>
														{image && (
															<Image
																className={`${Styles.thumbnails} ${
																	selectedImageIndex === index ? Styles.selectedThumbnail : null
																}`}
																src={image}
																width={80}
																height={80}
																sizes="100vw"
																onClick={() => showThumbnail(index)}
																alt=""
															/>
														)}
													</ImageListItem>
												))
											) : (
												<>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
													<ImageListItem>
														<Skeleton variant="rectangular" width={80} height={80} className={Styles.thumbnails} />
													</ImageListItem>
												</>
											)}
										</Stack>
										{!selectedImage ? (
											<Box className={Styles.mainImageWrapper}>
												<Skeleton variant="rectangular" width={590} height={500} className={Styles.selectedImage} />
											</Box>
										) : (
											<Box className={Styles.mainImageWrapper}>
												<Image
													className={Styles.selectedImage}
													src={selectedImage}
													width={590}
													height={500}
													sizes="100vw"
													onClick={() => {
														showImage(selectedImage);
													}}
													alt=""
												/>
											</Box>
										)}
									</Stack>
									{clickedImage && (
										<ImageModal
											open={!!clickedImage}
											handleClose={() => setClickedImage(null)}
											direction="up"
											onBackdrop={() => setClickedImage(null)}
											fullScreen={true}
											theme={customImageModalTheme()}
											cssClasse={Styles.clickedImageModal}
										>
											<Box className={Styles.clickedImageBox}>
												<Image
													className={Styles.clickedImage}
													src={clickedImage}
													width={590}
													height={500}
													sizes="100vw"
													alt=""
												/>
											</Box>
										</ImageModal>
									)}
									{/*<NoCommentsAvailableContent />*/}
								</Stack>
							</Desktop>
							<TabletAndMobile>
								<div style={{ display: 'block', marginLeft: '0' }}>
									<>
										<Swiper
											pagination={{
												clickable: true,
												enabled: true,
												bulletActiveClass: 'activekOfferBullet',
												clickableClass: 'paginationOfferBullet',
											}}
											modules={[Navigation, Pagination, Lazy]}
											scrollbar={{ enabled: false }}
											className={Styles.swiperSlide}
										>
											{availableThumbnails.length > 0 ? (
												availableThumbnails.map((image, index) => {
													return (
														<SwiperSlide key={index}>
															<Box className={Styles.mainImageWrapper}>
																<Image
																	className={Styles.selectedImage}
																	src={image}
																	width={365}
																	height={240}
																	onClick={() => showMobileImage(availableImages[index])}
																	sizes="100vw"
																	// loading="eager"
																	// priority={true}
																	// decoding="async"
																	alt=""
																/>
															</Box>
														</SwiperSlide>
													);
												})
											) : (
												<SwiperSlide>
													<Box className={Styles.mainImageWrapper}>
														<Skeleton variant="rectangular" width={365} height={240} className={Styles.selectedImage} />
													</Box>
												</SwiperSlide>
											)}
										</Swiper>
										{clickedMobileImage && (
											<ImageModal
												open={!!clickedMobileImage}
												handleClose={() => setClickedMobileImage(null)}
												direction="up"
												onBackdrop={() => setClickedMobileImage(null)}
												fullScreen={true}
												theme={customMobileImageModalTheme()}
												cssClasse={Styles.clickedImageModal}
											>
												<Box className={Styles.clickedImageBox}>
													<Image
														className={Styles.clickedImage}
														src={clickedMobileImage}
														width={365}
														height={240}
														sizes="100vw"
														alt=""
													/>
												</Box>
											</ImageModal>
										)}
									</>
								</div>
							</TabletAndMobile>
							{/* Mobile Only */}

							<Stack direction="column" spacing={1} className={Styles.offerWrapper}>
								<Stack direction="column" spacing={4}>
									<Stack direction="column" spacing={2}>
										<Stack direction="column">
											<h1 className={Styles.title}>{title}</h1>
											{/*<Stack direction="row">*/}
											{/*	<Image src={BlackStarSVG} width={20} height={20} alt="" />*/}
											{/*	<span className={Styles.rating}>0 (0 notes)</span>*/}
											{/*</Stack>*/}
											<Link href={REAL_SHOP_BY_SHOP_LINK_ROUTE(router.query.shop_link as string)}>
												<span className={Styles.shopName}>{shop_name}</span>
											</Link>
										</Stack>
										<Stack direction="column" spacing={1}>
											<Stack direction="row" flexWrap="wrap" className={Styles.rootChipStack}>
												{categoriesListString.map((category, index) => {
													return <Chip key={index} label={category} variant="filled" className={Styles.chip} />;
												})}
											</Stack>
										</Stack>
									</Stack>
									<Stack direction="column" spacing={2} className={Styles.descriptionWrapper}>
										<Stack direction="column" spacing={1}>
											<span className={Styles.descriptionTitle}>Description</span>
											<p className={Styles.descriptionBody}>
												{!voirPlus
													? description && description.length > 300
														? description.substring(0, 300).concat('...')
														: description
													: description}
											</p>
											<Box sx={{ width: 'auto' }}>
												<VoirPlusMoinButtons />
											</Box>
										</Stack>
										<Stack direction="column" spacing={1}>
											{availabilityDays.length > 0 ? (
												<p className={Styles.colorBody}>
													<span className={Styles.colorTitle}>Quand : </span>
													{availabilityDays.join(', ')}
												</p>
											) : null}
											{morningHourFrom && morningHourTo ? (
												<p className={Styles.colorBody}>
													<span className={Styles.colorTitle}>Matin : </span>
													{`${morningHourFrom.substring(0, 5)} - ${morningHourTo.substring(0, 5)}`}
												</p>
											) : null}
											{afternoonHourFrom && afternoonHourTo ? (
												<p className={Styles.colorBody}>
													<span className={Styles.colorTitle}>Après-midi : </span>
													{`${afternoonHourFrom.substring(0, 5)} - ${afternoonHourTo.substring(0, 5)}`}
												</p>
											) : null}
											{forWhomListString.length > 0 ? (
												<p className={Styles.forWhomBody}>
													<span className={Styles.forWhomTitle}>Pour : </span>
													{forWhomListString.join(', ')}
												</p>
											) : null}
										</Stack>
									</Stack>
									<Stack direction="column" className={Styles.priceWrapper}>
										<Stack direction="row" spacing={1}>
											<span className={`${Styles.price} ${solder_value !== null && Styles.oldPrice}`}>
												{price + ' DH'}
											</span>
											<span className={Styles.solderPrice}>{solder_value !== null ? newPrice + ' DH' : null}</span>
										</Stack>
										<Stack direction="row" justifyContent="space-between">
											<span className={Styles.priceBy}>
												par {getServicePriceByData(details_offer.service_price_by)}
											</span>
										</Stack>
									</Stack>
								</Stack>
								<Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
									<Desktop>
										<div className={`${Styles.primaryButtonWrapper} ${Styles.primaryButton}`}>
											{addedToCart ? (
												<AlreadyExistsInCartButton />
											) : (
												<PrimaryButton
													buttonText="Ajouter au panier"
													active={permission !== 'OWNER'}
													onClick={() => {
														setShowDesktopCartModal(true);
													}}
												/>
											)}
										</div>
									</Desktop>
									<TabletAndMobile>
										<div className={`${Styles.primaryButtonWrapper} ${Styles.primaryButton}`}>
											{addedToCart ? (
												<AlreadyExistsInCartButton />
											) : (
												<PrimaryButton
													buttonText="Ajouter au panier"
													active={permission !== 'OWNER'}
													onClick={() => {
														setShowMobileCartModal(true);
													}}
												/>
											)}
										</div>
									</TabletAndMobile>

									<Box className={Styles.servicesMapWrapper}>
										<Stack
											direction="column"
											divider={<Divider orientation="horizontal" flexItem className={Styles.divider} />}
										>
											<ReadAdresse
												address_name={details_offer.service_address}
												longitude={details_offer.service_longitude}
												latitude={details_offer.service_latitude}
												zone_by={details_offer.service_zone_by}
												km_radius={details_offer.service_km_radius as number}
											/>
										</Stack>
									</Box>
								</Stack>
							</Stack>
						</Stack>
					</Box>
					{permission === 'OWNER' && (
						<CustomSwipeModal transition open={openSolderModal} handleClose={() => setOpenSolderModal(false)}>
							<Stack
								direction="column"
								justifyContent="space-between"
								alignContent="space-between"
								className={Styles.rootTopActionsStack}
							>
								<TopBarSaveClose
									buttonText="Terminer"
									handleClose={() => setOpenSolderModal(false)}
									handleSubmit={handleSaveSolder}
									isValid={isSolderValid}
									cssClasses={Styles.topContainer}
								/>
								<HelperDescriptionHeader
									header="Solder une offre"
									headerClasses={Styles.header}
									descriptionClasses={Styles.description}
									cssClasses={Styles.topContainer}
								/>
								<Stack direction="column" justifyContent="space-around" className={Styles.doubleTabWrapper}>
									<ThemeProvider theme={navigationTheme}>
										<BottomNavigation value={solderByState} onChange={solderTabHandleChange} showLabels>
											<BottomNavigationAction label="Prix Fixe" value="F" />
											<BottomNavigationAction label="Pourcentage" value="P" />
										</BottomNavigation>
									</ThemeProvider>
									{solderByState === 'F' ? (
										<Stack
											direction="column"
											spacing={1}
											sx={{ margin: '12px 32px 12px', height: '100%' }}
											justifyContent="space-between"
										>
											<Stack direction="column" spacing={1} alignItems="center">
												<CurrencyInput
													className={Styles.priceInputField}
													id="solder-fix"
													name="solder-fix"
													placeholder="0.00"
													value={newSolderValue}
													decimalsLimit={2}
													onValueChange={(value) => {
														if (value) {
															if (price) {
																if ((price as number) <= parseFloat(value)) {
																	return;
																}
															}
															setNewSolderValue(value);
														} else {
															setNewSolderValue('0.00');
														}
														setIsSolderValid(true);
													}}
												/>
												{price ? (
													<>
														<p className={Styles.oldSolderValue}>{price} DH</p>
														<p className={Styles.oldSolderText}>ancien prix</p>
													</>
												) : null}
											</Stack>
											{solder_value ? (
												<Button onClick={deleteSolderHandler} color="primary" className={Styles.cancelButton}>
													Annuler la réduction
												</Button>
											) : null}
										</Stack>
									) : (
										<Stack
											direction="column"
											spacing={1}
											sx={{ margin: '12px 32px 12px', height: '100%' }}
											justifyContent="space-between"
										>
											<Stack direction="column" spacing={1} alignItems="center">
												<CurrencyInput
													className={Styles.priceInputField}
													id="solder-pourcentage"
													name="solder-pourcentage"
													readOnly={true}
													placeholder="0.00"
													value={newSolderValue}
													decimalsLimit={2}
												/>
												{price ? (
													<>
														<p className={Styles.oldSolderValue}>{price} DH</p>
														<p className={Styles.oldSolderText}>ancien prix</p>
													</>
												) : null}
												<ThemeProvider theme={SolderPourcentageChipTheme()}>
													{/* TODO check rowSpacing */}
													<Grid
														container
														rowSpacing={2}
														wrap="wrap"
														justifyContent="center"
														alignItems="center"
														className={Styles.rootGridChip}
													>
														<Grid item xs="auto">
															<Chip
																label="-5 %"
																variant={fivePourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	// setDeliveryPriceState('0');
																	setSolderPourcentageInput('5');
																}}
																size="medium"
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-10 %"
																variant={tenPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('10');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-20 %"
																variant={twentyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('20');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-30 %"
																variant={thirtyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('30');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-50 %"
																variant={fiftyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('50');
																}}
															/>
														</Grid>
														<Grid item xs="auto">
															<Chip
																label="-70 %"
																variant={seventyPourcentSolder ? 'filled' : 'outlined'}
																onClick={() => {
																	setSolderPourcentageInput('70');
																}}
															/>
														</Grid>
													</Grid>
												</ThemeProvider>
												{/*<Stack direction="row" justifyContent="center" sx={{ marginTop: '2rem !important' }}>*/}
												{/*	<ThemeProvider theme={customPourcentageTheme}>*/}
												{/*		<TextField*/}
												{/*			inputMode="numeric"*/}
												{/*			inputProps={{ min: 1, max: 99 }}*/}
												{/*			ref={customPourcentageInput}*/}
												{/*			color="primary"*/}
												{/*			placeholder="Autre"*/}
												{/*			value={customPourcentageState}*/}
												{/*			onChange={(e) => {*/}
												{/*				let value = parseInt(e.target.value, 10);*/}
												{/*				if (value > 99) value = 99;*/}
												{/*				if (value < 1) value = 1;*/}
												{/*				setCustomPourcentageState(value.toString());*/}
												{/*				setSolderPourcentageInput(value.toString());*/}
												{/*			}}*/}
												{/*			// variant="standard"*/}
												{/*			fullWidth={false}*/}
												{/*			size="medium"*/}
												{/*			type="number"*/}
												{/*			className={Styles.customField}*/}
												{/*			disabled={*/}
												{/*				fivePourcentSolder ||*/}
												{/*				tenPourcentSolder ||*/}
												{/*				twentyPourcentSolder ||*/}
												{/*				thirtyPourcentSolder ||*/}
												{/*				fiftyPourcentSolder ||*/}
												{/*				seventyPourcentSolder*/}
												{/*			}*/}
												{/*		/>*/}
												{/*	</ThemeProvider>*/}
												{/*</Stack>*/}
											</Stack>
											{solder_value ? (
												<Button onClick={deleteSolderHandler} color="primary" className={Styles.cancelButton}>
													Annuler la réduction
												</Button>
											) : null}
										</Stack>
									)}
								</Stack>
							</Stack>
						</CustomSwipeModal>
					)}
					{showDeleteModal && permission === 'OWNER' ? (
						<ActionModals title="Supprimer cette offre ?" actions={deleteModalActions} />
					) : null}
					{/* Solder modal */}
				</main>
				<CustomFooter />
				{/* Desktop Cart Modal */}
				<Desktop>
					<Box>
						<CustomSwipeModal
							transition
							showCloseIcon
							direction="left"
							open={showDesktopCartModal}
							handleClose={() => setShowDesktopCartModal(false)}
						>
							<GetServiceCart
								availabilityDays={availabilityDays}
								morningHourFrom={morningHourFrom}
								morningHourTo={morningHourTo}
								afternoonHourFrom={afternoonHourFrom}
								afternoonHourTo={afternoonHourTo}
								AddServiceToCartHandler={AddServiceToCartHandler}
							/>
						</CustomSwipeModal>
					</Box>
				</Desktop>
				{/* Mobile Cart Modal */}
				<TabletAndMobile>
					<Box>
						<CustomSwipeModal
							theme={customCartTheme}
							showCloseIcon
							fullScreen={true}
							transition={false}
							open={showMobileCartModal}
							handleClose={() => setShowMobileCartModal(false)}
						>
							<GetServiceCart
								availabilityDays={availabilityDays}
								morningHourFrom={morningHourFrom}
								morningHourTo={morningHourTo}
								afternoonHourFrom={afternoonHourFrom}
								afternoonHourTo={afternoonHourTo}
								AddServiceToCartHandler={AddServiceToCartHandler}
							/>
						</CustomSwipeModal>
					</Box>
				</TabletAndMobile>
			</Stack>
		</ThemeProvider>
	);
};

type IndexPropsType = {
	pageProps: {
		permission: 'OWNER' | 'NOT_OWNER';
		data: OfferGetRootProductInterface | OfferGetRootServiceInterface;
		unique_id: string | null;
	};
};
const Index: NextPage<IndexPropsType> = (props: IndexPropsType) => {
	const { permission, data, unique_id } = props.pageProps;
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (permission === 'OWNER' && data) {
			dispatch(setSelectedOfferAction(data));
		}
	}, [data, dispatch, permission]);

	if (data) {
		if (data.offer_type === 'V') {
			return <Product data={data as OfferGetRootProductInterface} permission={permission} unique_id={unique_id} />;
		} else {
			return <Service data={data as OfferGetRootServiceInterface} permission={permission} unique_id={unique_id} />;
		}
	} else {
		return (
			<ApiProgress
				cssStyle={{ position: 'absolute', top: '50%', left: '50%' }}
				backdropColor="#FFFFFF"
				circularColor="#0D070B"
			/>
		);
	}
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const appToken = getServerSideCookieTokens(context);
	const options: CookieSerializeOptions = {
		httpOnly: true,
		maxAge: 30 * 24 * 60 * 60,
		secure: process.env.NODE_ENV !== 'development',
		path: '/',
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		sameSite: 'lax',
	};
	try {
		if (appToken.tokenType === 'TOKEN' && appToken.initStateToken.access !== null) {
			const instance = isAuthenticatedInstance(appToken.initStateToken);
			const url = `${process.env.NEXT_PUBLIC_OFFER_ROOT}/${context.params?.shop_link}/${context.params?.offer_pk}/`;
			const check_url = `${process.env.NEXT_PUBLIC_ACCOUNT_CHECK_ACCOUNT}`;
			const response: OfferGetRootProductResponseType | OfferGetRootServiceResponseType = await getApi(url, instance);
			const authResponse: AccountGetCheckAccountResponseType = await getApi(check_url, instance);
			if (authResponse.status === 200 && response.status === 200) {
				if (authResponse.data.pk === response.data.user_pk) {
					return {
						props: {
							permission: 'OWNER',
							data: response.data,
							unique_id: null,
						},
					};
				} else {
					return {
						props: {
							permission: 'NOT_OWNER',
							data: response.data,
							unique_id: null,
						},
					};
				}
			}
		} else {
			let unique_id = getCookie('@unique_id', { req: context.req, res: context.res });
			const url = `${process.env.NEXT_PUBLIC_OFFER_ROOT}/${context.params?.shop_link}/${context.params?.offer_pk}/${
				unique_id ? `${unique_id}/` : ''
			}`;
			const base_url = `${process.env.NEXT_PUBLIC_ROOT_API_URL}`;
			const instance = defaultInstance(base_url);
			const response: OfferGetRootProductResponseType | OfferGetRootServiceResponseType = await getApi(url, instance);
			if (response.status === 200) {
				if (!unique_id) {
					unique_id = response.data.unique_id;
					context.res.setHeader('Set-Cookie', serialize('@unique_id', unique_id, options));
				}
				return {
					props: {
						permission: 'NOT_OWNER',
						data: response.data,
						unique_id: unique_id,
					},
				};
			}
		}
	} catch (e) {
		return {
			redirect: {
				permanent: false,
				destination: NOT_FOUND_404,
			},
			props: {},
		};
	}


	// const url = `${process.env.NEXT_PUBLIC_OFFER_ROOT}/${context.params?.shop_link}/${context.params?.offer_pk}/${
	// 	unique_id ? `${unique_id}/` : ''
	// }`;
	// try {
	// 	const response: OfferGetRootProductResponseType | OfferGetRootServiceResponseType = await getApi(url, instance);
	// 	if (appToken.tokenType === 'TOKEN' && appToken.initStateToken.access !== null) {
	// 		const isAuthInstance = isAuthenticatedInstance(appToken.initStateToken);
	// 		const authResponse: AccountGetCheckAccountResponseType = await getApi(check_url, isAuthInstance);
	// 		if (authResponse.status === 200 && response.status === 200) {
	// 			if (!unique_id) {
	// 				unique_id = response.data.unique_id;
	// 				context.res.setHeader('Set-Cookie', serialize('@unique_id', unique_id, options));
	// 			}
	// 			if (authResponse.data.pk === response.data.user_pk) {
	// 				return {
	// 					props: {
	// 						permission: 'OWNER',
	// 						data: response.data,
	// 						unique_id: unique_id,
	// 					},
	// 				};
	// 			} else {
	// 				return {
	// 					props: {
	// 						permission: 'NOT_OWNER',
	// 						data: response.data,
	// 						unique_id: unique_id,
	// 					},
	// 				};
	// 			}
	// 		}
	// 	} else {
	// 		if (response.status === 200) {
	// 			if (!unique_id) {
	// 				unique_id = response.data.unique_id;
	// 				context.res.setHeader('Set-Cookie', serialize('@unique_id', unique_id, options));
	// 			}
	// 			return {
	// 				props: {
	// 					permission: 'NOT_OWNER',
	// 					data: response.data,
	// 					unique_id: unique_id,
	// 				},
	// 			};
	// 		}
	// 	}
	// } catch (e) {
	// 	return {
	// 		redirect: {
	// 			permanent: false,
	// 			destination: NOT_FOUND_404,
	// 		},
	// 		props: {},
	// 	};
	// }
}

export default Index;
