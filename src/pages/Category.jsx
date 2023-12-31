import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayouts from "../layouts/MainLayouts";
import TravelCard from "../components/travelcard/TravelCard";
import Loader from "../components/spinner/Loader";
import { Col, Container, Row, Form } from "react-bootstrap";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import "../components/mynavbar/mynav.css";

const Category = () => {
	const { categoryName: initialCategoryName } = useParams();
	const [categoryName, setCategoryName] = useState(initialCategoryName);
	const [categoryTravels, setCategoryTravels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(0);

	const [currentPage, setCurrentPage] = useState(1);

	const handlePagination = value => {
		setCurrentPage(value);
	};

	const fetchCategoryTravels = async () => {
		setLoading(true);

		try {
			let response;

			if (categoryName) {
				response = await fetch(
					`${process.env.REACT_APP_SERVER_BASE_URL}/travels/category/${categoryName}?page=${currentPage}`
				);
			} else {
				response = await fetch(
					`${process.env.REACT_APP_SERVER_BASE_URL}/travels?page=${currentPage}`
				);
			}

			const data = await response.json();

			if (data.travels) {
				setCategoryTravels(data.travels);
				setTotalPages(data.totalPages);
			}

			setLoading(false);
		} catch (error) {
			console.error("Errore durante la richiesta GET", error);
			setLoading(false);
		}
	};

	const handleCategoryChange = event => {
		setCategoryName(event.target.value);
	};

	useEffect(() => {
		fetchCategoryTravels();
	}, [categoryName, currentPage]);

	return (
		<MainLayouts>
			<Container className="my-3 py-3 text-center justify-content-center bg-light border-bottom">
				<Form.Select
					aria-label="category"
					className=""
					value={categoryName}
					onChange={handleCategoryChange}
				>
					<option value="">Tutte le avventure</option>
					<option value="Glamping">Glamping</option>
					<option value="Yacht">Yacht</option>
					<option value="Relax">Relax</option>
					<option value="Sport">Sport</option>
				</Form.Select>

				<h2 className="mt-3 text-warning-emphasis fst-italic fontnew fw-semibold">
					{categoryName ? `Avventura ${categoryName}` : "Tutte le avventure"}
				</h2>

				{loading ? (
					<Loader />
				) : (
					<Row>
						{categoryTravels.map(travel => (
							<Col className="my-2" md={4} key={travel._id}>
								<TravelCard travel={travel} />
							</Col>
						))}
					</Row>
				)}
				<ResponsivePagination
					current={currentPage}
					total={totalPages}
					onPageChange={handlePagination}
				/>
			</Container>
		</MainLayouts>
	);
};

export default Category;
