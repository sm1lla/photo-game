import "../Game.css";

const GoogleLogin = () => {


  return (
    <div>
      <form action="http://localhost:8080/auth/callback" method="get">
  <button type="submit">
    {"Press to log in"}
  </button>
</form>
    </div>
  );
};
  
export default GoogleLogin;
