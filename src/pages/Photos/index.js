import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { Title, Form } from './styled';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import api from '../../services/api';
import * as actions from '../../store/module/auth/actions';

function Photos({ match }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const id = get(match, 'params.id', '');
  const [isLoading, setIsLoading] = useState(false);
  const [foto, setFoto] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/students/${id}`);
        setFoto(get(data, 'Photos[0].url', ''));
        setIsLoading(false);
      } catch {
        toast.error('Erro ao obter imagem');
        setIsLoading(false);
        history.push('/');
      }
    };

    getData();
  }, [history, id]);

  const handleChange = async (e) => {
    const novaFoto = e.target.files[0];
    const fotoUrl = URL.createObjectURL(novaFoto);

    setFoto(fotoUrl);

    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('foto', novaFoto);

    try {
      setIsLoading(true);
      await api.post('/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Foto enviada com sucesso');

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const { status } = get(error, 'response', '');
      toast.error('Erro ao enviar a foto');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>Fotos</Title>

      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" /> : 'Selecionar'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

export default Photos;

Photos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
