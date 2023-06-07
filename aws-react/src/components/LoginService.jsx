const LoginService = async (email, password) => {
  const response = await fetch(`http://localhost:8080/api/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  const a = await response.json();

  console.log(a);

  return a;
};

export default LoginService;
