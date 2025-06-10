import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import Headline from "../shared/Headline";

const BlogCard = ({
  title,
  content,
  width= "28rem",
  img = "https://shorturl.at/aV135",
  func,
}) => {
  return (
    <Card style={{ width: width }}>
      <Card.Img variant="top" src={img} style={{ padding: "12px", height: "300px" }} />
      <Card.Body>
        <Card.Title>
          <Headline spacer="12px" fontSize="18px" text={title} />
        </Card.Title>
        <Card.Text>{content}</Card.Text>
        <Button variant="link" onClick={func}>
          Read more...
        </Button>
      </Card.Body>
    </Card>
  );
};

BlogCard.propTypes = {
  content: PropTypes.string,
  func: PropTypes.func,
  img: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.string,
};

export default BlogCard;
