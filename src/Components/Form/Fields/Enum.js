import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import useLocalStorageState from '../../../Base/UseLocalStorageState';
import Holism from '../../../Base/Holism';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { get } from '../../../Base/Api';
import { FormContext } from '../Form';
import { fieldStyles } from './FieldStyle';

const Enum = ({ column, entity, placeholder, hint, value, required }) => {

    if (Holism.isNothing(entity)) {
        throw new Error(`entity is not provided for ${Enum.name}`);
    }

    const [id, setId] = useState(null);
    const [currentValue, setCurrentValue] = useState(value);
    const [labelId, setLabelId] = useState(null);
    const htmlSelect = useRef();
    const [helpText, setHelpText] = useState(hint);
    const [loading, setLoading] = useState();
    const [enumItems, setEnumItems] = useLocalStorageState([], entity + 'Enum');
    const initialHint = hint;
    const [validationResult, setValidationResult] = useState(null);
    var formContext = useContext(FormContext);

    useEffect(() => {
        setId(`enum_${column}`);
    }, [column]);

    useEffect(() => {
        setLabelId(`${id}_label`);
        Holism.addFieldToFormContext(formContext, id, undefined, false);
        var handler = () => {
            validate();
        };
        Holism.on(Holism.formSubmissionEvent, handler);
        return () => {
            Holism.removeListener(Holism.formSubmissionEvent, handler);
        }
    }, [id, formContext])

    useEffect(() => {
        if (enumItems.length !== 0) {
            return;
        }
        setLoading(true);
        get(`/${entity}/all`).then(data => {
            console.log(data);
            setEnumItems(data);
            setLoading(false);
        }, error => {
            console.log(error);
            setLoading(false);
        })
    }, []);

    useEffect(() => {
        validate();
    }, [currentValue]);

    const validate = (event) => {
        console.log(currentValue);
        if (required && Holism.isNothing(currentValue)) {
            setValidationResult('invalid required');
            setHelpText(required);
        }
        else {
            setValidationResult(null);
            setHelpText(initialHint);
        }
        Holism.setField(formContext, id, currentValue, validationResult ? false : true);
    }

    useEffect(() => {
        Holism.setField(formContext, id, currentValue, validationResult ? false : true);
    }, [validationResult]);

    return <div className={fieldStyles}>
        {
            loading
                ?
                <div>loadin...</div>
                :
                <FormControl
                    fullWidth
                    error={validationResult ? true : false}
                >
                    <InputLabel id={labelId}>{placeholder}</InputLabel>
                    <Select
                        ref={htmlSelect}
                        error={validationResult ? true : false}
                        required={validationResult ? true : false}
                        placeholder={placeholder}
                        defaultValue={value || ""}
                        fullWidth
                        onChange={(event) => { setCurrentValue(event.target.value); }}
                        value={value}
                    >
                        {enumItems.map(item => <MenuItem key={item.id} value={item.id}>{item.key}</MenuItem>)}
                    </Select>
                    <FormHelperText>{helpText}</FormHelperText>
                </FormControl>
        }
    </div>
};

export { Enum };
