import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import {
  FaEdit,
  FaExclamation,
  FaUserCircle,
  FaWindowClose,
} from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import axios from '../../services/api';
import { StudentContainer, ProfilePicture, NovoAluno } from './styled';
import Loading from '../../components/Loading';

function Alunos() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/students');
      setStudents(response.data);
      setIsLoading(false);
    }

    getData();
  }, []);

  function handleDeleteAsk(e) {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  }

  const handleDelete = async (e, id, index) => {
    e.persist();

    try {
      setIsLoading(true);
      await axios.delete(`/students/${id}`);
      const novosAlunos = [...students];
      novosAlunos.splice(index, 1);
      setStudents(novosAlunos);
      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('Você precisa fazer login');
      } else {
        toast.error('Ocorreu um erro ao excluir aluno');
      }

      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Alunos</h1>

      <NovoAluno to="/aluno/">Novo Aluno</NovoAluno>

      <StudentContainer>
        {students.map((aluno, index) => (
          <div key={String(aluno.id)}>
            <ProfilePicture>
              {get(aluno, 'Photos[0].url', false) ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={aluno.Photos[0].url} />
              ) : (
                <FaUserCircle size={36} />
              )}
            </ProfilePicture>

            <span>{aluno.nome}</span>
            <span>{aluno.email}</span>

            <Link to={`aluno/${aluno.id}/edit`}>
              <FaEdit size={16} />
            </Link>
            <Link onClick={handleDeleteAsk} to={`aluno/${aluno.id}/delete`}>
              <FaWindowClose size={16} />
            </Link>

            <FaExclamation
              size={16}
              display="none"
              cursor="pointer"
              onClick={(e) => handleDelete(e, aluno.id, index)}
            />
          </div>
        ))}
      </StudentContainer>
    </Container>
  );
}

export default Alunos;
