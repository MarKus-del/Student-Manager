import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';

import * as actions from '../../store/module/auth/actions';
import api from '../../services/api';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Form, ProfilePicture, Title } from './styled';

function Aluno({ match }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const id = get(match, 'params.id', '');

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState();
  const [peso, setPeso] = useState();
  const [altura, setAltura] = useState();
  const [foto, setFoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/students/${id}`);
        const Foto = get(data, 'Photos[0].url', '');
        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);
        setFoto(Foto);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) errors.map((erro) => toast.error(erro));
      }
    }
    getData();
  }, [id, history]);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length >= 255) {
      toast.error('Nome precisa ter entre 3 a 255 caracteres.');
      formErrors = true;
    }

    if (sobrenome.length < 3 || sobrenome.length >= 255) {
      toast.error('Sobrenome precisa ter entre 3 a 255 caracteres.');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('E-mail inválido');
      formErrors = true;
    }

    if (!isInt(String(idade))) {
      toast.error('Idade invalída');
      formErrors = true;
    }

    if (idade < 12 || idade > 30) {
      toast.error('Idade invalída');
      formErrors = true;
    }

    if (!isFloat(String(peso))) {
      toast.error('Peso invalída');
      formErrors = true;
    }

    if (!isFloat(String(altura))) {
      toast.error('ALtura invalída');
      formErrors = true;
    }
    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await api.put(`/students/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) editado(a) com sucesso!');
      } else {
        const { data } = await api.post(`/students`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) criado(a) com sucesso!');
        history.push(`/aluno/${data.id}/edit`);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Editar aluno' : 'Novo Aluno'}</Title>

      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="Sobrenome"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
        />
        <input
          type="text"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Peso"
        />
        <input
          type="text"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Altura"
        />

        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

export default Aluno;

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
