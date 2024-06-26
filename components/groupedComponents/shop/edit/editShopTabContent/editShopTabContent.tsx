import React, { useEffect, useState, useCallback } from 'react';
import Styles from './editShopTabContent.module.sass';
import ShopFilterSelect from '../../../temp-shop/edit/shopFilterSelect/shopFilterSelect';
import { Box, Button, Grid, Skeleton, Stack, ThemeProvider } from '@mui/material';
import {
	GetOffersSagaCallBackOnCompleteDataType,
	OfferGetAvailableShopFiltersType,
	OfferGetMyOffersProductServiceType,
} from '../../../../../types/offer/offerTypes';
import Link from 'next/link';
import Image from 'next/image';
import PinActiveIconSVG from '../../../../../public/assets/svgs/globalIcons/pin-active.svg';
import { useRouter } from 'next/router';
import CreatorIconSVG from '../../../../../public/assets/svgs/globalIcons/creator.svg';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import {
	offerGetAvailableFiltersByShopID,
	// offerGetLastThreeUsedDeliveriesAction,
	offerGetOffersByShopIDWithQueryParamsAction,
	offerPostPinAction,
	setEmptyUserLocalOffer,
} from '../../../../../store/actions/offer/offerActions';
import { getDefaultTheme } from '../../../../../utils/themes';
import SeoAnchorWrapper from '../../../../htmlElements/buttons/seoAnchorWrapper/seoAnchorWrapper';
import { Desktop, generateOffersFilterQueryParams, getBackendNextPageNumber } from "../../../../../utils/helpers";
import ApiProgress from '../../../../formikElements/apiLoadingResponseOrError/apiProgress/apiProgress';
import { Iterables } from 'langx-js';
import { ApiErrorResponseType, OfferPinSagaCallBackType } from '../../../../../types/_init/_initTypes';
import AccordionFilter from '../../../../layouts/accordionFilter/accordionFilter';
import CustomSwipeModal from '../../../../desktop/modals/rightSwipeModal/customSwipeModal';
import CloseSVG from '../../../../../public/assets/svgs/navigationIcons/close.svg';
import CenteredInfoAction from '../../../temp-shop/create/centeredInfoAction/centeredInfoAction';
import BorderIconAnchorButton from '../../../../htmlElements/buttons/borderIconAnchorButton/borderIconAnchorButton';
import ActivatedAddIconSVG from '../../../../../public/assets/svgs/globalIcons/blue-add.svg';
import { REAL_OFFER_ADD_INDEX, REAL_OFFER_ROUTE } from '../../../../../utils/routes';
import LargeBorderIconAnchorButton from '../../../../htmlElements/buttons/largeBorderIconAnchorButton/largeBorderIconAnchorButton';
import PinInactiveIconSVG from '../../../../../public/assets/svgs/globalIcons/pin-inactive.svg';
import { ParsedUrlQueryInput } from 'querystring';
import { getWsOfferThumbnail } from '../../../../../store/selectors';

type offerLinkedHashMapType = {
	offersMap: Iterables.LinkedHashMap<number, OfferGetMyOffersProductServiceType> | null;
	count: number;
	nextPage: string | null;
};

type Props = {
	shop_pk: number | string;
	activeColor: string;
	openFilterModal: boolean;
	setOpenFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
	setShowMobileFilterButton: React.Dispatch<React.SetStateAction<boolean>>;
	children?: React.ReactNode;
};

const availableFiltersInit: OfferGetAvailableShopFiltersType = {
	available_categories: [],
	available_colors: [],
	available_sizes: [],
	available_for_whom: [],
	available_solder: false,
	available_labels: false,
	available_made_in_maroc: false,
	available_cities: [],
	available_services: false,
};

