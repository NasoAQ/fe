import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import Loader from "../spinner/Loader";

const RegistrationForm = () => {
	const [file, setFile] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		avatar: "",
	});
	const [validated, setValidated] = useState(false);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const onChangeSetFile = e => {
		setFile(e.target.files[0]);
	};

	const uploadFile = async avatar => {
		const fileData = new FormData();
		fileData.append("avatar", avatar);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_BASE_URL}/users/cloudUpload`,
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
		e.stopPropagation();
		setValidated(true);

		const finalBody = { ...formData };

		if (file) {
			try {
				setLoading(true);
				const uploadAvatar = await uploadFile(file);
				finalBody.avatar = uploadAvatar.avatar;
			} catch (error) {
				setLoading(false);
				console.error("Errore durante il caricamento dell'avatar", error);
				return;
			}
		}

		try {
			setLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_BASE_URL}/users/create`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(finalBody),
				}
			);

			if (response.status === 201) {
				console.log("Utente creato con successo.");
				const loginResponse = await fetch(
					`${process.env.REACT_APP_SERVER_BASE_URL}/login`,
					{
						headers: {
							"Content-type": "application/json",
						},
						method: "POST",
						body: JSON.stringify({
							email: formData.email,
							password: formData.password,
						}),
					}
				);
				const data = await loginResponse.json();
				if (loginResponse.status === 200) {
					localStorage.setItem("loggedInUser", JSON.stringify(data.token));
					navigate("/");
				}
			} else {
				alert("Errore durante la registrazione. Si prega di riprovare.");
			}
		} catch (error) {
			setLoading(false);
			console.error("Errore durante la creazione dell'utente:", error);
		}
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<Container className="sm my-3 py-1 bg-light border-bottom d-flex justify-content-center">
			{loading ? (
				<Loader />
			) : (
				<Row className="d-flex flex-column justify-content-center">
					<h3 className="text-warning-emphasis fontnew fst-italic fw-semibold text-center">
						Registra un nuovo account
					</h3>
					<Form
						noValidate
						validated={validated}
						className="my-3"
						autoComplete="off"
						onSubmit={onSubmit}
					>
						<Form.Group as={Col} controlId="validationCustom01">
							<Form.Label>Nome</Form.Label>
							<Form.Control
								required
								name="name"
								type="text"
								placeholder="nome"
								onChange={handleInputChange}
							/>
							<Form.Control.Feedback type="invalid">
								Inserisci un nome.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} controlId="validationCustom02">
							<Form.Label>Username</Form.Label>
							<Form.Control
								required
								name="username"
								type="text"
								placeholder="username"
								onChange={handleInputChange}
							/>
							<Form.Control.Feedback type="invalid">
								Inserisci un username.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} controlId="validationCustom03">
							<Form.Label>E-mail</Form.Label>
							<Form.Control
								name="email"
								required
								type="email"
								placeholder="e-mail"
								onChange={handleInputChange}
							/>
							<Form.Control.Feedback type="invalid">
								Inserisci un e-mail valida.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} controlId="validationCustom04">
							<Form.Label>Password</Form.Label>
							<Form.Control
								required
								name="password"
								type="password"
								placeholder="password"
								onChange={handleInputChange}
								//min={8}
							/>
							<Form.Control.Feedback type="invalid">
								Inserisci una password valida.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} controlId="validationCustom05">
							<Form.Label>Avatar</Form.Label>
							<Form.Control
								name="avatar"
								type="file"
								placeholder="avatar"
								onChange={onChangeSetFile}
							/>
						</Form.Group>
						<Col className="my-2 d-flex flex-column">
							<Button type="submit" variant="warning">
								Registra
							</Button>
						</Col>
					</Form>
					<Col>
						<Link
							to={"/login"}
							className="d-flex align-items-center text-xs font-weight-light text-center text-muted"
						>
							<span className="ml-2">Hai già un account?</span>
						</Link>
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default RegistrationForm;
