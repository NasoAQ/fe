import React, { useState, useEffect } from "react";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
	XCircleFill,
	PlusCircleFill,
	PencilSquare,
} from "react-bootstrap-icons";
import TravelTable from "../traveltable/TravelTable";

const TravelForm = () => {
	const [file, setFile] = useState(null);
	const [formData, setFormData] = useState({
		title: "",
		category: "",
		price: "",
		content: "",
		cover: "",
	});
	const [travels, setTravels] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [editingTravel, setEditingTravel] = useState(null);

	const onChangeSetFile = e => {
		setFile(e.target.files[0]);
	};

	const uploadFile = async cover => {
		const fileData = new FormData();
		fileData.append("cover", cover);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_BASE_URL}/travels/cloudUpload`,
				{
					method: "POST",
					body: fileData,
				}
			);
			return await response.json();
		} catch (error) {
			console.log(error, "Errore in upload file");
		}
	};

	const onSubmit = async e => {
		e.preventDefault();

		if (editingTravel) {
			return;
		}

		if (file) {
			try {
				const uploadCover = await uploadFile(file);
				const finalBody = {
					...formData,
					cover: uploadCover.cover,
				};
				const response = await fetch(
					`${process.env.REACT_APP_SERVER_BASE_URL}/travels/create`,
					{
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
						body: JSON.stringify(finalBody),
					}
				);
				setFormData({
					title: "",
					category: "",
					cover: "",
					price: "",
					content: "",
				});
				setFile(null);
				return response.json();
			} catch (error) {
				console.log(error);
			}
		} else {
			console.error("Seleziona un file");
		}
	};

	const handleDeleteTravel = async id => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_BASE_URL}/travels/delete/${id}`,
				{
					method: "DELETE",
				}
			);

			if (response.status === 200) {
				const updatedTravels = travels.filter(travel => travel._id !== id);
				setTravels(updatedTravels);
			} else {
				console.error("Errore durante l'eliminazione del viaggio");
			}
		} catch (error) {
			console.error("Errore durante l'eliminazione del viaggio", error);
		}
	};

	const handleEdit = async travel => {
		setEditingTravel(travel);
		setFormData({
			title: travel.title,
			category: travel.category,
			price: travel.price,
			content: travel.content,
		});
		if (editingTravel) {
			try {
				const uploadCover = await uploadFile(file);
				const finalBody = {
					...formData,
					cover: uploadCover.cover,
				};
				const response = await fetch(
					`${process.env.REACT_APP_SERVER_BASE_URL}/travels/update/${editingTravel._id}`,
					{
						headers: {
							"Content-Type": "application/json",
						},
						method: "PATCH",
						body: JSON.stringify(finalBody),
					}
				);

				if (response.status === 200) {
					// Aggiorna la lista dei viaggi dopo la modifica
					const updatedTravels = travels.map(travel =>
						travel._id === editingTravel._id
							? { ...travel, ...finalBody }
							: travel
					);
					setTravels(updatedTravels);

					// Resetta il form di modifica
					setEditingTravel(null);
					setFormData({
						title: "",
						category: "",
						price: "",
						content: "",
					});
				} else {
					console.error("Errore durante la modifica del viaggio");
				}
			} catch (error) {
				console.error("Errore durante la modifica del viaggio", error);
			}
		}
	};

	const handleCancelEdit = () => {
		setEditingTravel(null);
		setFormData({
			title: "",
			category: "",
			price: "",
			content: "",
			cover: "",
		});
	};

	const handlePagination = value => {
		setCurrentPage(value);
	};

	useEffect(() => {
		// Effettua la richiesta GET ai viaggi quando il componente si monta
		fetch(
			`${process.env.REACT_APP_SERVER_BASE_URL}/travels?page=${currentPage}`
		)
			.then(response => response.json())
			.then(data => {
				if (data.travels) {
					setTravels(data.travels);
					setTotalPages(data.totalPages);
				}
			})
			.catch(error => {
				console.error("Errore durante la richiesta GET", error);
			});
	}, [currentPage]);

	return (
		<>
			<Container className="my-3 py-3 bg-light border-bottom">
				<Row>
					<h5 className="text-warning-emphasis">Gestione travels</h5>
				</Row>
				<Form onSubmit={onSubmit}>
					<Row encType="multipart/form-data">
						<Col>
							<input
								type="text"
								placeholder="Title"
								aria-label="Title"
								className="form-control form-control-sm"
								value={formData.title || ""}
								onChange={e =>
									setFormData({
										...formData,
										title: e.target.value,
									})
								}
							/>
						</Col>
						<Col>
							<input
								type="text"
								placeholder="Category"
								aria-label="Category"
								className="form-control form-control-sm"
								value={formData.category || ""}
								onChange={e =>
									setFormData({
										...formData,
										category: e.target.value,
									})
								}
							/>
						</Col>
						<Col>
							<input
								type="file"
								placeholder="Cover"
								aria-label="Cover"
								className="form-control form-control-sm"
								name="cover"
								onChange={onChangeSetFile}
							/>
						</Col>
						<Col>
							<input
								type="number"
								placeholder="price"
								aria-label="price"
								min={1}
								className="form-control form-control-sm"
								value={formData.price || ""}
								onChange={e =>
									setFormData({
										...formData,
										price: e.target.value,
									})
								}
							/>
						</Col>
						<Row className="my-2">
							<Col>
								<input
									type="text"
									placeholder="Content"
									aria-label="Content"
									className="form-control form-control-sm"
									value={formData.content || ""}
									onChange={e =>
										setFormData({
											...formData,
											content: e.target.value,
										})
									}
								/>
							</Col>
							<Col className="d-flex justify-content-end px-0">
								{editingTravel ? (
									<div>
										<button
											type="button"
											className="btn btn-secondary btn-sm mx-2"
											onClick={handleCancelEdit}
										>
											<XCircleFill />
										</button>
										<button
											type="submit"
											className="btn btn-warning btn-sm mr-2"
											onClick={handleEdit}
										>
											<PencilSquare />
										</button>
									</div>
								) : (
									<button type="submit" className="btn btn-primary btn-sm">
										<PlusCircleFill />
									</button>
								)}
							</Col>
						</Row>
					</Row>
				</Form>
				<TravelTable
					travels={travels}
					onDelete={handleDeleteTravel}
					onEdit={handleEdit}
				/>
				<ResponsivePagination
					current={currentPage}
					total={totalPages}
					onPageChange={handlePagination}
				/>
			</Container>
		</>
	);
};

export default TravelForm;