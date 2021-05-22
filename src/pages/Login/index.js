import { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import * as actions from '../../store/module/auth/actions';
import Loading from '../../components/Loading';

function Login(props) {
  const dispatch = useDispatch();
  const prevPath = get(props, 'location.state.prevPath', '/');
  const isLoading = useSelector((state) => state.auth.isLoading);
  const history = get(props, 'history');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = false;
    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido.');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha invalida');
    }
    if (formErrors) return;

    dispatch(actions.loginRequest({ email, password, prevPath, history }));
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Login</h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Seu email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Sua senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Acessar</button>
      </Form>
    </Container>
  );
}

export default Login;
