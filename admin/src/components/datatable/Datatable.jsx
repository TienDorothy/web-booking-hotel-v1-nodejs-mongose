import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../loading/Loading";
import axiosConfig from "../../api/axiosConfig";

const Datatable = ({ columns, action, title }) => {
  const location = useLocation();
  const pathName = location.pathname.split("/")[1];
  const path = pathName === "" ? "transactions" : pathName;
  const [list, setList] = useState();
  const { data, loading, error } = useFetch(`/${path}`);
  useEffect(() => {
    setList(data);
  }, [data]);

  const handleDelete = async (id) => {
    if (window.confirm("Are your sure?")) {
      try {
        const result = await axiosConfig.delete(`/${path}/${id}`);
        if (result.status === 200) {
          alert("Delete success");
          setList(list.filter((item) => item._id !== id));
        }
      } catch (error) {
        console.log("error :>> ", error);
        if (error.response?.data.status === 400) {
          alert("The room with transactions cannot be deleted");
        }
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/${path}/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="datatable">
          <div className="datatableTitle">
            {title}

            {action && (
              <Link to={`/${path}/new`} className="link">
                Add New
              </Link>
            )}
          </div>

          {list && (
            <DataGrid
              className="datagrid"
              rows={list}
              columns={action ? columns.concat(actionColumn) : columns}
              pageSize={9}
              rowsPerPageOptions={[9]}
              checkboxSelection
              getRowId={(row) => row._id}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Datatable;
