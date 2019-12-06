<flow-trigger-cron>
  <div class="card-body">
    This Flow will run

    <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChangeWhen } placeholder="Select When" when={ this.data.when || '' }>
      <option>Select When</option>
      <option value="hour" selected={ opts.when.includes('hour') }>Every Hour</option>
      <option value="week" selected={ opts.when.includes('week') }>Every Week</option>
      <option value="month" selected={ opts.when.includes('month') }>Every Month</option>
      <option value="minute" selected={ opts.when.includes('minute') }>Every Minute</option>
    </eden-select>

    <span if={ !['hour', 'minute'].includes(this.data.when) }>on</span>

    <span if={ this.data.when.includes('week') }>
      <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChangeDay } placeholder="Select Day" day={ this.data.day || '' } days={ this.days }>
        <option>Select Day</option>
        <option each={ day, i in opts.days } value={ day.toLowerCase() } selected={ opts.day.includes(day.toLowerCase()) }>{ day }</option>
      </eden-select>

      at

      <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="value" type="time" onchange={ onChangeTime } value={ this.data.time } />
    </span>

    <span if={ this.data.when.includes('month') }>
      the

      <div class="input-group d-inline-flex w-25 ml-1">
        <input class="form-control bg-light" ref="value" type="number" max="31" min="1" onchange={ onChangeDay } value={ this.data.day || 1 } />
        <div class="input-group-append">
          <span class="input-group-text">
            { nth(this.data.day || 1) }
          </span>
        </div>
      </div>

      at

      <input class="form-control d-inline-block w-25 ml-1 bg-light" ref="value" type="time" onchange={ onChangeTime } value={ this.data.time } />
    </span>
  </div>

  <script>
    // set data
    this.data = opts.item.data || {
      when : 'month',
    };

    // days
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    /**
     * nth
     */
    nth(d) {
      // return th
      if (d > 3 && d < 21) return 'th';

      // return type
      switch (d % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
      }
    }

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
    onChangeDay(e) {
      // model
      this.data.day = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }

    /**
     * on change time
     *
     * @param {Event} e
     */
    onChangeTime(e) {
      // model
      this.data.time = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }
  </script>
</flow-trigger-cron>