const EditShopTabContent: React.FC<Props> = (props: Props) => {
	const { shop_pk, setShowMobileFilterButton, setOpenFilterModal } = props;
	const router = useRouter();
	const [filter, setFilter] = useState<'D' | 'C'>('D');
	const dispatch = useAppDispatch();
	const [loadMoreState, setLoadMoreState] = useState<boolean>(false);
	const [filterChanged, setFilterChanged] = useState<boolean>(false);
	const [firstPageLoaded, setFirstPageLoaded] = useState<boolean>(false);
	const [isLoadingInitInProgress, setIsLoadingInitInProgress] = useState<boolean>(true);
	const [isLoadingNextPageInProgress, setIsLoadingNextPageInProgress] = useState<boolean>(false);
	const [offersLinkedHashMap, setOffersLinkedHashMap] = useState<offerLinkedHashMapType>({
		count: 0,
		nextPage: null,
		offersMap: null,
	});
	const [availableFiltersFetched, setAvailableFiltersFetched] = useState<boolean>(false);
	const [availableFilters, setAvailableFilters] = useState<OfferGetAvailableShopFiltersType>(availableFiltersInit);
	const [applyFiltersClicked, setApplyFiltersClicked] = useState<boolean>(false);
	const [availableFiltersHasData, setAvailableFiltersHasData] = useState<boolean>(false);
	const wsThumbnail = useAppSelector(getWsOfferThumbnail);
	const [lastWSID, setLastWSID] = useState<number | null>(null);

	useEffect(() => {
		if (wsThumbnail && (!lastWSID || lastWSID !== wsThumbnail.pk)) {
			setLastWSID(wsThumbnail.pk);
		}
		if (!availableFiltersFetched) {
			const action = offerGetAvailableFiltersByShopID(shop_pk as number);
			dispatch({
				...action,
				onComplete: ({
					error,
					cancelled,
					data,
				}: {
					error: ApiErrorResponseType;
					cancelled: boolean;
					data: OfferGetAvailableShopFiltersType;
				}) => {
					if (!error && !cancelled && data) {
						setAvailableFilters(data);
						setAvailableFiltersHasData(true);
					}
				},
			});
			setAvailableFiltersFetched(true);
		}

		const getOffers = (isReset = false) => {
			const { count, nextPage, offersMap } = offersLinkedHashMap;
			// is reset = false.
			// offers map is full
			// count > 0
			// offers map size >= count
			if (!isReset && offersMap !== null && count > 0 && offersMap.size() >= count) {
				return;
			}
			let url = `${process.env.NEXT_PUBLIC_OFFER_OFFERS}${shop_pk}/`;
			let queryParams: string;
			if (nextPage !== null && !isReset) {
				queryParams = generateOffersFilterQueryParams(router.query, nextPage);
				url += queryParams;
			} else {
				queryParams = generateOffersFilterQueryParams(router.query);
				url += queryParams;
			}
			const action = offerGetOffersByShopIDWithQueryParamsAction(url);
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: GetOffersSagaCallBackOnCompleteDataType) => {
					if (!error && !cancelled && data) {
						let map: Iterables.LinkedHashMap<number, OfferGetMyOffersProductServiceType>;
						if (offersMap === null || isReset) {
							map = new Iterables.LinkedHashMap<number, OfferGetMyOffersProductServiceType>();
						} else {
							map = offersMap;
						}
						data.results.map((offer) => {
							map.put(offer.pk, offer);
						});
						const result = {
							offersMap: map,
							nextPage: getBackendNextPageNumber(data.next),
							count: data.count,
						};
						setOffersLinkedHashMap(result);
						setIsLoadingNextPageInProgress(false);
						if (isReset) {
							setIsLoadingInitInProgress(false);
							setFirstPageLoaded(true);
						}
					}
				},
			});
		};

		const loadFirstPage = () => {
			getOffers(true);
		};

		// on page first load
		if (!firstPageLoaded) {
			loadFirstPage();
		}

		// load more pressed
		if (loadMoreState) {
			if (offersLinkedHashMap.offersMap) {
				const isReset = offersLinkedHashMap.offersMap.size() >= offersLinkedHashMap.count;
				getOffers(isReset);
			}
			setLoadMoreState(false);
		}

		// price filter changed
		if (filterChanged) {
			loadFirstPage();
			setFilterChanged(false);
		}
		if (applyFiltersClicked) {
			loadFirstPage();
			setApplyFiltersClicked(false);
		}
		if (offersLinkedHashMap.offersMap?.isEmpty()) {
			setShowMobileFilterButton(false);
		} else {
			setShowMobileFilterButton(true);
		}
	}, [
		applyFiltersClicked,
		availableFiltersFetched,
		dispatch,
		filterChanged,
		firstPageLoaded,
		lastWSID,
		loadMoreState,
		offersLinkedHashMap,
		router.query,
		setShowMobileFilterButton,
		shop_pk,
		wsThumbnail,
	]);

	const filterOnChange = useCallback(
		(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent | React.FocusEvent | null, value: string) => {
			setFilter(value as 'D' | 'C');
			// default prix decroissant.
			// -price = D
			// price = T
			const queryParams: ParsedUrlQueryInput = {
				// shop_link: router.query.shop_link,
				// sort_by: '-price',
				...router.query,
			};
			const options = { shallow: true, scroll: false };

			if (router.query.page) {
				if (value === 'D') {
					router.replace({ query: { ...queryParams, sort_by: '-price' } }, undefined, options).then(() => {
						setFilterChanged(true);
					});
				} else {
					router.replace({ query: { ...queryParams, sort_by: 'price' } }, undefined, options).then(() => {
						setFilterChanged(true);
					});
				}
			} else {
				if (value === 'D') {
					router.replace({ query: { ...queryParams, sort_by: '-price' } }, undefined, options).then(() => {
						setFilterChanged(true);
					});
				} else {
					router.replace({ query: { ...queryParams, sort_by: 'price' } }, undefined, options).then(() => {
						setFilterChanged(true);
					});
				}
			}
		},
		[router],
	);

	// const [searchValue, setSearchValue] = useState<string>('');

	// const closeMobileFilterModal = () => {
	// 	props.setOpenFilterModal(false);
	// };

	const closeMobileFilterModal = useCallback(() => {
		setOpenFilterModal(false);
	}, [setOpenFilterModal]);

	// const togglePinHandler = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, pk: number) => {
	// 	e.preventDefault();
	// 	const action = offerPostPinAction(pk);
	// 	dispatch({
	// 		...action,
	// 		onComplete: ({ error, cancelled, data }: OfferPinSagaCallBackType) => {
	// 			if (!error && !cancelled && data) {
	// 				if (offersLinkedHashMap.offersMap) {
	// 					const userOfferIndex = offersLinkedHashMap.offersMap
	// 						.entrySet()
	// 						.toArray()
	// 						.findIndex((item) => item.value?.pk === pk);
	// 					if (userOfferIndex >= 0) {
	// 						const map = offersLinkedHashMap.offersMap.entrySet().toArray()[userOfferIndex];
	// 						if (map.value) {
	// 							map.value.pinned = data.pinned;
	// 							offersLinkedHashMap.offersMap.put(pk, map.value);
	// 							offersLinkedHashMap.offersMap
	// 								.entrySet()
	// 								.toArray()
	// 								.sort((a, b) => Number(b.value?.pinned) - Number(a.value?.pinned));
	// 							setOffersLinkedHashMap(offersLinkedHashMap);
	// 							router
	// 								.replace(router.asPath, undefined, {
	// 									scroll: false,
	// 								})
	// 								.then();
	// 						}
	// 					}
	// 				}
	// 			}
	// 		},
	// 	});
	// };

	const togglePinHandler = useCallback(
		(e: React.MouseEvent<HTMLImageElement, MouseEvent>, pk: number) => {
			e.preventDefault();
			const action = offerPostPinAction(pk);
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: OfferPinSagaCallBackType) => {
					if (!error && !cancelled && data) {
						if (offersLinkedHashMap.offersMap) {
							const userOfferIndex = offersLinkedHashMap.offersMap
								.entrySet()
								.toArray()
								.findIndex((item) => item.value?.pk === pk);
							if (userOfferIndex >= 0) {
								const map = offersLinkedHashMap.offersMap.entrySet().toArray()[userOfferIndex];
								if (map.value) {
									map.value.pinned = data.pinned;
									offersLinkedHashMap.offersMap.put(pk, map.value);
									offersLinkedHashMap.offersMap
										.entrySet()
										.toArray()
										.sort((a, b) => Number(b.value?.pinned) - Number(a.value?.pinned));
									setOffersLinkedHashMap(offersLinkedHashMap);
									router
										.replace(router.asPath, undefined, {
											scroll: false,
										})
										.then();
								}
							}
						}
					}
				},
			});
		},
		[dispatch, offersLinkedHashMap, router],
	);

	return (
		<>
			{(isLoadingInitInProgress || isLoadingNextPageInProgress) && (!availableFiltersFetched) && (
				<ApiProgress
					cssStyle={{ position: 'absolute', top: '50%', left: '50%' }}
					backdropColor="#FFFFFF"
					circularColor="#0D070B"
				/>
			)}
			<Box sx={{ minHeight: '450px' }}>
				{!offersLinkedHashMap.offersMap?.isEmpty() && firstPageLoaded ? (
					<>
						<Desktop>
							<Stack
							className={Styles.filterWrapper}
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<span className={Styles.filterText}>Filtrer</span>
							<ShopFilterSelect
								onChange={(e, value) => {
									filterOnChange(e, value as 'D' | 'C');
								}}
								state={filter}
								setStateHandler={setFilter}
								activeHoverColor={props.activeColor}
							/>
						</Stack>
						</Desktop>
						<Stack direction="row" justifyContent="space-between" className={Styles.rootShopFilterWrapper}>
							{availableFiltersHasData && (
								<Desktop>
										<Stack direction="column" className={Styles.shopFilterWrapperDesktopOnly}>
											<AccordionFilter
												filterFor="SHOPS"
												availableFilters={availableFilters}
												setApplyFiltersClicked={setApplyFiltersClicked}
											/>
									</Stack>
								</Desktop>
							)}
							<div className={`${offersLinkedHashMap.nextPage ? Styles.gridInStack : Styles.gridInBlock}`}>
								<Grid container wrap="wrap" className={Styles.gridRoot}>
									<Grid item xs="auto" className={Styles.gridButtonAddAnOfferWrapper}>
										<LargeBorderIconAnchorButton
											buttonText="Ajouter un article"
											svgIcon={ActivatedAddIconSVG}
											active={true}
											onClick={() => {
												dispatch(setEmptyUserLocalOffer());
											}}
											nextPage={REAL_OFFER_ADD_INDEX(router.query.shop_link as string)}
										/>
									</Grid>
									{offersLinkedHashMap.offersMap
										?.entrySet()
										.toArray()
										.map((data) => {
											if (data.value) {
												const { price, solder_type, solder_value } = data.value;
												let newPrice = 0;
												if (solder_type !== null && solder_value !== null) {
													if (solder_type === 'F') {
														newPrice = price - solder_value;
													} else if (solder_type === 'P') {
														newPrice = price - (price * solder_value) / 100;
													}
												}
												return (
													<Link
														href={REAL_OFFER_ROUTE(router.query.shop_link as string, encodeURIComponent(data.key))}
														key={data.key}
														className={Styles.gridCardOfferWrapper}
														shallow={true}
														scroll={false}
													>
														<Grid item xs="auto" className={Styles.mobileGridRoot}>
															<Stack direction="column" spacing={2}>
																<Box className={Styles.thumbnailWrapper}>
																	{data.value.pinned ? (
																		<Image
																			src={PinActiveIconSVG}
																			alt=""
																			width={32}
																			height={32}
																			className={Styles.thumbnailActionIcon}
																			onClick={(e) => togglePinHandler(e, data.key)}
																		/>
																	) : (
																		<Image
																			src={PinInactiveIconSVG}
																			alt=""
																			width={32}
																			height={32}
																			className={Styles.thumbnailActionIcon}
																			onClick={(e) => togglePinHandler(e, data.key)}
																		/>
																	)}
																	<Box sx={{ position: 'relative', height: '100%', borderRadius: '20px' }}>
																		{data.value.thumbnail || data.key === wsThumbnail?.pk ? (
																			<Image
																				src={
																					data.value.thumbnail ? data.value.thumbnail : (wsThumbnail?.picture as string)
																				}
																				alt=""
																				width="0"
																				height="0"
																				sizes="100vw"
																				className={Styles.offerThumb}
																				loading="eager"
																				priority={true}
																			/>
																		) : (
																			<Skeleton
																				animation="wave"
																				variant="rectangular"
																				width={250}
																				height={165}
																				className={Styles.offerThumb}
																			/>
																		)}
																	</Box>
																	{data.value.creator_label && (
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
																<Stack direction="column" spacing={0}>
																	<span className={Styles.offerTitle}>
																		{data.value.title}
																	</span>
																	<Stack direction="row" spacing={1}>
																		<span
																			className={`${Styles.offerPrice} ${
																				data.value.solder_value !== null && Styles.oldPrice
																			}`}
																		>
																			{data.value.price + ' DH'}
																		</span>
																		<span className={Styles.solderPrice}>
																			{data.value.solder_value !== null ? newPrice + ' DH' : null}
																		</span>
																	</Stack>
																</Stack>
															</Stack>
														</Grid>
													</Link>
												);
											} else {
												setShowMobileFilterButton(false);
											}
										})}
								</Grid>
								{offersLinkedHashMap.nextPage && (
									<ThemeProvider theme={getDefaultTheme()}>
										<Stack direction="row" justifyContent="center" alignItems="center" mt={2}>
											<SeoAnchorWrapper
												href={{
													query: {
														// shop_link: router.query.shop_link,
														// sort_by: `${filter === 'D' ? '-price' : 'price'}`,
														...router.query,
														page: offersLinkedHashMap.nextPage,
													},
												}}
												replace={true}
												scroll={false}
												shallow={true}
											>
												<Button
													variant="text"
													color="primary"
													className={Styles.loadMoreButton}
													onClick={() => {
														setLoadMoreState(true);
														setIsLoadingNextPageInProgress(true);
													}}
												>
													Charger plus
												</Button>
											</SeoAnchorWrapper>
										</Stack>
									</ThemeProvider>
								)}
							</div>
						</Stack>
					</>
				) : (
					!isLoadingInitInProgress && (
						<>
							<div className={Styles.shopAddOfferWrapper}>
								<div className={Styles.addOfferContainer}>
									<div className={Styles.centeredInfoActionWrapper}>
										<CenteredInfoAction
											header="Démarrer votre boutique"
											subHeader="Ajoutez votre premier article !"
											cssHeaderClass={Styles.infoHeader}
											cssSubHeaderClass={Styles.infoSubHeader}
										/>
										<BorderIconAnchorButton
											buttonText="Ajouter un article"
											svgIcon={ActivatedAddIconSVG}
											active={true}
											nextPage={REAL_OFFER_ADD_INDEX(router.query.shop_link as string)}
										/>
									</div>
								</div>
							</div>
						</>
					)
				)}
				{/* Mobile filter MODAL */}
				{availableFiltersHasData && (
					<CustomSwipeModal
						transition
						open={props.openFilterModal}
						handleClose={() => setOpenFilterModal(false)}
						keepMounted={true}
					>
						<Stack
							className={Styles.mobileFilterRootStack}
							direction="column"
							justifyContent="space-between"
							alignContent="space-between"
						>
							<Box className={Styles.closeButtonWrapper}>
								<Image
									src={CloseSVG}
									width={40}
									height={40}
									alt=""
									onClick={() => setOpenFilterModal(false)}
									style={{ cursor: 'pointer' }}
								/>
							</Box>
							<h5 className={Styles.mobileFilterHeader}>Filtrer</h5>
							<ShopFilterSelect
								onChange={(e, value) => {
									filterOnChange(e, value as 'D' | 'C');
								}}
								state={filter}
								setStateHandler={setFilter}
								activeHoverColor={props.activeColor}
							/>
							<AccordionFilter
								filterFor="SHOPS"
								availableFilters={availableFilters}
								setApplyFiltersClicked={setApplyFiltersClicked}
								closeModal={closeMobileFilterModal}
							/>
						</Stack>
					</CustomSwipeModal>
				)}
				{/* END EDIT CONTENT MODAL */}
			</Box>
		</>
	);
};
export default EditShopTabContent;
