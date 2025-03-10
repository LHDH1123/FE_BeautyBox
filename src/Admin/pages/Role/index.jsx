import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Role.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";
import SecurityIcon from "@mui/icons-material/Security";
import {
  changeStatusRole,
  deleteRoles,
  getAllRoles,
  updateDataRole,
} from "../../../services/role.service";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Role = () => {
  const [listRoles, setListRoles] = useState([]);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [isModalAddRole, setIsModalAddRole] = useState(false);
  const [getRole, setGetRole] = useState([]);
  const navigate = useNavigate();
  const fetchRoles = async () => {
    const response = await getAllRoles();
    if (response) {
      setListRoles(response);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      // Cập nhật trực tiếp danh sách sản phẩm
      setListRoles((prevRoles) =>
        prevRoles.map((role) =>
          role._id === id ? { ...role, status: newStatus } : role
        )
      );

      // Gọi API để cập nhật trạng thái trên server
      await changeStatusRole(id, newStatus);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleCloseModalAdd = () => {
    setIsModalAddRole(!isModalAddRole);
  };

  const handleEdit = (role) => {
    setIsModalAddRole(true);
    setGetRole(role);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setGetRole((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      return newState;
    });
  };

  const handleUpdate = async () => {
    const data = {
      title: getRole.title,
      status: getRole.status,
    };
    // console.log(getRole);
    try {
      const response = await updateDataRole(getRole._id, data);
      if (response) {
        setIsModalAddRole(false);
        fetchRoles();
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa vai trò này không?")) return;

    try {
      await deleteRoles(id);
      const updatedRoles = listRoles.filter((role) => role._id !== id);
      setListRoles(updatedRoles);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermission = (id) => {
    navigate(`permissions/${id}`);
  };

  return (
    <div className={cx("table")}>
      <Header title="Vai Trò & Quyền" fetchRoles={fetchRoles} />

      <div className={cx("table-list")}>
        <TableHeader title="Vai Trò & Quyền" />

        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                {/* <th className={cx("no-sort")}>
                  <input type="checkbox" name="" id="" />
                </th> */}
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {listRoles.map((role) => (
                <tr key={role._id}>
                  {/* <td>
                    <label className={cx("checkboxs")}>
                      <input type="checkbox" />
                      <span className={cx("checkmarks")}></span>
                    </label>
                  </td> */}
                  <td>{role.title}</td>
                  <td>
                    {new Date(role.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        role.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() => handleChangeStatus(role._id, role.status)}
                    >
                      {role.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className={cx("action-table-data")}>
                    <div className={cx("edit-delete-action")}>
                      <div className={cx("icon")}>
                        <SecurityIcon
                          style={{ color: "#3577f1" }}
                          onClick={() => handlePermission(role._id)}
                        />
                      </div>
                      <div
                        className={cx("icon")}
                        onClick={() => handleEdit(role)}
                      >
                        <ModeEditOutlineOutlinedIcon
                          style={{ color: "rgb(46 109 27)" }}
                        />
                      </div>
                      <div
                        className={cx("icon")}
                        onClick={() => handleDelete(role._id)}
                      >
                        <DeleteOutlineOutlinedIcon style={{ color: "red" }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={isModalAddRole}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "300px",
            width: "500px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo vai trò</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Tên vai trò</div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={getRole.title}
                onChange={handleInputChange}
              />
              <div className={cx("status")}>
                <div className={cx("label")}>Trạng thái</div>
                <div className={cx("switch")}>
                  <Switch
                    {...label}
                    name="status"
                    checked={getRole.status}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={() => handleCloseModalAdd()}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={() => handleUpdate()}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Role;
