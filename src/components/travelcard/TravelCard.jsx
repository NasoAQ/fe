import React from "react";
import { Link } from "react-router-dom";

import { Card, Button } from "react-bootstrap";

const TravelCard = props => {
	const { _id, title, category, price, content, cover } = props.travel;

	return (
		<Card className="h-100 mycard">
			<Card.Img variant="top" src={cover} alt={title} />
			<Card.Body>
				<Card.Subtitle className="mb-2 text-muted">{category}</Card.Subtitle>
				<Card.Title className="text-warning-emphasis">{title}</Card.Title>
				<Button
					as={Link}
					to={`/details/${_id}`}
					variant="warning"
					className="btn-sm"
				>
					Dettagli
				</Button>
			</Card.Body>
		</Card>
	);
};

export default TravelCard;
