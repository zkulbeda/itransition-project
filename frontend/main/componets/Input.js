import { Form } from 'react-bootstrap';

export const EmailRegexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function Input({
  values, touched, errors, handleChange, handleBlur, name, type, placeholder, children,
}) {
  return (
    <Form.Group controlId={`form-${name}`}>
      <Form.Label>{children}</Form.Label>
      <Form.Control
        value={values[name]}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        type={type}
        placeholder={placeholder}
        isValid={touched[name] && !errors[name]}
        isInvalid={touched[name] && !!errors[name]}
      />
      {console.log(errors)}
      <Form.Control.Feedback type="invalid">
        {errors[name]}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
