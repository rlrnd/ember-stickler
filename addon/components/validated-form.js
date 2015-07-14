import Ember from 'ember';
import layout from '../templates/components/validated-form';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'form',
  attributeBindings: ['role'],
  fields: null,
  role: null,

  action: 'submit',

  resetFields: function() {
    this.get('fields').forEach(field => field.send('reset'));
  },

  submit(e) {

    e.preventDefault();
    this.send('submit');
    return false;

  },

  submitErrors: null,
  _submitResolve: function() {
    this.set('submitErrors', null);
  },
  _submitReject: function(errors) {
    this.set('submitErrors', errors);
  },

  valid: Ember.computed('fields.@each.valid', function() {
    return this.get('fields').every(field => field.get('valid'));
  }),

  actions: {
    register(params) {
      this.get('fields').push(params);
    },

    submit() {

      this.get('fields').forEach(field => field.send('validate'));

      const reset = this.resetFields.bind(this);
      var _this = this;
      function callbackHandler(promise) {
        this.set(_this, 'promise', promise);
        promise.then(
          _this._submitResolve.bind(_this),
          _this._submitReject.bind(_this)
        );
      }

      if(this.get('valid')) {
        this.sendAction('action', reset, callbackHandler);
      }

    }
  },

  init: function() {
    this._super();

    this.set('fields', Ember.A());
  }
});
