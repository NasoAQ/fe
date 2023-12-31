import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
	return (
		<Spinner animation="border" variant="secondary" role="status">
			<span className="visually-hidden">Caricamento...</span>
		</Spinner>
	);
};

export default Loader;
