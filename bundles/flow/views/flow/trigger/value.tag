<flow-trigger-value>
  <div class="card-body">
    This Flow will start on the model

    <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChangeModel } url="/admin/flow/models" model={ this.data.model } placeholder="Select Model">
      <option if={ opts.model } value={ opts.model } selected>{ opts.model }</option>
    </eden-select>

    value

    <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="value" type="text" />
  </div>

  <script>
    // set data
    this.data = opts.item.data || {};

    /**
     * on change when
     *
     * @param {Event} e
     */
    onChangeWhen(e) {
      // set when
      this.data.when = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }

    /**
     * on change model
     *
     * @param {Event} e
     */
    onChangeModel(e) {
      // model
      this.data.model = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }

    /**
     * on change when
     *
     * @param {Event} e
     */
    onChangeEvent(e) {
      // set when
      this.data.event = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }
  </script>
</flow-trigger-value>