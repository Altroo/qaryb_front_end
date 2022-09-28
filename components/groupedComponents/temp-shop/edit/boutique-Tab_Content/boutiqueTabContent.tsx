import React, { useEffect, useState } from 'react';
import Styles from './boutiqueTabContent.module.sass';
import { checkBoxForWhomBaseType, chipActionsType, switchActionType } from '../../../../../types/ui/uiTypes';
import IconTextInput from '../../../../htmlElements/inputs/iconTextInput/iconTextInput';
import ChipButtons from '../../../../htmlElements/buttons/chipButtons/chipButtons';
// import IosSwitch from '../../../../htmlElements/switches/iosSwitch';
import CheckBox from '../../../../htmlElements/checkBoxes/checkBox';
import StartYourShopContent from '../startYourShopContent/startYourShopContent';
import ShopFilterSelect from '../shopFilterSelect/shopFilterSelect';
import { Stack } from '@mui/material';

type Props = {
	activeColor: string;
	chipCategoriesAction: chipActionsType;
	promoCheckAction: switchActionType;
	checkBoxForWhomAction: Array<checkBoxForWhomBaseType>;
	hidden: boolean;
	children?: React.ReactNode;
};

const BoutiqueTabContent: React.FC<Props> = (props: Props) => {
	// Todo temp shop - check later from router sort_by.
	const [filter, setFilter] = useState<'D' | 'C'>('D');

	const filterOnChange = (
		e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent | React.FocusEvent | null,
		value: string | null,
	) => {
		setFilter(value as 'D' | 'C');
	};

	useEffect(() => {
		console.log(filter);
	}, [filter]);

	return (
		<>
			{!props.hidden ? (
				<div className={Styles.filterWrapper}>
					<span className={Styles.filterText}>Filtrer</span>
					<ShopFilterSelect
						state={filter}
						setStateHandler={setFilter}
						activeHoverColor={props.activeColor}
						onChange={(e, v) => filterOnChange(e, v)}
					/>
				</div>
			) : null}
			<Stack direction="row" justifyContent="space-between">
				{!props.hidden ? (
					<div className={Styles.shopFilterWrapper}>
						<IconTextInput active={true} placeholder="Rechercher" />
						<div className={Styles.shopFilterContainer}>
							<span className={Styles.subHeader}>Catégories</span>
							<div className={Styles.categoriesWrapper}>
								<ChipButtons actions={props.chipCategoriesAction} />
							</div>
							{/*<div className={Styles.promoWrapper}>*/}
							{/*	<span className={Styles.subHeader}>En Promo</span>*/}
							{/*	<IosSwitch*/}
							{/*		checked={props.promoCheckAction.checked}*/}
							{/*		onChange={props.promoCheckAction.onChange}*/}
							{/*		activeColor={props.promoCheckAction.activeColor}*/}
							{/*		labelcssStyles={{marginLeft: '10px'}}*/}
							{/*	/>*/}
							{/*</div>*/}
							<div className={Styles.forWhomWrapper}>
								<span className={Styles.subHeader}>Pour qui</span>
								<div>
									<div>
										{props.checkBoxForWhomAction.map((action, index: number) => {
											return (
												<CheckBox
													key={index}
													checked={action.checked}
													active={action.active}
													text={action.text}
													onChange={action.onChange}
													activeColor={action.activeColor}
												/>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}
				<StartYourShopContent />
			</Stack>
		</>
	);
};

export default BoutiqueTabContent;
