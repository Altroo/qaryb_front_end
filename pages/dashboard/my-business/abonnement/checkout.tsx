import React, { useState, useEffect, useCallback } from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import {
	Desktop,
	getServerSideCookieTokens,
	isAuthenticatedInstance,
	setFormikAutoErrors,
	TabletAndMobile,
} from '../../../../utils/helpers';
import {
	AUTH_LOGIN,
	DASHBOARD_INDEXED_OFFERS,
	DASHBOARD_SUBSCRIPTION,
	DASHBOARD_SUBSCRIPTION_PAY_VIA_VIREMENT,
	NOT_FOUND_404,
} from '../../../../utils/routes';
import { AccountGetCheckAccountResponseType } from '../../../../types/account/accountTypes';
import { cookiesPoster, getApi } from '../../../../store/services/_init/_initAPI';
import {
	availableSubscriptionPlanType,
	SagaCallBackOnCompleteCheckPromoCodeType,
	SagaCallBackOnCompletePostSubscriptionType,
	SagaCallBackOnCompleteSubscriptionByNbrArticleType,
} from '../../../../types/subscription/subscriptionTypes';
import { Stack, Box, AlertColor, ThemeProvider, InputAdornment, IconButton } from '@mui/material';
import UserMainNavigationBar from '../../../../components/layouts/userMainNavigationBar/userMainNavigationBar';
import SharedStyles from '../../../../styles/dashboard/dashboard.module.sass';
import Styles from '../../../../styles/dashboard/subscription.module.sass';
import { useAppDispatch, useAppSelector } from '../../../../utils/hooks';
import { useFormik } from 'formik';
import { promoCodeSchema, subscriptionSchema } from '../../../../utils/formValidationSchemas';
import { getAvailableCountries } from '../../../../store/selectors';
import { coordonneeTextInputTheme, offerForWhomDropdownTheme, promoCodeTextInputTheme } from '../../../../utils/themes';
import { placesGetCountriesAction } from '../../../../store/actions/places/placesActions';
import CustomTextInput from '../../../../components/formikElements/customTextInput/customTextInput';
import { SelectChangeEvent } from '@mui/material/Select';
import CustomSingleCountrySelect from '../../../../components/groupedComponents/offer/customSingleCountrySelect/customSingleCountrySelect';
import CustomTextMaskInput from '../../../../components/formikElements/customTextMaskInput/customTextMaskInput';
import RadioCheckButton from '../../../../components/htmlElements/buttons/radioCheckButton/radioCheckButton';
import PrimaryButton from '../../../../components/htmlElements/buttons/primaryButton/primaryButton';
import CustomFooter from '../../../../components/layouts/footer/customFooter';
import Divider from '@mui/material/Divider';
import {
	subscriptionGetSubscriptionByNbrArticle,
	subscriptionPostCheckPromoCode,
	subscriptionPostRootAction,
} from '../../../../store/actions/subscription/subscriptionActions';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import { Check, Close } from '@mui/icons-material';

const inputTheme = coordonneeTextInputTheme();
const promoCodeTheme = promoCodeTextInputTheme();

type PackArticlesCardContentType = {
	is_subscribed: boolean;
	nbr_article: number;
	prix_unitaire_ttc: number;
	pourcentage: number;
};

