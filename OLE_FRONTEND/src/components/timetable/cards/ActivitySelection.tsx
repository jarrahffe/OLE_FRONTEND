import React from 'react'
import { ClickContext } from '../../../contexts';
import { animated, useSpring } from '@react-spring/web';
import * as activities_data from '../../../config/activities.json';
import { Activity, makeActivity } from '../../../config/activity';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from 'formik';

type Props = {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
}

type FormValues = {
  name: string
}

const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
  // make a new activity, add to json, send request to backend
}

const ActivitySelection = (props: Props) => {

  const [springs, api] = useSpring(() => ({
    from: {
      backgroundImage: "linear-gradient(90deg, #FFFFFF -77.97%, #C1C1C1 258.37%)",
      height: "0%",
    }
  }));

  const initialFormValues: FormValues = {
    name: ""
  }

  React.useEffect(() => {
    api.start({
      from: {
        height: "0%",
        backgroundImage: "linear-gradient(90deg, #000000 -77.97%, #646464 258.37%)"
      },
      to: {
        height: "300%",
        backgroundImage: "linear-gradient(90deg, #FFFFFF -77.97%, #C1C1C1 258.37%)",
      }
    });
  }, [])


  return (
    <animated.div className='activity-selection' style={{ ...springs }}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={(values, actions) => handleSubmit(values, actions)}>

      </Formik>
    </animated.div>
  )
}

export default ActivitySelection
