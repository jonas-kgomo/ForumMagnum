import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
// import schema from './schema.js';
import schema from './schema.js';
import { makeEditable } from '../../editor/make_editable.js';
import { addUniversalFields } from '../../collectionUtils'

export const Collections = createCollection({
  collectionName: 'Collections',

  typeName: 'Collection',

  schema,

  resolvers: getDefaultResolvers('Collections'),

  mutations: getDefaultMutations('Collections'),
});

export default Collections;

export const makeEditableOptions = {
  order: 20,
  fieldName: "description"
}

makeEditable({
  collection: Collections,
  options: makeEditableOptions
})
addUniversalFields({collection: Collections})
