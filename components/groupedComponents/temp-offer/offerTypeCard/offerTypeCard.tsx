import React, { ForwardedRef, forwardRef } from 'react';
import Styles from './offerTypeCard.module.sass';
import Image from 'next/image';
import Link from 'next/link';
import { Stack } from '@mui/material';

type Props = {
	title: string;
	description: string;
	svgIcon: string;
	onClick?: () => void;
	nextPage?: string;
	children?: React.ReactNode;
};

const OfferTypeCard = forwardRef<HTMLAnchorElement, Props>((props: Props, ref: ForwardedRef<HTMLAnchorElement>) => {
	return props.nextPage ? (
		<Link href={props.nextPage} ref={ref} className={Styles.cardWrapper} onClick={props.onClick}>
			<Stack direction="row" spacing={2} className={Styles.titleDescWrapper} alignItems="center">
				<Image src={props.svgIcon} alt="" className={Styles.icon} sizes="100vw" />
				<Stack direction="column" spacing={1}>
					<span className={Styles.title}>{props.title}</span>
					<span className={Styles.description}>{props.description}</span>
				</Stack>
			</Stack>
		</Link>
	) : (
		<div className={Styles.cardWrapper}>
			<Stack direction="row" spacing={2} className={Styles.titleDescWrapper} alignItems="center">
				<Image src={props.svgIcon} alt="" className={Styles.icon} sizes="100vw" />
				<Stack direction="column" spacing={1}>
					<Stack direction="row" spacing={1} alignItems="center">
						<span className={Styles.title}>{props.title}</span>
						<span className={Styles.comingSoonTag}>Coming soon</span>
					</Stack>
					<span className={Styles.description}>{props.description}</span>
				</Stack>
			</Stack>
			</div>
	);
});

OfferTypeCard.displayName = 'OfferTypeCard';

export default OfferTypeCard;
