import { Button, Modal } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LogInPage from '../../pages/Auth/LogInPage';

const Header: React.FC = () => {
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = (target: boolean) => {
    setIsModalOpen(target);
  };


  return (
    <>
      <header className="flex justify-end gap-2">
            <Button color="default" variant="text" size="large" onClick={() => navigate('/game')}>Игра</Button>
            <Button color="default" variant="filled" size="large" onClick={() => toggleModal(true)}>Авторизация</Button>
      </header>
      <main>
        <Outlet />
      </main>

    <Modal
        open={isModalOpen}
        onOk={() => toggleModal(false)}
        onCancel={() => toggleModal(false)}
        footer={null}
        width={300}
        height={800}
        styles={{
            body: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        >
        <LogInPage />
      </Modal>
    </>
  )
}

export default Header