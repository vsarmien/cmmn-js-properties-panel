'use strict';

var entryFactory = require('../../../factory/EntryFactory');
var NameProp = require('./implementation/NameProp');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getName = ModelUtil.getName,
    getBusinessObject = ModelUtil.getBusinessObject;

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    isDiscretionaryConnection = CmmnElementHelper.isDiscretionaryConnection,
    isAssociationConnection = CmmnElementHelper.isAssociationConnection,
    isCriterion = CmmnElementHelper.isCriterion,
    isTextAnnotation = CmmnElementHelper.isTextAnnotation,
    isItemCapable = CmmnElementHelper.isItemCapable;

var domQuery   = require('min-dom/lib/query'),
    domClosest = require('min-dom/lib/closest');

module.exports = function(group, element) {

  if (isCriterion(element)) {
    return;
  }

  if (isCMMNEdge(element) &&
      (isDiscretionaryConnection(element) ||
       isAssociationConnection(element))) {
    return;
  }


  // name
  group.entries = group.entries.concat(NameProp(element, {

    modelProperty: isTextAnnotation(element) ? 'text' : undefined,
    reference: isCMMNEdge(element) ? 'cmmnElementRef' : undefined,

    get: function(element, node, bo) {

      if (isTextAnnotation(bo)) {
        return {
          text: bo.text
        };
      }

      return {
        name: getName(bo)
      };
    }

  }));


  group.entries.push(entryFactory.link({

    id: 'definitionNameLink',
    label: 'Definition name is used',

    getClickableElement: function(element, node) {
      var panel = domClosest(node, 'div.djs-properties-panel');
      return domQuery('a[data-tab-target="definition"]', panel);
    },

    hideLink: function(element, node) {
      var bo = getBusinessObject(element);
      return !(isItemCapable(element) && getName(bo) && !bo.name);
    }

  }));

};