import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import * as auth from "../../store/ducks/auth.duck";
import { register } from "../../crud/auth.crud";


function Registration(props) {
  const { intl } = props;
  // const [loading, setLoading] = useState(false);
  // const [loadingButtonStyle, setLoadingButtonStyle] = useState({
  //   paddingRight: "2.5rem"
  // });

  // const enableLoading = () => {
  //   setLoading(true);
  //   setLoadingButtonStyle({ paddingRight: "3.5rem" });
  // };

  // const disableLoading = () => {
  //   setLoading(false);
  //   setLoadingButtonStyle({ paddingRight: "2.5rem" });
  // };

  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>
            <FormattedMessage id="AUTH.REGISTER.TITLE" />
          </h3>
        </div>

        <Formik
          initialValues={{
            email: "",
            profilePictureLink: "",
            username: "",
            password: "",
            acceptTerms: true,
            confirmPassword: ""
          }}
          validate={values => {
            const errors = {};

            if (!values.email) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_FIELD"
              });
            }

            if (!values.profilePictureLink) {
              errors.profilePictureLink = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.username) {
              errors.username = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.password) {
              errors.password = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.confirmPassword) {
              errors.confirmPassword = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            } else if (values.password !== values.confirmPassword) {
              errors.confirmPassword =
                "Password and Confirm Password didn't match.";
            }

            if (!values.acceptTerms) {
              errors.acceptTerms = "Accept Terms";
            }

            return errors;
          }}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            register(
              values.email,
              values.profilePictureLink,
              values.username,
              values.password
            )
              .then(({ data: { accessToken } }) => {
                props.register(accessToken);
              })
              .catch(() => {
                setSubmitting(false);
                setStatus(
                  intl.formatMessage({
                    id: "AUTH.VALIDATION.INVALID_LOGIN"
                  })
                );
              });
          }}
        >
          {({
            values,
            status,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              {status && (
                <div role="alert" className="alert alert-danger">
                  <div className="alert-text">{status}</div>
                </div>
              )}

              <div className="form-group mb-0">
                <TextField
                  label="Email"
                  margin="normal"
                  className="kt-width-full"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                />
              </div>

              <div className="form-group mb-0">
                <TextField
                  margin="normal"
                  label="Username"
                  className="kt-width-full"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  helperText={touched.username && errors.username}
                  error={Boolean(touched.username && errors.username)}
                />
              </div>

              <div className="form-group mb-0">
                <TextField
                  margin="normal"
                  label="profilePictureLink"
                  className="kt-width-full"
                  name="profilePictureLink"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.profilePictureLink}
                  helperText={touched.profilePictureLink && errors.profilePictureLink}
                  error={Boolean(touched.profilePictureLink && errors.profilePictureLink)}
                />
              </div>

              <div className="form-group mb-0">
                <TextField
                  type="password"
                  margin="normal"
                  label="Password"
                  className="kt-width-full"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password && errors.password)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="password"
                  margin="normal"
                  label="Confirm Password"
                  className="kt-width-full"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  error={Boolean(
                    touched.confirmPassword && errors.confirmPassword
                  )}
                />
              </div>

              <div className="form-group mb-0">
                <FormControlLabel
                  label={
                    <>
                      I agree the{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms & Conditions
                      </Link>
                    </>
                  }
                  control={
                    <Checkbox
                      color="primary"
                      name="acceptTerms"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      checked={values.acceptTerms}
                    />
                  }
                />
              </div>

              <div className="kt-login__actions">
                

                <Link to="/auth">
                  <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary">
                    Back
                  </button>
                </Link>

                <button
                  disabled={isSubmitting || !values.acceptTerms}
                  className="btn btn-primary btn-elevate kt-login__btn-primary"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}
        </Formik>
        <div className="kt-login__options">
        <Link to="http://facebook.com" className="btn btn-primary kt-btn">
          <i className="fab fa-facebook-f" />
          Sign Up by Facebook
        </Link>
        <Link to="google.com" className="btn btn-danger kt-btn">
          <i className="fab fa-google" />
          Sign Up by Google
        </Link>
        <Link to="http://twitter.com" className="btn btn-info kt-btn">
          <i className="far fa-envelope" />
          Sign Up by Email
        </Link>
      </div>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Registration)
);
