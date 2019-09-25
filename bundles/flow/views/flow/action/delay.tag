<flow-action-delay>
  <div class="card card-flowing card-{ opts.element.color || 'primary' } mb-3 { opts.elementClass }">
    <div class="card-header">
      <div class="card-icon">
        <i class={ opts.element.icon } />
      </div>

      { opts.element.title }

    </div>
    <div class="card-body">
      Delay executing the following flow elements for
      <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="amount" value={ (opts.element.config || {}).amount } type="number" onchange={ onChange } /> &nbsp;
      <eden-select ref="type" class="d-inline-block w-auto ml-1 bg-light" onchange={ onChange } type={ (opts.element.config || {}).type }>
        <option value="second" selected={ opts.type === 'second' }>Second(s)</option>
        <option value="minute" selected={ opts.type === 'minute' }>Minutes(s)</option>
        <option value="hour" selected={ opts.type === 'hour' }>Hour(s)</option>
      </eden-select>
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
          type   : this.refs.type.val(),
          amount : parseInt(this.refs.amount.value),
        }
      });
    }
  </script>
</flow-action-delay>