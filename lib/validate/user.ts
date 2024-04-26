export const validateUser = (
  name: string,
  email: string,
  tel: string,
  password: string,
  role: string
) => {
  if (!name || !email || !tel || !password || !role) {
    return false;
  }
  if (
    !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ||
    !tel.match(/^0[0-9]{9}$/) ||
    password.length < 6
  ) {
    return false;
  }
  if (role !== "user" && role !== "admin") {
    return false;
  }
  return true;
};
