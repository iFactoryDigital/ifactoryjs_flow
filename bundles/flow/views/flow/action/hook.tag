<flow-action-hook>
  <div class="card card-flowing card-{ opts.element.for } mb-3 { opts.elementClass }">
    <div class="card-header">
      <div class="card-icon">
        <i class={ opts.element.icon } />
      </div>

      { opts.element.title }

    </div>
    <div class="card-body">
      Await the hook 
      <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="hook" value={ (opts.element.config || {}).hook } type="text" onchange={ onChange } />
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
          hook : this.refs.hook.value,
        }
      });
    }
  </script>
</flow-action-hook>