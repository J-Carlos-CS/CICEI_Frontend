import { Result, Button } from 'antd';
import { useHistory } from 'react-router';


export default function PageNotFound() {
    const history = useHistory();
    return (
        <Result
    status="404"
    title="404"
    subTitle="Lo sentimos, la página que buscas no existe."
    extra={<Button type="primary" onClick={()=>{history.push('/home');}}>Volver al Home</Button>}
  />
    );
}
