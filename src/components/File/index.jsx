import React, { useState, useEffect } from 'react';
import axios from 'axios';

const File = () => {
  const [chatId, setChatId] = useState(null);

  //   useEffect(() => {
  //     // Set the chat ID to listen to
  //     setChatId(process.env.REACT_APP_ChatId_1);

  //     // Start listening for updates
  //     const interval = setInterval(() => {
  //       axios
  //         .get(
  //           `https://api.telegram.org/bot${process.env.REACT_APP_BOT_TOKEN}/getUpdates?chat_id=${process.env.REACT_APP_ChatId_1}`
  //         )
  //         .then((response) => {
  //           const message = response.data.result[0].message;
  //           if (message.document) {
  //             // A file was uploaded in the chat
  //             const fileId = message.document.file_id;
  //             console.log(`File uploaded with ID: ${fileId}`);
  //             // Do something with the file ID here
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }, 5000);

  //     return () => clearInterval(interval);
  //   }, [chatId]);

  return (
    <div>
      <h1>Chat Listener</h1>
      <p>Listening for file uploads in chat </p>
    </div>
  );
};

export default File;
