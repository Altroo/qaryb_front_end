import React from 'react';
import Styles from './avatarShopNameRating.module.sass';
import CircularAvatarInputFile from '../../../../htmlElements/buttons/circularAvatarInputFile/circularAvatarInputFile';
import Image from 'next/image';
import BlackStarSVG from '../../../../../public/assets/svgs/globalIcons/black-star.svg';
import { ShopFontNameType } from '../../../../../types/shop/shopTypes';

type Props = {
	shopName: string | undefined;
	preview: string | ArrayBuffer | null;
	active: boolean;
	font?: ShopFontNameType;
	setAvatar?: (file: File | null) => void;
	children?: React.ReactNode;
};

const AvatarShopNameRating: React.FC<Props> = (props: Props) => {
	return (
		<div className={Styles.avatarWrapper}>
			<div>
				<CircularAvatarInputFile setAvatar={props.setAvatar} preview={props.preview} active={props.active}/>
			</div>
			<div className={Styles.shopNameContainer}>
				<h2
					className={Styles.shopName}
					style={{
						fontFamily:
							props.font === 'L'
								? 'Poppins-Light'
								: props.font === 'B'
								? 'Poppins-ExtraBold'
								: props.font === 'S'
								? 'Poppins-SemiBold'
								: 'Poppins',
					}}>
					{props.shopName}
				</h2>
				<div className={Styles.ratingContainer}>
					<Image src={BlackStarSVG} width={20} height={20} alt="" />
					<span>Votre note</span>
				</div>
			</div>
		</div>
	);
};

export default AvatarShopNameRating;