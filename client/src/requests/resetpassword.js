import Axios from "axios";

// request to send reset email from admin board
export const sendPasswordInvite = (id, email) => {
  return Axios({
    method: "POST",
    data: { id: id, email: email },
    withCredentials: true,
    url: "/api/reset-password",
  });
};

// check reset password token is valid when link clicked
export const checkPasswordToken = (token) => {
  return Axios({
    method: "GET",
    withCredentials: true,
    url: `/api/reset-password/${token}`,
  });
};

// send new password details
export const resetPassword = (credentials, token) => {
  return Axios({
    method: "POST",
    data: credentials,
    withCredentials: true,
    url: `/api/reset-password/${token}/set-password`,
  });
};
