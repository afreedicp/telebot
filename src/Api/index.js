import axios from './axios';

const longPoll = (successCB) => {
  axios
    .post(
      `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/getUpdates`
    )
    .then((response) => {
      console.log(response.data);
      successCB(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export { longPoll };
