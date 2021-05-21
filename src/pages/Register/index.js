import { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/api';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      // eslint-disable-next-line no-unused-vars
      formErrors = true;
      toast.error('Nome deve ter entre 3 a 255 caracteres.');
    }

    if (!isEmail(email)) {
      // eslint-disable-next-line no-unused-vars
      formErrors = true;
      toast.error('Email inválido.');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 a 50 caracteres.');
    }

    if (formErrors) return;
    const newUser = {
      nome,
      email,
      password,
    };
    try {
      await axios.post('/users', newUser);

      toast.success('Você fez seu cadastro');
      history.push('/login');
    } catch (err) {
      const errors = get(err, 'response.data.errors', []);

      errors.map((erro) => toast.error(erro));
    }
  }

  return (
    <Container>
      <h1>Crie sua conta</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="none">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
          />
        </label>

        <label htmlFor="none">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
          />
        </label>

        <label htmlFor="none">
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
        </label>

        <button type="submit">Criar minha conta</button>
      </Form>
    </Container>
  );
}

export default Register;