const PackArticlesCardContent: React.FC<PackArticlesCardContentType> = (props: PackArticlesCardContentType) => {
	const { nbr_article, pourcentage, prix_unitaire_ttc, is_subscribed } = props;
	const articlesLabel = nbr_article === 1 ? 'article' : 'articles';

	return (
		<Box className={Styles.articlesPackBox} sx={{ backgroundColor: `${!is_subscribed ? '#FFD9A2' : '#F3D8E1'}` }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Stack direction="column" spacing="5px">
					<span className={Styles.articlesPackSpan}>
						Pack {nbr_article} {articlesLabel}
					</span>
					<Box className={Styles.pourcentageBox}>
						<span>Save {pourcentage}%</span>
					</Box>
				</Stack>
				<Stack direction="row" spacing="5px" alignItems="center">
					<span className={Styles.pricePerArticleTTC}>{prix_unitaire_ttc}</span>
					<Box>
						<Desktop>
							<span className={Styles.pricePerArticleValue}>DH /article</span>
						</Desktop>
						<TabletAndMobile>
							<span className={Styles.pricePerArticleValue}>DH /art</span>
						</TabletAndMobile>
					</Box>
				</Stack>
			</Stack>
		</Box>
	);
};

type CheckoutProps = {
	pageProps: {
		pickedSubscription: Omit<availableSubscriptionPlanType, 'pk'>;
		is_subscribed: boolean;
		first_name: string;
		last_name: string;
		city: string | null;
		country: string | null;
	};
};

const Checkout: NextPage<CheckoutProps> = (props: CheckoutProps) => {
	const { pickedSubscription, is_subscribed, first_name, last_name, country, city } = props.pageProps;
	const { nbr_article, prix_ttc, prix_unitaire_ttc, pourcentage } = pickedSubscription;

	const [nbrArticleState, setNbrArticleState] = useState<number>(nbr_article);
	const [prixTTCState, setPrixTTCState] = useState<number>(prix_ttc);
	const [prixUnitaireTTCState, setPrixUnitaireTTCState] = useState<number>(prix_unitaire_ttc);
	const [pourcentageState, setPourcentageState] = useState<number>(pourcentage);

	const router = useRouter();
	const dispatch = useAppDispatch();
	const availableCountries = useAppSelector(getAvailableCountries);
	const [reductionState, setReductionState] = useState<number | undefined>(undefined);

	const [paymentParCarte, setPaymentParCarte] = useState<boolean>(false);
	const [paymentParVirement, setPaymentParVirement] = useState<boolean>(true); // default checked
	const [showPromoCodeMessage, setShowPromoCodeMessage] = useState<AlertColor | null>(null);

	/* formik promo code */
	const formikPromoCode = useFormik({
		initialValues: {
			promo_code: '',
		},
		validateOnMount: true,
		validationSchema: promoCodeSchema,
		onSubmit: async (values, { setSubmitting, setFieldError }) => {
			const action = subscriptionPostCheckPromoCode(values.promo_code);
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackOnCompleteCheckPromoCodeType) => {
					if (!error && !cancelled && data) {
						if (data.validity && data.type && data.value) {
							if (data.type === 'S') {
								/* Removed
								} else if (nbrArticleState > data.value) {
									setNbrArticleState(nbrArticleState - data.value);
									setReductionState(prix_ttc);
								 */
								if (nbrArticleState === data.value) {
									setReductionState(prixTTCState);
									setShowPromoCodeMessage('success');
									return;
								} else {
									const action = subscriptionGetSubscriptionByNbrArticle(data.value);
									dispatch({
										...action,
										onComplete: ({ error, cancelled, data }: SagaCallBackOnCompleteSubscriptionByNbrArticleType) => {
											if (!error && !cancelled && data) {
												setNbrArticleState(data.nbr_article);
												setPrixTTCState(data.prix_ttc);
												setPrixUnitaireTTCState(data.prix_unitaire_ttc);
												setPourcentageState(data.pourcentage);
												setReductionState(data.prix_ttc);
											}
										},
									});
								}
								// setNbrArticleState(prevState => prevState - data.value);
							} else if (data.type === 'P' && data.value) {
								// setPrixTTCState(prevState => prevState - data.value);
								const pourcentagePrice = Math.round((prixTTCState * data.value) / 100);
								setReductionState(pourcentagePrice);
							}
							setShowPromoCodeMessage('success');
						} else {
							setShowPromoCodeMessage('error');
							setFieldError('promo_code', 'Promo code expirer.');
						}
					}
				},
			});
			setSubmitting(false);
		},
	});

	const codePromoOnClickValidHandler = useCallback(() => {
		formikPromoCode.submitForm().then();
	}, [formikPromoCode]);

	const codePromoOnClickDeleteHandler = useCallback(() => {
		setNbrArticleState(nbr_article);
		setPrixTTCState(prix_ttc);
		setPrixUnitaireTTCState(prix_unitaire_ttc);
		setPourcentageState(pourcentage);
		setReductionState(undefined);
		setShowPromoCodeMessage(null);
	}, [nbr_article, pourcentage, prix_ttc, prix_unitaire_ttc]);

	const paymentParCheckHandler = useCallback((type: 'C' | 'V') => {
		if (type === 'C') {
			setPaymentParCarte(true);
			setPaymentParVirement(false);
		} else {
			setPaymentParCarte(false);
			setPaymentParVirement(true);
		}
	}, []);

	const formik = useFormik({
		initialValues: {
			company: '',
			ice: '',
			first_name: first_name ? first_name : '',
			last_name: last_name ? last_name : '',
			adresse: '',
			city: city ? city : '',
			code_postal: '',
			country: country ? country : '',
			globalError: '',
		},
		validateOnMount: true,
		validationSchema: subscriptionSchema,
		onSubmit: async (values, { setSubmitting, setFieldError }) => {
			let paymentPar: string | boolean = '';
			if (paymentParVirement) {
				paymentPar = 'V';
			} else if (paymentParCarte) {
				paymentPar = 'C';
			}
			const promo_code = formikPromoCode.values.promo_code;
			const action = subscriptionPostRootAction(
				nbrArticleState,
				values.company,
				values.ice.replace(/\D/g, ''),
				values.first_name,
				values.last_name,
				values.adresse,
				values.city,
				values.code_postal,
				values.country,
				promo_code,
				paymentPar,
			);
			dispatch({
				...action,
				onComplete: ({ error, cancelled, data }: SagaCallBackOnCompletePostSubscriptionType) => {
					if (!error && !cancelled && data) {
						if (data.total_paid === 0) {
							router.replace(DASHBOARD_INDEXED_OFFERS).then();
						} else {
							cookiesPoster('/cookies', {
								virement: {
									reference_number: data.reference_number,
									total_paid: data.total_paid,
								}
							}).then(() => {
								router.push(DASHBOARD_SUBSCRIPTION_PAY_VIA_VIREMENT).then();
							});
						}
					}
					if (error) {
						setFormikAutoErrors({
							e: error,
							setFieldError,
						});
					}
				},
			});
			setSubmitting(false);
		},
	});

	useEffect(() => {
		if (availableCountries.length === 0) {
			dispatch(placesGetCountriesAction());
		}
	}, [availableCountries.length, dispatch]);

	return (
		<Stack direction="column">
			<UserMainNavigationBar />
			<main className={`${Styles.main} ${SharedStyles.fixMobile}`}>
				<form style={{ width: '100%' }} onSubmit={(e) => e.preventDefault()}>
					<Stack direction="row" justifyContent="space-between" className={Styles.mobileStack}>
						<Stack direction="column" spacing="48px" className={Styles.desktopStack} sx={{ width: '100%' }}>
							<Stack direction="column" spacing="30px" sx={{ maxWidth: '540px' }}>
								{!is_subscribed ? (
									<h1 className={Styles.hOneHeader}>Let&apos;s finish powering you up</h1>
								) : (
									<h1 className={Styles.hOneHeader}>Upgrade de l&apos;abonnement</h1>
								)}
								<PackArticlesCardContent
									nbr_article={nbrArticleState}
									pourcentage={pourcentageState}
									prix_unitaire_ttc={prixUnitaireTTCState}
									is_subscribed={is_subscribed}
								/>
							</Stack>
							<Stack direction="column" spacing="32px" className={Styles.mobileHeaderStack}>
								<Stack direction="column" spacing="18px" className={Styles.inputsMaxWidth}>
									<CustomTextInput
										id="company"
										type="text"
										value={formik.values.company}
										onChange={formik.handleChange('company')}
										onBlur={formik.handleBlur('company')}
										helperText={formik.touched.company ? formik.errors.company : ''}
										error={formik.touched.company && Boolean(formik.errors.company)}
										fullWidth={false}
										size="medium"
										label="Société (optionnel)"
										placeholder="Société (optionnel)"
										theme={inputTheme}
									/>
									<CustomTextMaskInput
										id="ice"
										type="tel"
										value={formik.values.ice}
										onChange={formik.handleChange('ice')}
										onBlur={formik.handleBlur('ice')}
										helperText={formik.touched.ice && formik.values.company ? formik.errors.ice : ''}
										error={formik.touched.ice && !!formik.values.company && Boolean(formik.errors.ice)}
										fullWidth={false}
										size="medium"
										label="ICE (optionnel)"
										placeholder="ICE (optionnel)"
										theme={inputTheme}
										mask="99999 99999 99999"
										alwaysShowMask={false}
										maskPlaceholder="_"
									/>
								</Stack>
								<Stack direction="column" spacing="18px" className={Styles.inputsMaxWidth}>
									<CustomTextInput
										id="first_name"
										type="text"
										value={formik.values.first_name}
										onChange={formik.handleChange('first_name')}
										onBlur={formik.handleBlur('first_name')}
										helperText={formik.touched.first_name ? formik.errors.first_name : ''}
										error={formik.touched.first_name && Boolean(formik.errors.first_name)}
										fullWidth={false}
										size="medium"
										label="Nom"
										placeholder="Nom"
										theme={inputTheme}
									/>
									<CustomTextInput
										id="last_name"
										type="text"
										value={formik.values.last_name}
										onChange={formik.handleChange('last_name')}
										onBlur={formik.handleBlur('last_name')}
										helperText={formik.touched.last_name ? formik.errors.last_name : ''}
										error={formik.touched.last_name && Boolean(formik.errors.last_name)}
										fullWidth={false}
										size="medium"
										label="Prénom"
										placeholder="Prénom"
										theme={inputTheme}
									/>
									<CustomTextInput
										id="adresse"
										type="text"
										value={formik.values.adresse}
										onChange={formik.handleChange('adresse')}
										onBlur={formik.handleBlur('adresse')}
										helperText={formik.touched.adresse ? formik.errors.adresse : ''}
										error={formik.touched.adresse && Boolean(formik.errors.adresse)}
										fullWidth={false}
										size="medium"
										label="Adresse"
										placeholder="Adresse"
										theme={inputTheme}
									/>
									<Stack direction="row" spacing="18px">
										<CustomTextInput
											id="city"
											type="text"
											value={formik.values.city}
											onChange={formik.handleChange('city')}
											onBlur={formik.handleBlur('city')}
											helperText={formik.touched.city ? formik.errors.city : ''}
											error={formik.touched.city && Boolean(formik.errors.city)}
											fullWidth={true}
											size="medium"
											label="Ville"
											placeholder="Ville"
											theme={inputTheme}
										/>
										<CustomTextInput
											id="code_postal"
											type="tel"
											value={formik.values.code_postal}
											onChange={formik.handleChange('code_postal')}
											onBlur={formik.handleBlur('code_postal')}
											helperText={formik.touched.code_postal ? formik.errors.code_postal : ''}
											error={formik.touched.code_postal && Boolean(formik.errors.code_postal)}
											fullWidth={false}
											size="medium"
											label="Code Postal"
											placeholder="Code Postal"
											theme={inputTheme}
										/>
									</Stack>
									<CustomSingleCountrySelect
										onChange={(e: SelectChangeEvent) => {
											// setPickedCountry(e.target.value);
											formik.handleChange('country')(e.target.value);
										}}
										// value={pickedCountry}
										value={formik.values.country}
										id="country"
										label="Pays"
										items={availableCountries}
										theme={offerForWhomDropdownTheme()}
										disabled={false}
										cssClass={Styles.maxWidth}
									/>
								</Stack>
							</Stack>
						</Stack>
						<TabletAndMobile>
							<Divider orientation="horizontal" flexItem className={Styles.mobileDivider} />
						</TabletAndMobile>
						<Box className={Styles.promoBox}>
							<Stack direction="column" spacing="20px">
								<Stack direction="column" spacing="12px">
									<span className={Styles.rightFieldLabel}>Code promo</span>
									<ThemeProvider theme={promoCodeTheme}>
										<TextField
											type="text"
											id="promo_code"
											value={formikPromoCode.values.promo_code}
											onChange={formikPromoCode.handleChange('promo_code')}
											onBlur={formikPromoCode.handleBlur('promo_code')}
											helperText={
												(formikPromoCode.touched.promo_code ? formikPromoCode.errors.promo_code : '') ||
												(showPromoCodeMessage && showPromoCodeMessage === 'success' ? 'Promo code appliquer.' : '')
											}
											error={formikPromoCode.touched.promo_code && Boolean(formikPromoCode.errors.promo_code)}
											fullWidth={false}
											size="medium"
											color={showPromoCodeMessage && showPromoCodeMessage === 'success' ? 'success' : 'primary'}
											sx={{
												'& .MuiFormHelperText-root': {
													color: `${
														showPromoCodeMessage && showPromoCodeMessage === 'success'
															? 'rgb(129, 199, 132)'
															: 'rgb(229, 115, 115)'
													}`,
												},
											}}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={() => {
																codePromoOnClickDeleteHandler();
																formikPromoCode.handleChange('promo_code')('');
															}}
															onMouseDown={(e) => e.preventDefault()}
															edge="end"
															disabled={formikPromoCode.values.promo_code === ''}
															color="error"
														>
															{<Close />}
														</IconButton>
														<IconButton
															onClick={() => {
																if (!formikPromoCode.values.promo_code) {
																	return;
																}
																codePromoOnClickValidHandler();
															}}
															onMouseDown={(e) => e.preventDefault()}
															edge="end"
															disabled={formikPromoCode.values.promo_code === ''}
															color="success"
														>
															{<Check />}
														</IconButton>
													</InputAdornment>
												),
											}}
										></TextField>
									</ThemeProvider>
								</Stack>
								<Stack direction="column" spacing="12px" className={Styles.mobilePromoStack}>
									<span className={Styles.rightFieldLabel}>Paiement par</span>
									<RadioCheckButton
										checked={paymentParCarte}
										active={true}
										disabled={true}
										text="Carte bancaire"
										onClick={() => {
											paymentParCheckHandler('C');
										}}
									/>
									<RadioCheckButton
										checked={paymentParVirement}
										active={true}
										text="Virement bancaire"
										onClick={() => {
											paymentParCheckHandler('V');
										}}
									/>
								</Stack>
								<Stack direction="column" spacing="55px">
									<Stack direction="column" spacing="18px">
										<Stack direction="row" justifyContent="space-between" className={Styles.priceDetails}>
											<span>Abonnement</span>
											<span>{prixTTCState} DH</span>
										</Stack>
										{reductionState && (
											<Stack direction="row" justifyContent="space-between" mb="18px" className={Styles.priceDetails}>
												<span>Réduction</span>
												<span className={Styles.reducedPrice}>-{reductionState} DH</span>
											</Stack>
										)}
										<Divider orientation="horizontal" flexItem className={Styles.divider} />
										<Stack direction="column" justifyContent="center" alignItems="center" className={Styles.totalPrice}>
											<span>Total</span>
											<span>{reductionState ? prixTTCState - reductionState : prixTTCState} DH</span>
										</Stack>
									</Stack>
									<Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
										{formik.errors.globalError && (
											<span className={Styles.errorMessage}>{formik.errors.globalError}</span>
										)}
										<PrimaryButton
											buttonText="Payer"
											active={formik.isValid && !formik.isSubmitting}
											onClick={formik.handleSubmit}
											type="submit"
										/>
									</Stack>
								</Stack>
							</Stack>
						</Box>
					</Stack>
				</form>
			</main>
			<CustomFooter />
		</Stack>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const url = `${process.env.NEXT_PUBLIC_ACCOUNT_CHECK_ACCOUNT}`;
	const appToken = getServerSideCookieTokens(context);
	const { prix_ttc, pourcentage, prix_unitaire_ttc, nbr_article, prix_ht, prix_unitaire_ht } = context.query;
	try {
		if (appToken.tokenType === 'TOKEN' && appToken.initStateToken.access !== null) {
			const instance = isAuthenticatedInstance(appToken.initStateToken);
			const response: AccountGetCheckAccountResponseType = await getApi(url, instance);
			if (response.status === 200 && response.data.has_shop) {
				if (response.data.is_subscribed) {
					// redirect back
					return {
						redirect: {
							permanent: false,
							destination: DASHBOARD_SUBSCRIPTION,
						},
					};
				} else {
					// not subscribed check for params - proceed
					if (prix_ttc && pourcentage && prix_unitaire_ttc && nbr_article && prix_ht && prix_unitaire_ht) {
						const pickedSubscription: Omit<availableSubscriptionPlanType, 'pk'> = {
							prix_ttc: parseInt(prix_ttc as string),
							pourcentage: parseInt(pourcentage as string),
							prix_unitaire_ttc: parseInt(prix_unitaire_ttc as string),
							nbr_article: parseInt(nbr_article as string),
							prix_ht: parseInt(prix_ht as string),
							prix_unitaire_ht: parseInt(prix_unitaire_ht as string),
						};
						return {
							props: {
								pickedSubscription: pickedSubscription,
								is_subscribed: response.data.is_subscribed,
								first_name: response.data.first_name,
								last_name: response.data.last_name,
								city: response.data.city,
								country: response.data.country,
							},
						};
					} else {
						// params not found redirect back
						return {
							redirect: {
								permanent: false,
								destination: DASHBOARD_SUBSCRIPTION,
							},
						};
					}
				}
				// online but doesn't own a shop
			} else {
				return {
					redirect: {
						permanent: false,
						destination: NOT_FOUND_404,
					},
				};
			}
			// user not logged in
		} else {
			return {
				redirect: {
					permanent: false,
					destination: AUTH_LOGIN,
				},
			};
		}
	} catch (e) {
		// fallback error
		return {
			redirect: {
				permanent: false,
				destination: NOT_FOUND_404,
			},
		};
	}
}

export default Checkout;
