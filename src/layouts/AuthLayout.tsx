import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="">
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
