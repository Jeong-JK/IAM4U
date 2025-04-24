// import React from 'react';
// // import { withRouter } from 'react-router-dom';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './BackTab.scss';

// const BackTab = ({ history, title }) => {
//   const onBackClick = () => history.goBack();

//   return (
//     <div className="back-tab">
//       <button onClick={onBackClick}>
//         <FontAwesomeIcon icon={faArrowLeft} />
//       </button>
//       <span className="title">{title}</span>
//     </div>
//   );
// };

// export default BackTab;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackTab.scss';

const BackTab = ({ title }) => {
  const navigate = useNavigate();

  const onBackClick = () => {
    navigate(-1); // -1 = go back
  };

  return (
    <div className="back-tab" onClick={onBackClick}>
      ← {title}
    </div>
  );
};

export default BackTab;
