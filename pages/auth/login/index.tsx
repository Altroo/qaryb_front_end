import React, { useEffect, useState } from "react";
import Styles from "../../../styles/auth/login/login.module.sass";
import { GetServerSidePropsContext } from "next";
import { Stack } from "@mui/material";
import GoogleSignInButton from "../../../components/htmlElements/buttons/googleSignInButton/googleSignInButton";
import FacebookSignInButton from "../../../components/htmlElements/buttons/facebookSignInButton/facebookSignInButton";
import Divider from "@mui/material/Divider";
import CustomTextInput from "../../../components/formikElements/customTextInput/customTextInput";
import PrimaryButton from "../../../components/htmlElements/buttons/primaryButton/primaryButton";
import {
	allowAnyInstance,
	getServerSideCookieTokens,
	isAuthenticatedInstance,
	setFormikAutoErrors
} from "../../../utils/helpers";
import { AccountGetCheckAccountResponseType, AccountPostLoginResponseType } from "../../../types/account/accountTypes";
import { getApi, postApi } from "../../../store/services/_init/_initAPI";
import {
	AUTH_REGISTER, AUTH_RESET_PASSWORD,
	AUTH_WELCOME,
	DASHBOARD
} from "../../../utils/routes";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../../utils/hooks";
import AuthPageLayout from "../../../components/layouts/auth/authPageLayout";
import { useFormik } from "formik";
import { loginSchema } from "../../../utils/formValidationSchemas";
import ApiProgress from "../../../components/formikElements/apiLoadingResponseOrError/apiProgress/apiProgress";
import Link from "next/link";
import CustomPasswordInput from "../../../components/formikElements/customPasswordInput/customPasswordInput";
import { coordonneeTextInputTheme } from "../../../utils/themes";
import { accountPostRegisterAction } from "../../../store/actions/account/accountActions";
import TextButton from "../../../components/htmlElements/buttons/textButton/textButton";
import { refreshAppTokenStatesAction } from "../../../store/actions/_init/_initActions";

const LoginPageContent = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { error } = router.query;

	const googleSignIn = () => {
		// redirect to the same page that will then check if user is new or old
		signIn("google").then();
	};

	const facebookSignIn = () => {
		// redirect to the same page that will then check if user is new or old
		signIn("facebook").then();
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			globalError: "",
		},
		validateOnMount: true,
		validationSchema: loginSchema,
		onSubmit: async (values, { setFieldError, setSubmitting }) => {
			setSubmitting(false);
			const url = `${process.env.NEXT_PUBLIC_ACCOUNT_LOGIN}`;
			try {
				const instance = allowAnyInstance();
				const response: AccountPostLoginResponseType = await postApi(url, instance, {email: values.email, password: values.password});
				if (response.status === 200) {
					dispatch(accountPostRegisterAction(false, response.data));
					await signIn('credentials', {
						email: values.email,
						password: values.password,
						redirect: false,
					}).then(() => {
						setSubmitting(true);
					});
				}
			} catch (e) {
				setFormikAutoErrors({e, setFieldError});
			}
		}
	});

	const inputTheme = coordonneeTextInputTheme();
	return (
		<Stack direction="column" justifyContent="center" alignItems="center" className={Styles.contentWrapper} spacing={4}>
			<h2 className={Styles.content}>Connection</h2>
			<Stack direction="column" spacing={1}>
				<GoogleSignInButton onClick={googleSignIn} />
				<FacebookSignInButton onClick={facebookSignIn} />
				{error && <span className={Styles.errorMessage}>{error}</span>}
			</Stack>
			<Divider orientation="horizontal" flexItem className={Styles.divider} />
			<form>
				<Stack direction="column" spacing={2}>
					<CustomTextInput
						id="email"
						value={formik.values.email}
						onChange={formik.handleChange("email")}
						onBlur={formik.handleBlur("email")}
						helperText={formik.touched.email ? formik.errors.email : ""}
						error={formik.touched.email && Boolean(formik.errors.email)}
						fullWidth={false}
						size="medium"
						type="email"
						label="Adresse email"
						placeholder="Adresse email"
						cssClass={Styles.mobileEmailInput}
						theme={inputTheme}
					/>
					<CustomPasswordInput
						id="password"
						value={formik.values.password}
						onChange={formik.handleChange("password")}
						onBlur={formik.handleBlur("password")}
						helperText={formik.touched.password ? formik.errors.password : ""}
						error={formik.touched.password && Boolean(formik.errors.password)}
						fullWidth={false}
						size="medium"
						label="Mot de passe"
						placeholder="Mot de passe"
						cssClass={Styles.mobileEmailInput}
						theme={inputTheme}
					/>
					{formik.errors.globalError && <span className={Styles.errorMessage}>{formik.errors.globalError}</span>}
					<TextButton
						buttonText="Mot de passe oublié ?"
						onClick={() => {
							router.push(AUTH_RESET_PASSWORD).then();
						}}
					/>
					<PrimaryButton
						buttonText="Me connecter"
						active={formik.isValid && !formik.isSubmitting}
						onClick={formik.handleSubmit}
						cssClass={Styles.emailRegisterButton}
						type="submit"
					/>
				</Stack>
			</form>
		</Stack>
	);
};

type Props = {
	children?: React.ReactNode;
}

const Login: React.FC<Props> = (props: Props) => {
	const { data: session, status } = useSession();
	const loading = status === "loading";
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [sessionUpdated, setSessionUpdated] = useState<boolean>(false);

	useEffect(() => {
		if (session && !sessionUpdated) {
			dispatch(refreshAppTokenStatesAction(session));
			setSessionUpdated(true);
			router.push(AUTH_WELCOME).then();
		}
	}, [dispatch, router, session, sessionUpdated]);

	return (
		<>
			{loading && <ApiProgress cssStyle={{ position: "absolute", top: "50%", left: "50%" }} />}
			{!loading && !session && (
				<>
					<div className={Styles.desktopOnly}>
						<AuthPageLayout href={AUTH_REGISTER} topBarText="CREATE">
							<LoginPageContent/>
						</AuthPageLayout>
					</div>
					<div className={Styles.mobileOnly}>
						<main className={Styles.main}>
							<Stack direction="column" justifyContent="space-between" alignItems="center" sx={{height: '100vh'}}>
								<LoginPageContent/>
								<Stack direction="column" justifyContent="center" alignItems="center">
									<p className={Styles.bottomLinks}>
										Pas encore de compte ?{' '}
										<Link passHref href={AUTH_REGISTER}>
											<a href={AUTH_REGISTER}>Inscrivez-vous</a>
										</Link>
									</p>
								</Stack>
							</Stack>
						</main>
					</div>
				</>
			)}
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// redirect if user already logged in
	const url = `${process.env.NEXT_PUBLIC_ACCOUNT_CHECK_ACCOUNT}`;
	const appToken = getServerSideCookieTokens(context);
	try {
		if (appToken.tokenType === "TOKEN" && appToken.initStateToken.access_token !== null) {
			const instance = isAuthenticatedInstance(appToken.initStateToken);
			const response: AccountGetCheckAccountResponseType = await getApi(url, instance);
			if (response.status === 200) {
				return {
					redirect: {
						permanent: false,
						destination: DASHBOARD
						}
					};
				}
		} else {
			// access login page
			return { props: {} };
		}
	} catch (e) {
		// access login page
		return { props: {} };
	}
}

export default Login;