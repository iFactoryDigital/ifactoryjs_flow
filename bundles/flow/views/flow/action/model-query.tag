<flow-action-model-query>
  <div class="card card-flowing card-{ opts.element.color || 'primary' } mb-3 { opts.elementClass }">
    <div class="card-header">
      <div class="card-icon">
        <i class={ opts.element.icon } />
      </div>

      { opts.element.title }

    </div>
    <div class="card-body">
      Find 

      <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="count" value={ (opts.element.config || {}).count || 1 } type="number" onchange={ onCount } />
      <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChangeModel } url="/admin/flow/models" model={ (opts.element.config || {}).model } placeholder="Select Model">
        <option if={ opts.model } value={ opts.model } selected>{ opts.model }</option>
      </eden-select>

      model(s) where

      <div class="key-value mt-2">
        <div class="row mb-2" each={ set, i in (opts.element.config || {}).queries || [] }>
          <div class="col-3 pr-0">
            <input class="form-control bg-light" ref="key" value={ set.key } type="text" onchange={ onChange } placeholder="Key" />
          </div>
          <div class="col-2 pr-0">
            <select class="form-control bg-light" ref="method" value={ set.method } onchange={ onChange }>
              <option value="eq">==</option>
              <option value="ne">!=</option>
              <option value="gt">&gt;</option>
              <option value="lt">&lt;</option>
            </select>
          </div>
          <div class="col-5 pr-0">
            <div class="input-group">
              <div class="input-group-prepend">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  { capitalize(set.type || 'text') }
                </button>
                <div class="dropdown-menu">
                  <button class="dropdown-item" onclick={ onType } data-type="text">Text</button>
                  <button class="dropdown-item" onclick={ onType } data-type="number">Number</button>
                  <button class="dropdown-item" onclick={ onType } data-type="boolean">Boolean</button>
                </div>
              </div>
              <input class="form-control bg-light" ref="value" value={ set.value } type="text" onchange={ onChange } placeholder="Value" />
            </div>
          </div>
          <div class="col-2">
            <button class="btn btn-block btn-danger" onclick={ onRemoveQuery }>
              <i class="fa fa-times" />
            </button>
          </div>
        </div>

        <div class="row">
          <div class="ml-auto col-2">
            <button class="btn btn-block btn-success" onclick={ onAddQuery }>
              <i class="fa fa-plus" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script>

    /**
     * capitilize string
     */
    capitalize(s) {
      // check typeof
      if (typeof s !== 'string') return '';

      // return uppercase
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    /**
     * on change timing
     *
     * @param {Event} e
     */
    onAddQuery(e) {
      // prevent
      e.preventDefault();
      e.stopPropagation();

      // set values
      if (!opts.element.config) opts.element.config = {};
      if (!opts.element.config.queries) opts.element.config.queries = [];

      // push
      opts.element.config.queries.push({});

      // set element
      opts.setElement(opts.element.uuid, {
        config : opts.element.config,
      });

      // update
      this.update();
    }

    /**
     * on remove set
     *
     * @param {Event} e
     */
    onRemoveQuery(e) {
      // prevent
      e.preventDefault();
      e.stopPropagation();

      // splice out
      opts.element.config.queries.splice(e.item.i, 1);

      // set element
      opts.setElement(opts.element.uuid, {
        config : opts.element.config,
      });

      // update
      this.update();
    }

    /**
     * on remove set
     *
     * @param {Event} e
     */
    onType(e) {
      // set value
      opts.element.config.queries[e.item.i].type = jQuery(e.target).attr('data-type');

      // set element
      opts.setElement(opts.element.uuid, {
        config : opts.element.config,
      });

      // update
      this.update();
    }

    /**
     * on remove set
     *
     * @param {Event} e
     */
    onCount(e) {
      // set value
      opts.element.config.count = parseInt(jQuery(e.target).val());

      // set element
      opts.setElement(opts.element.uuid, {
        config : opts.element.config,
      });

      // update
      this.update();
    }

    /**
     * on remove set
     *
     * @param {Event} e
     */
    onChange(e) {
      // set value
      opts.element.config.queries[e.item.i][jQuery(e.target).attr('ref')] = e.target.value;

      // set element
      opts.setElement(opts.element.uuid, {
        config : opts.element.config,
      });

      // update
      this.update();
    }

    /**
     * on change timing
     *
     * @param {Event} e
     */
    onChangeModel(e) {
      // set config
      if (!opts.element.config) opts.element.config = {};

      // set model
      opts.element.config.model = jQuery(e.target).val();

      // set element
      opts.setElement(opts.element.uuid, {
        config : opts.element.config,
      });

      // update
      this.update();
    }
  </script>
</flow-action-model-query>