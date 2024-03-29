var EventEmitter = require('eventemitter3');
const eventEmitter = new EventEmitter();

const Holism = {
    isSomething: value => {
        return !Holism.isNothing(value);
    },
    isNothing: value => {
        return value === undefined || value === null || (/^\s*$/g.test(value));
    },
    on: (event, fn) => eventEmitter.on(event, fn),
    off: (event, fn) => eventEmitter.off(event, fn),
    emit: (event, payload) => eventEmitter.emit(event, payload),
    removeListener: (event, fn) => eventEmitter.removeListener(event, fn),
    listeners: (event) => eventEmitter.listeners(event),
    eventEmitter: eventEmitter,
    formSubmissionEvent: 'holism_form_submission_requested',
    componentLoaded: 'component_loaded',
    accountUpdated: 'account_updated',
    itemCreated: 'item_created',
    showMessage: 'show_message',
    reloadRequirement: 'reload_requirement',
    randomId: () => {
        return Math.random().toString(36).replace(/[^a-z]+/g, '');
    },
    addFieldToFormContext: (formContext, id, value, isValid) => {
        if (!id) {
            return;
        }
        const { fields, setFields } = formContext;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].id === id) {
                return;
            }
        }
        setFields((previousFields) => {
            return [{
                id: id,
                value: value,
                isValid: isValid
            }, ...previousFields]
        });
    },
    setField: (formContext, id, value, isValid) => {
        const { setFields } = formContext;
        setFields((previousFields) => {
            for (var i = 0; i < previousFields.length; i++) {
                if (previousFields[i].id === id) {
                    previousFields[i].value = value;
                    previousFields[i].isValid = isValid;
                }
            }
            return [...previousFields];
        });
    },
    ensure: (items) => {
        for (let i = 0; i < items.length; i++) {
            if (!items[i]) {
                throw new Error(`Required parameter is not specified`);
            }
        }
    },
    breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: 1536
    },
    success: (message, action) => {
        Holism.message(message, action, 'success');
    },
    info: (message, action) => {
        Holism.message(message, action, 'info');
    },
    warning: (message, action) => {
        Holism.message(message, action, 'warning');
    },
    error: (message, action) => {
        Holism.message(message, action, 'error');
    },
    message: (message, action, type) => {
        Holism.emit(Holism.showMessage, { message: message, action: action, type: type });
    }
};

export default Holism;