import React, { useState } from 'react';
import styled from 'styled-components';

// Estilos con styled-components (puedes usar tu propio CSS si prefieres)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-bottom: 5px;
`;

const Input = styled.input`
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const Message = styled.p`
    color: ${props => props.error ? 'red' : 'green'};
    margin-top: 10px;
`;

const RegistroUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [foto, setFoto] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!nombre || !dni || !foto) {
            setMessage('Por favor, llena todos los campos.');
            setLoading(false);
            return;
        }

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                const response = await fetch('http://localhost:3000/api/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, dni, foto: base64 }),
                });

                if (response.ok) {
                    setMessage('Usuario registrado correctamente!');
                    setNombre('');
                    setDni('');
                    setFoto(null);
                } else {
                    const errorData = await response.json();
                    setMessage(`Error: ${errorData.error || 'Error desconocido'}`);
                }
                setLoading(false);
            };
            reader.readAsDataURL(foto);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <Container>
            <h1>Registro de Usuario</h1>
            <Message error={message.startsWith('Error') ? 'true' : 'false'}>{message}</Message>
            {loading && <p>Cargando...</p>}
            <Form onSubmit={handleSubmit}>
                <Label>Nombre:</Label>
                <Input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <Label>DNI:</Label>
                <Input type="text" value={dni} onChange={e => setDni(e.target.value)} required />
                <Label>Foto:</Label>
                <Input type="file" onChange={e => setFoto(e.target.files[0])} accept="image/*" required />
                <Button type="submit">Registrar</Button>
            </Form>
        </Container>
    );
};

export default RegistroUsuario;