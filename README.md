# EdenJS - Flow
[![TravisCI](https://travis-ci.com/eden-js/flow.svg?branch=master)](https://travis-ci.com/eden-js/flow)
[![Issues](https://img.shields.io/github/issues/eden-js/flow.svg)](https://github.com/eden-js/flow/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eden-js/flow)
[![Awesome](https://img.shields.io/badge/awesome-true-green.svg)](https://github.com/eden-js/flow)
[![Discord](https://img.shields.io/discord/583845970433933312.svg)](https://discord.gg/5u3f3up)

Flow Builder base logic component for [EdenJS](https://github.com/edenjs-cli)

`@edenjs/flow` creates a drag and droppable flow builder in admin for administering flows.

## Setup

### Install

```
npm i --save @edenjs/flow
```

### Configure

No configuration is required for this module

## Models


### `Flow` _[Usage](https://github.com/eden-js/flow/blob/master/bundles/flow/models/flow.js)_

Flow model consits of a single entry for flow created.

#### Example

```js
// load model
const Flow = model('flow');

// get first entry
const entry = await Flow.findOne();

// data used in frontend
const data = await entry.sanitise();
```

## Hooks

### `flow.build` _[Usage](https://github.com/eden-js/flow/blob/master/bundles/flow/controllers/admin.js#L59)_ _[Usage](https://github.com/eden-js/flow/blob/master/bundles/flow/controllers/admin.js#L263)_


Flow Build hook fires any time we want to setup new flow elements.

#### Example

```js
  /**
   * setup flow hook
   *
   * @pre flow.build
   */
  flowSetupHook(flow) {
    // create trigger
    flow.trigger('trigger', {

    ...
  }
```

## Flow Elements

### `trigger` _[Usage](https://github.com/eden-js/flow/blob/master/bundles/flow/controllers/admin.js#L270)_

Flow Triggers are used to define when and how a flow should be started. 

#### Example

```js
  /**
   * setup flow hook
   *
   * @pre flow.build
   */
  flowSetupHook(flow) {
    // create trigger
    flow.trigger('interval', { // name and create flow trigger, these can be taken over
      icon  : 'fa fa-clock', // set icon for flow drag in element
      title : '30 second trigger', // set title for flow drag in element
    }, (action, render) => {
      // any async logic that needs to be added to the render method can be added here
    }, (run, cancel, query) => {
      // run is a function that is run whenever this flow should be triggered
      // query is a query on the model `Flow` that can be returned changed

      // run trigger every 30 seconds
      setInterval(() => run({
        query : query.where({ // only run flows matching this query (optional)
          'test' : true,
        }),
        value : {},
      }), 30000);
    });
  }
```

### `action` _[Usage](https://github.com/eden-js/flow/blob/master/bundles/flow/controllers/admin.js#L428)_

Flow Actions are used to define how this flow should proceed with data.

#### Example

```js
  /**
   * setup flow hook
   *
   * @pre flow.build
   */
  flowSetupHook(flow) {
    // create action
    flow.action('email', { // name and crew flow action, these can be taken over
      tag   : 'email', // this will render the tag `action-email` in the admin flow manager
      icon  : 'fa fa-envelope', // set icon for flow drag in element
      title : 'Send Email', // set title for flow drag in element
    }, (action, render) => {
      // any async logic that needs to be added to the render method can be added here
    }, async (opts, element, model) => {
      // set config
      element.config = element.config || {};

      // send model
      if (model instanceof Model) {
        // sanitise model
        model = await model.sanitise();
      }

      // send email
      await emailHelper.send((tmpl.tmpl(element.config.to || '', model)).split(',').map(i => i.trim()), 'blank', {
        body    : tmpl.tmpl(element.config.body || '', model),
        subject : tmpl.tmpl(element.config.subject || '', model),
      });

      // return true to signify that this flow can be continued
      return true;
    });
  }
```