import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className="flex justify-end">
          <Button color="default" variant="filled" size="large" onClick={() => navigate('/login')}>Авторизация</Button>
    </header>
  )
}

export default Header