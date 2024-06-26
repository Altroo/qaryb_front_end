import React, { useState } from "react";
import Styles from "../../../styles/auth/register/missing-email.module.sass";
import { GetServerSidePropsContext } from "next";
import {
	allowAnyInstance, Desktop,
	getServerSideCookieTokens,
	isAuthenticatedInstance, setFormikAutoErrors, TabletAndMobile
} from "../../../utils/helpers";
import {
	AccountGetCheckAccountResponseType,
} from "../../../types/account/accountTypes";
import { getApi, postApi, putApi } from "../../../store/services/_init/_initAPI";
import { AUTH_LOGIN, AUTH_REGISTER, AUTH_WELCOME } from "../../../utils/routes";
import AuthPageLayout from "../../../components/layouts/auth/authPageLayout";
import { Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { getInitStateToken } from "../../../store/selectors";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { emailSchema } from "../../../utils/formValidationSchemas";
import {
	ResponseOnlyInterface
} from "../../../types/_init/_initTypes";
import { coordonneeTextInputTheme } from "../../../utils/themes";
import CustomTextInput from "../../../components/formikElements/customTextInput/customTextInput";
import PrimaryButton from "../../../components/htmlElements/buttons/primaryButton/primaryButton";
import { accountSetFacebookEmailAction } from "../../../store/actions/account/accountActions";
import { useSession } from "next-auth/react";
import { refreshAppTokenStatesAction } from "../../../store/actions/_init/_initActions";
import UserMainNavigationBar from "../../../components/layouts/userMainNavigationBar/userMainNavigationBar";
import ApiProgress from "../../../components/formikElements/apiLoadingResponseOrError/apiProgress/apiProgress";

const inputTheme = coordonneeTextInputTheme();
const AddMissingEmail = () => {
	const { data: session } = useSession();
	const token = useAppSelector(getInitStateToken);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [isApiCallInProgress, setIsApiCallInProgress] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validateOnMount: true,
		validationSchema: emailSchema,
		onSubmit: async (values, { setFieldError, setSubmitting }) => {
			setIsApiCallInProgress(true);
			const url = `${process.env.NEXT_PUBLIC_ACCOUNT_CHECK_EMAIL}`;
			try {
				const instance = allowAnyInstance();
				const response: ResponseOnlyInterface = await postApi(url, instance, { email: values.email });
				if (response.status === 204) {
					const fb_email_url = `${process.env.NEXT_PUBLIC_ACCOUNT_SET_FACEBOOK_EMAIL}`;
					try {
						const authInstance = isAuthenticatedInstance(token);
						const response: ResponseOnlyInterface = await putApi(fb_email_url, authInstance, {email: values.email});
						if (response.status === 204) {
							dispatch(accountSetFacebookEmailAction(values.email));
							// update state token
							if (session) {
								dispatch(refreshAppTokenStatesAction(session));
							}
							router.push(AUTH_WELCOME).then(() => {
								setIsApiCallInProgress(false);
							});
						}
					} catch (e) {
						setFormikAutoErrors({e, setFieldError});
					}
				}
			} catch (e) {
				setFormikAutoErrors({e, setFieldError});
			}
			setSubmitting(false);
			setIsApiCallInProgress(false);
		}
	});

	return (
		<>
			{isApiCallInProgress && (
				<ApiProgress
					cssStyle={{ position: 'absolute', top: '50%', left: '50%' }}
					backdropColor="#FFFFFF"
					circularColor="#0D070B"
				/>
			)}
			<Stack direction="column" className={Styles.contentWrapper} spacing={4}>
			<Stack direction="column" spacing={2} alignItems="flex-start" width="100%">
				<span className={Styles.header}>Ajoutez votre email</span>
				<p className={Styles.subHeader}>Pour vous inscrire, nous avons besoin de votre email.</p>
			</Stack>
			<form style={{ width: "100%"}} onSubmit={(e) => e.preventDefault()}>
				<Stack direction="column" justifyContent="center" alignItems="center" spacing={4} width="100%">
					<Stack direction="column" justifyContent="center" alignItems="center" spacing={2} width="100%">
						<CustomTextInput
							id="first_name"
							type="text"
							value={formik.values.email}
							onChange={formik.handleChange("email")}
							onBlur={formik.handleBlur("email")}
							helperText={formik.touched.email ? formik.errors.email : ""}
							error={formik.touched.email && Boolean(formik.errors.email)}
							fullWidth={false}
							size="medium"
							label="Adresse email"
							placeholder="Adresse email"
							cssClass={Styles.mobileInput}
							theme={inputTheme}
						/>
					</Stack>
					<PrimaryButton
						buttonText="Continuer"
						active={formik.isValid && !formik.isSubmitting}
						onClick={formik.handleSubmit}
						cssClass={Styles.registerButton}
						type="submit"
					/>
				</Stack>
			</form>
		</Stack>
		</>
	);
};

// Missing fb email
const MissingEmail: React.FC = () => {
	return (
		<>
			<Desktop>
				<div>
					<AuthPageLayout href={AUTH_LOGIN} topBarText="CONNECT">
					<AddMissingEmail/>
				</AuthPageLayout>
				</div>
			</Desktop>
			<TabletAndMobile>
				<div style={{display: 'flex', width: '100%', height: '100%'}}>
					<main className={Styles.main}>
						<UserMainNavigationBar />
						<AddMissingEmail/>
					</main>
				</div>
			</TabletAndMobile>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// const csrfToken = await getCsrfToken(context);
	// checking if user doesn't have a fb email
	const url = `${process.env.NEXT_PUBLIC_ACCOUNT_CHECK_ACCOUNT}`;
	const appToken = getServerSideCookieTokens(context);
	try {
		if (appToken.tokenType === "TOKEN" && appToken.initStateToken.access !== null) {
			const instance = isAuthenticatedInstance(appToken.initStateToken);
			const response: AccountGetCheckAccountResponseType = await getApi(url, instance);
			if (response.status === 200 && response.data.email === '') {
				// email not set, proceed to set the email.
				return {
					props: {},
				}
			}
		}else {
			// user is not authenticated
			return {
				redirect: {
					permanent: false,
					destination: AUTH_REGISTER
				}
			};
		}
	} catch (e) {
		// user is not authenticated
		return {
			redirect: {
				permanent: false,
				destination: AUTH_REGISTER
			}
		};
	}
}

export default MissingEmail;
