import React from "react";
import { useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";

import LoginService from "../components/LoginService";

import swal from "sweetalert";

const LoginForm = () => {
  const [j1, setJ1] = useState({ email: "", password: "" });
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const submitForm = async (e) => {
    e.preventDefault();
    const recieveResponse = LoginService(email, password).then((x) => {
      swal(JSON.stringify(x));
    });
  };
  return (
    <div
      className="container center"
      style={{
        textAlign: "center",
      }}
    >
      <div className="row">
        <div className="col-md-12 offset-center rounded  mt-2 boader">
          {/* <div>
            <img
              src="https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
              alt="react logo"
              style={{ width: "100px" }}
            />
          </div> */}
          <Form form action="" onSubmit={submitForm}>
            <div className="mb-3">
              <Form.Group
                className="mb-2"
                controlId="formBasicEmail"
                Label
                for="email"
              >
                <input
                  //size="2"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  id="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                ></input>
              </Form.Group>
              <Form.Group className="mb-2" controlId="formBasicPassword">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                ></input>
              </Form.Group>
              <br></br>
              <div>
                <button
                  type="submit"
                  //className="btn btn-outline-success"
                  formMethod="post"
                  //   color="#2e2b2b"
                  //   textAlign="center"
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
