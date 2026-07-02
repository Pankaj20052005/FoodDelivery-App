import { useEffect, useState } from "react";
import API from "./api/axios";

function TestBackend() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/api/test")
      .then((res) => {
        setMessage(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
}

export default TestBackend;