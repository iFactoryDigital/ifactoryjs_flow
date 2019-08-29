
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
  async sanitise(helper) {
    // return object
    const sanitised = {
      id         : this.get('_id') ? this.get('_id').toString() : null,
      tree       : this.get('tree') || [],
      title      : this.get('title'),
      items      : this.get('items') || [],
      trigger    : this.get('trigger'),
      created_at : this.get('created_at'),
      updated_at : this.get('updated_at'),
    };

    // render
    if (helper) {
      // set render
      sanitised.render = {};

      // await promise
      await Promise.all(sanitised.items.map(async (item) => {
        // set fields
        const fields = helper.actions();

        // get field
        const field = fields.find(f => f.type === item.type);

        // get data
        const data = {};
        const action = Object.assign(item.opts || {}, item);

        // messy render
        if (field) await field.render(action, data);

        // render data
        sanitised.render[item.uuid] = data;
      }));
    }


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
