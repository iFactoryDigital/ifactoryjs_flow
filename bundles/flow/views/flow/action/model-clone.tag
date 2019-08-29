<flow-action-model-clone>
  <div class="card card-flowing card-{ opts.element.color || 'primary' } mb-3 { opts.elementClass }">
    <div class="card-header">
      <div class="card-icon">
        <i class={ opts.element.icon } />
      </div>

      { opts.element.title }

    </div>
    <div class="card-body">
      Clone
      
      <eden-select class="d-inline-block w-auto ml-1 bg-light" ref="type" onchange={ onChange } type={ (opts.element.config || {}).type } placeholder="Select Type(s)">
        <option value="this" selected={ opts.type === 'this' || !opts.type }>This</option>
        <option value="existing" selected={ opts.type === 'existing' }>An Existing</option>
      </eden-select>

      Model

      <span if={ ['existing'].includes((opts.element.config || {}).type || 'this') }>
        <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChange } url="/admin/flow/models" model={ (opts.element.config || {}).model } placeholder="Select Model">
          <option if={ opts.model } value={ opts.model } selected>{ opts.model }</option>
        </eden-select>
      </span>

      <span if={ ['existing'].includes((opts.element.config || {}).type || 'this') }>
        where
        <eden-select ref="query" class="d-inline-block w-auto ml-1 bg-light" onchange={ onChange } type={ (opts.element.config || {}).query }>
          <option value="value" selected={ opts.type === 'value' }>It's value</option>
          <option value="id" selected={ opts.type === 'id' }>It's id</option>
        </eden-select>

        <span show={ ((opts.element.config || {}).query || 'value') === 'value' }>
          of
          <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="of" value={ (opts.element.config || {}).of } type="text" onchange={ onChange } />
          is
          <eden-select ref="is" class="d-inline-block w-auto ml-1 bg-light" onchange={ onChange } is={ (opts.element.config || {}).is }>
            <option value="eq" selected={ opts.is === 'eq' }>Equal To</option>
            <option value="ne" selected={ opts.is === 'ne' }>Not Equal To</option>
            <option value="gt" selected={ opts.is === 'gt' }>Greater Than</option>
            <option value="lt" selected={ opts.is === 'lt' }>Less Than</option>
          </eden-select>
          <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="value" value={ (opts.element.config || {}).value } type="text" onchange={ onChange } />
        </span>

        <span show={ (opts.element.config || {}).query === 'id' }>
          is
          <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="id" value={ (opts.element.config || {}).id } type="text" onchange={ onChange } />
        </span>
      </span>

    </div>
  </div>
  
  <script>
    /**
     * on change timing
     *
     * @param {Event} e
     */
    onChange(e) {
      // set config
      opts.element.config = {
        id    : this.refs.id ? this.refs.id.value : null,
        of    : this.refs.of ? this.refs.of.value : null,
        is    : this.refs.is ? this.refs.is.val() : null,
        type  : this.refs.type.val(),
        value : this.refs.value ? this.refs.value.value : null,
        query : this.refs.query ? this.refs.query.val() : null,
      };

      // set element
      opts.setElement(opts.element.uuid, {
        config : opts.element.config,
      });

      // update
      this.update();
    }
  </script>
</flow-action-model-clone>