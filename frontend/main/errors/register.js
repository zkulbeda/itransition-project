import { Button, Card, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { useContext } from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { UserContext } from '../componets/UserContextProvider';
import api from '../api';
import Layout from '../componets/Layout';
import EmailRegistrationError from './EmailRegistrationError.mjs';
import Input, { EmailRegexp } from '../componets/Input';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function LoginPage() {
  const router = useContext(RouterContext);
  const { user, updateUser, isUserLoggedIn } = useContext(UserContext);

  if (isUserLoggedIn) {
    router.replace('/');
    return null;
  }

  const onSubmit = async (values, actions) => {
    try {
      await api.post('/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      }).then((res) => {
        if (!res.data.success) throw res.data.error;
      }, (res) => {
        throw ((res.data && res.data.error) || res);
      });
      updateUser();
    } catch (e) {
      if (EmailRegistrationError.is(e)) {
        actions.setFieldError('email', e.message);
      } else throw e;
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    }
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
          initialValues={{ name: '', email: '', password: '' }}
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
                  name: 'name', label: 'Name', placeholder: 'Enter name', type: 'text',
                },
                {
                  name: 'email', label: 'Email address', placeholder: 'Enter email', type: 'email',
                },
                {
                  name: 'password', label: 'Password', placeholder: 'Enter password', type: 'password',
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
                {isSubmitting ? 'Loading...' : 'Register and log in'}
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Layout>
  );
}
