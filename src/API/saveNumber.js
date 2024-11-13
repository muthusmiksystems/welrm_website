import * as actions from "../Actions/actions";

const savePhoneNumber = (number) => {
  return (dispatch) => {
    dispatch(actions.saveNumber(number));
  };
};
export default savePhoneNumber;
