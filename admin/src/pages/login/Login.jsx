import { useContext, useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { AuthActions, AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/apiConfig";
import axiosConfig from "../../api/axiosConfig";

function Login({ inputs }) {
  const navigate = useNavigate();
  const { user, loading, error, dispatch } = useContext(AuthContext);
  const [postLoading, setPostLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const onSubmit = async (data) => {
    const credential = { ...data };

    dispatch({ type: AuthActions.login_start });
    setPostLoading(true);

    try {
      const response = await axiosConfig.post(authApi.adminLogin, credential);
      if (response.status === 200) {
        dispatch({ type: AuthActions.login_success, payload: response.data });
        navigate("/");
      }
    } catch (error) {
      console.log("error :>> ", error);
      let responseErr = error.response?.data;
      if (responseErr.status === 401 || responseErr.status === 403) {
        alert(responseErr.message);
      }
      dispatch({
        type: AuthActions.login_failure,
        payload: error.response?.data.message,
      });
    }
    setPostLoading(false);
  };
  return (
    <div className="login">
      <h1 className="title">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {inputs &&
          inputs.map((input) => (
            <div className="formInput" key={input.id}>
              <label>{input.label}</label>
              <input
                type={input.type}
                {...register(input.id, {
                  required: true,
                })}
                placeholder={input.placeholder}
              />
              {errors[input?.id] && (
                <p className="error">{`This ${input.id} is required`}</p>
              )}
            </div>
          ))}
        <div className="formAction">
          <input
            type="submit"
            className="submit"
            value={postLoading ? "Loading..." : "Submit"}
            disabled={postLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
