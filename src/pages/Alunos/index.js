import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { FaEdit, FaUserCircle, FaWindowClose } from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import axios from '../../services/api';
import { StudentContainer, ProfilePicture } from './styled';

function Alunos() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/students');

      if (response.status !== 200) {
        toast.error('Erro ao fazer a requisição');
        return;
      }
      setStudents(response.data);
    }

    getData();
  }, []);

  return (
    <Container>
      <h1>Alunos</h1>

      <StudentContainer>
        {students.map((aluno) => (
          <div key={String(aluno.id)}>
            <ProfilePicture>
              {get(aluno, 'Photos[0].url', false) ? (
                <img src={aluno.Photos[0].url} alt="Foto de perfil" />
              ) : (
                <FaUserCircle size={36} />
              )}
            </ProfilePicture>

            <span>{aluno.nome}</span>
            <span>{aluno.email}</span>

            <Link to={`aluno/${aluno.id}/edit`}>
              <FaEdit size={16} />
            </Link>
            <Link to={`aluno/${aluno.id}/delete`}>
              <FaWindowClose size={16} />
            </Link>
          </div>
        ))}
      </StudentContainer>
    </Container>
  );
}

export default Alunos;
