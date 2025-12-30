'use client';

import useModalAction from '../../hooks/store/useModalAction';
import Alert from '../common/Alert';

const AlertContainer = () => {
  const { alertState, handleCloseAlert } = useModalAction();

  return (
    <Alert
      isVisible={alertState.isVisible}
      type={alertState.type}
      message={alertState.message}
      title={alertState.title}
      onClose={handleCloseAlert}
    />
  );
};

export default AlertContainer;
