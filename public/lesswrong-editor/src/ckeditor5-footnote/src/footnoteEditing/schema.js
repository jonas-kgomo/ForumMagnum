// @ts-check

import { DATA_FOOTNOTE_ID, ELEMENTS } from "../constants";

export const defineSchema = schema => {
	/***********************************Footnote Section Schema***************************************/
	schema.register(ELEMENTS.footnoteSection, {
		isObject: true,
		allowWhere: '$block',
		allowAttributes: ['id', 'class'],
	});

	schema.register(ELEMENTS.footnoteList, {
		allowIn: ELEMENTS.footnoteSection,
		allowContentOf: '$root',
		isInline: true,
		allowAttributes: ['id', DATA_FOOTNOTE_ID, 'class'],
	});

	schema.register(ELEMENTS.footnoteItem, {
		allowIn: ELEMENTS.footnoteList,
		allowWhere: '$text',
		isInline: true,
		isObject: true,
		allowAttributes: ['id', DATA_FOOTNOTE_ID, 'class'],
	});

	// @ts-ignore -- returning true here prevents future listeners from firing.
	// (as does return false, it just also prevents the child add operation from happening.)
	// The below pattern matches the canonical use in the docs--the type signature is just wrong.
	schema.addChildCheck((context, childDefinition) => {
		if (context.endsWith(ELEMENTS.footnoteList) && childDefinition.name === ELEMENTS.footnoteSection) {
			return false;
		}
	});

	/***********************************Footnote Inline Schema***************************************/
	schema.register(ELEMENTS.footnoteReference, {
		allowWhere: '$text',
		isInline: true,
		isObject: true,
		allowAttributes: [ 'id', DATA_FOOTNOTE_ID, 'class' ],
	});
}