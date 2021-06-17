import React from "react";
import { Toast, Row, Col } from "react-bootstrap";
import { ToastMessageProps } from "../hooks/toast";
import { useToast } from "../hooks/toast";

interface ToastProps {
  messages: ToastMessageProps[];
}
const ShowToast: React.FC<ToastProps> = ({ messages }) => {
  const [show, setShow] = React.useState(true);
  const { removeToast } = useToast();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(messages && messages.length && messages[0].id);
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [messages && messages.length && messages[0].id]);
  React.useEffect(() => {
    setShow(true);
  }, [messages]);

  return (
    <Row>
      {messages.map((msg: any, idx: number) => (
        <Col xs={6} key={msg.id}>
          <Toast
            style={{ position: "absolute", top: 130, right: 5 }}
            onClose={() => setShow((prev) => !prev)}
            show={show}
            delay={3000}
            autohide
            key={msg.id}
          >
            <Toast.Header closeButton={false}>
              <strong className="mr-auto">{msg.title}</strong>
              {/* <small>11 mins ago</small> */}
            </Toast.Header>
            <Toast.Body>{msg.message}</Toast.Body>
          </Toast>
        </Col>
      ))}
    </Row>
  );
};
export default ShowToast;
