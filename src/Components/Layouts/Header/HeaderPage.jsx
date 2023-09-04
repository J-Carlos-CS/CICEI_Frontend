import { logout, selectUser } from "../../../Auth/userReducer";
import { selectTheme, changetheme } from "../../../Auth/themeReducer";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import {Layout,PageHeader} from "antd"
const { Header } = Layout;
export default function HeaderPage() {
    const location = useLocation().pathname;
    const history = useHistory();
    return(
        <>
        {location !== "/home" &&
      location !== "/" &&
      location !== "/register" &&
      location !== "/page-not-found" ? (
        <PageHeader
          //style={{ backgroundColor: "white" }}
          onBack={() => {
            history.goBack();
          }}
          title="Atras"
          subTitle=""
        />
      ) : null}
        </>
    )
}