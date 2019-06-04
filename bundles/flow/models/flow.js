
// require local dependencies
const Model = require('model');

/**
 * create Flow model
 */
class Flow extends Model {
  /**
   * construct audit model
   */
  constructor() {
    // run super
    super(...arguments);

    // bind methods
    this.sanitise = this.sanitise.bind(this);
  }

  /**
   * sanitises acl class
   *
   * @return {*}
   */
  async sanitise() {
    // return object
    const sanitised = {
      id         : this.get('_id') ? this.get('_id').toString() : null,
      created_at : this.get('created_at'),
      updated_at : this.get('updated_at'),
    };

    // await hook
    await this.eden.hook('flow.sanitise', {
      sanitised,
      flow : this,
    });

    // return sanitised
    return sanitised;
  }
}

/**
 * export Flow model
 *
 * @type {Flow}
 */
module.exports = Flow;
