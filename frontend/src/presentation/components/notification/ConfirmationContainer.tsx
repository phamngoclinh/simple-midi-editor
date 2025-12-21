import useModalAction from '../../hooks/store/useModalAction';
import Confirmation from '../common/Confirmation';

const ConfirmationContainer = () => {
  const { confirmationState, handleConfirm, handleCancel } = useModalAction();
  
  return (
    <Confirmation
      isVisible={confirmationState.isVisible}
      message={confirmationState.message}
      title={confirmationState.title}
      confirmButtonLabel={confirmationState.confirmButtonLabel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )
}

export default ConfirmationContainer;
