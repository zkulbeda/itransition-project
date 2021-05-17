import {
  Button,
  Card,
  Form,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useContext } from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import Layout from '../componets/Layout';
import api from '../api';
import EmailLogInError from '../../../errors/Authorization/EmailLogInError';
import PasswordLogInError from '../../../errors/Authorization/PasswordLogInError';
import { UserContext } from '../componets/UserContextProvider';
import Input, { EmailRegexp } from '../componets/Input';

export default function LoginPage() {
  const router = useContext(RouterContext);
  const {
    user,
    updateUser,
    isUserLoggedIn,
  } = useContext(UserContext);

  if (isUserLoggedIn) {
    router.replace('/');
    return null;
  }

  const onSubmit = async (values, actions) => {
    console.log('ffff');
    try {
      await api.post('/login', {
        email: values.email,
        password: values.password,
      })
        .then((res) => {
          if (!res.data.success) throw res.data.error;
        }, (res) => {
          throw ((res.data && res.data.error) || res);
        });
      updateUser();
    } catch (e) {
      if (EmailLogInError.is(e)) {
        actions.setFieldTouched('password', false);
        actions.setFieldError('email', e.message);
      } else if (PasswordLogInError.is(e)) {
        actions.setFieldError('password', e.message);
      } else {
        throw e;
      }
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!EmailRegexp.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  };

  return (
    <Layout>
      <Card body>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              {[
                {
                  name: 'email',
                  label: 'Email address',
                  placeholder: 'Enter email',
                  type: 'email',
                },
                {
                  name: 'password',
                  label: 'Password',
                  placeholder: 'Enter password',
                  type: 'password',
                },
              ].map((i) => (
                <Input
                  name={i.name}
                  placeholder={i.placeholder}
                  type={i.type}
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  key={i.name}
                >
                  {i.label}
                </Input>
              ))}
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : 'Log in'}
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Layout>
  );
}
