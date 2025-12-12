import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const withRouter = Component =>
  function (props) {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    return (
      <Component
        {...props}
        location={location}
        params={params}
        navigate={navigate}
      />
    );
  };
