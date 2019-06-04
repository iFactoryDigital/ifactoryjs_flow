
// require dependencies
const Helper = require('helper');

// require models
const Form = model('form');

/**
 * build placement helper
 */
class FlowHelper extends Helper {
  /**
   * construct placement helper
   */
  constructor() {
    // run super
    super();

    // bind methods
    this.build = this.build.bind(this);

    // run build method
    this.build();
  }

  /**
   * builds placement helper
   */
  build() {
    // build placement helper
    this.__logics = [];
    this.__actions = [];
    this.__timings = [];
    this.__triggers = [];
  }

  /**
   * reset
   */
  reset() {
    // return rebuild
    return this.build();
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} save
   * @param  {Function} submit
   *
   * @return {*}
   */
  trigger(type, opts, render, save) {
    // check found
    const found = this.__triggers.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__triggers.push({
        type,
        opts,
        save,
        render,
      });
    } else {
      // set on found
      found.type = type;
      found.opts = opts;
      found.save = save;
      found.render = render;
    }
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} save
   * @param  {Function} submit
   *
   * @return {*}
   */
  action(type, opts, render, save) {
    // check found
    const found = this.__actions.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__actions.push({
        type,
        opts,
        save,
        render,
      });
    } else {
      // set on found
      found.type = type;
      found.opts = opts;
      found.save = save;
      found.render = render;
    }
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} save
   * @param  {Function} submit
   *
   * @return {*}
   */
  timing(type, opts, render, save) {
    // check found
    const found = this.__timings.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__timings.push({
        type,
        opts,
        save,
        render,
      });
    } else {
      // set on found
      found.type = type;
      found.opts = opts;
      found.save = save;
      found.render = render;
    }
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} save
   * @param  {Function} submit
   *
   * @return {*}
   */
  logic(type, opts, render, save) {
    // check found
    const found = this.__logics.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__logics.push({
        type,
        opts,
        save,
        render,
      });
    } else {
      // set on found
      found.type = type;
      found.opts = opts;
      found.save = save;
      found.render = render;
    }
  }

  /**
   * gets fields
   *
   * @return {Array}
   */
  logics() {
    // returns fields
    return this.__logics;
  }

  /**
   * gets fields
   *
   * @return {Array}
   */
  actions() {
    // returns fields
    return this.__actions;
  }

  /**
   * gets fields
   *
   * @return {Array}
   */
  timings() {
    // returns fields
    return this.__timings;
  }

  /**
   * render fields
   *
   * @return {Array}
   */
  render() {
    // map fields
    return {
      logics : this.__logics.map((logic) => {
        return {
          type : logic.type,
          opts : logic.opts,
        };
      }),
      actions : this.__actions.map((action) => {
        return {
          type : action.type,
          opts : action.opts,
        };
      }),
      timings : this.__timings.map((timing) => {
        return {
          type : timing.type,
          opts : timing.opts,
        };
      }),
      triggers : this.__triggers.map((trigger) => {
        return {
          type : trigger.type,
          opts : trigger.opts,
        };
      }),
    };
  }
}

/**
 * export new FlowHelper class
 *
 * @return {FlowHelper}
 */
module.exports = FlowHelper;
