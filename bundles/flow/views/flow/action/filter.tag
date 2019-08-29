<flow-action-filter>
  <div class="card card-flowing card-{ opts.element.color || 'primary' } mb-3 { opts.elementClass }">
    <div class="card-header">
      <div class="card-icon">
        <i class={ opts.element.icon } />
      </div>

      { opts.element.title }

    </div>
    <div class="card-body">
      Only do the following flow elements when
      <eden-select ref="type" class="d-inline-block w-auto ml-1 bg-light" onchange={ onChange } type={ (opts.element.config || {}).type }>
        <option value="value" selected={ opts.type === 'value' }>The value</option>
        <option value="code" selected={ opts.type === 'code' }>The code</option>
      </eden-select>

      <span show={ ((opts.element.config || {}).type || 'value') === 'value' }>
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

      <span show={ (opts.element.config || {}).type === 'code' }>
        <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="code" value={ (opts.element.config || {}).code } type="text" onchange={ onChange } />
        returns true
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
      // set element
      opts.setElement(opts.element.uuid, {
        config : {
          of    : this.refs.of ? this.refs.of.value : null,
          is    : this.refs.is ? this.refs.is.val() : null,
          type  : this.refs.type.val(),
          code  : this.refs.code ? this.refs.code.value : null,
          value : this.refs.value ? this.refs.value.value : null,
        }
      });
    }
  </script>
</flow-action-filter>