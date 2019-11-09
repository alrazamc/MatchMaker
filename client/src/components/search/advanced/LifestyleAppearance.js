import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form';
import { systemSelector } from '../../../store/selectors/systemSelector';
import CheckboxGroup from '../../library/form/CheckboxGroup';
import FormRow from '../../library/form/FormRow';
import RadioInput from '../../library/form/RadioInput';

const LifestyleAppearance = (props) => {
  let { diet, smoke, drink, bodyType, skinTone } = props.system;
  diet = useMemo(() => {
    if(diet.length === 0) return diet;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...diet];
  }, [diet]);

  bodyType = useMemo(() => {
    if(bodyType.length === 0) return bodyType;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...bodyType];
  }, [bodyType]);

  smoke = useMemo(() => {
    if(smoke.length === 0) return smoke;
    return [{
      id: 0,
      title: "Doesn't matter"
    }, ...smoke];
  }, [smoke]);

  useEffect(() => {
    if(typeof props.formValues.smoke !== 'undefined') return;
    props.dispatch(change(props.formName, 'smoke', 0));
  }, [props])

  drink = useMemo(() => {
    if(drink.length === 0) return drink;
    return [{
      id: 0,
      title: "Doesn't matter"
    }, ...drink];
  }, [drink]);

  useEffect(() => {
    if(typeof props.formValues.drink !== 'undefined') return;
    props.dispatch(change(props.formName, 'drink', 0));
  }, [props])

  skinTone = useMemo(() => {
    if(skinTone.length === 0) return skinTone;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...skinTone];
  }, [skinTone]);
  return (
    <>
      <FormRow label="Diet">
        <Field 
          component={CheckboxGroup}
          options={diet}
          name="diet"
          fullWidth={true}
          />
      </FormRow>
      <FormRow label="Smoke">
        <Field 
          component={RadioInput}
          options={smoke}
          name="smoke"
          fullWidth={true}
          />
      </FormRow>
      <FormRow label="Drink">
        <Field 
          component={RadioInput}
          defaultValue={0}
          options={drink}
          name="drink"
          fullWidth={true}
          />
      </FormRow>
      <FormRow label="Body Type">
        <Field 
          component={CheckboxGroup}
          options={bodyType}
          name="bodyType"
          fullWidth={true}
          />
      </FormRow>
      <FormRow label="Skin Tone">
        <Field 
          component={CheckboxGroup}
          options={skinTone}
          name="skinTone"
          fullWidth={true}
          />
      </FormRow>
    </>
  );
}


const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName)
  return {
    system: systemSelector(state, ['diet', 'smoke', 'drink', 'bodyType', 'skinTone']),
    formValues: selector(state, 'smoke', 'drink')
  }
}
 
export default connect(mapStateToProps)(LifestyleAppearance);