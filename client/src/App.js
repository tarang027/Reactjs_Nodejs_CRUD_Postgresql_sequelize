import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "antd/dist/antd.css";
import { Table, Tag, Space, Tooltip } from "antd";
import { Button, Form } from "react-bootstrap";
import { Modal, Button as AntButton } from "antd";
import { Input } from "antd";
import { message as AntMessage } from "antd";
import Select from "react-select";
import DatePicker from "react-datepicker";

const { TextArea } = Input;

function App(props) {
  const baseURL = "http://localhost:5000/";

  const getListAPIName = "api/user/getAll";
  const addEditAPIName = "api/user/addEditUser";
  const deleteAPIName = "api/user/deleteUser";

  const initialState = {
    actionType: "add",
    _id: "",
    UserName: "",
    Bio: "",
    DateOfBirth: new Date(),
    Hobbies: "",
    Role: "",
    ProfilePic: "",
  };

  const [rawTableData, setRawTableData] = useState([]);
  const [addEditFormValues, setAddEditFormValues] = useState(initialState);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onUpdateList = () => {
    setIsModalVisible(false);
    setAddEditFormValues(initialState);
    getMainList();
  };

  const handleOk = () => {

    let newHobbies = [];
    addEditFormValues.Hobbies.forEach(ele => {
      newHobbies.push(ele.value)
    })
    let Hobbies = newHobbies.toString();
    let Role = addEditFormValues.Role.value;

    let passValue = { ...addEditFormValues, Hobbies, Role }

    fetch(`${baseURL}${addEditAPIName}`, {
      method: "POST",
      body: JSON.stringify(passValue),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log("res ", res);
        let { status, message } = res;
        if (status) {
          AntMessage.success(message);
          onUpdateList();
        } else {
          AntMessage.error(message);
        }
      });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setAddEditFormValues(initialState);
    setIsModalVisible(false);
  };

  useEffect(() => {
    setAddEditFormValues(initialState);
    getMainList();
  }, []);

  const getMainList = () => {
    fetch(`${baseURL}${getListAPIName}`)
      .then((response) => response.json())
      .then((res) => {
        console.log("res ", res);
        let { status, data } = res;
        if (status) {
          setRawTableData(data);
        } else {
          setRawTableData([]);
        }
      });
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "UserName",
      key: "UserName",
    },
    {
      title: "Bio",
      dataIndex: "Bio",
      key: "Bio",
    },
    {
      title: "Hobbies",
      dataIndex: "Hobbies",
      key: "Hobbies",
    },
    {
      title: "Role",
      dataIndex: "Role",
      key: "Role",
    },
    {
      title: "Action",
      key: "action",
      field: "action",
      render: (text, record) => (
        <>
          <Button variant="primary" onClick={() => handleClickEdit(text)}>
            Edit
          </Button>{" "}
          <Button variant="danger" onClick={() => handleClickDelete(text)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleClickDelete = (data) => {
    Modal.confirm({
      title: "Confirm",
      content: "Are you sure you want to delete it?",
      okText: "Delete",
      onOk: () => {
        fetch(`${baseURL}${deleteAPIName}`, {
          method: "POST",
          body: JSON.stringify({ _id: data._id }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((res) => {
            console.log("res ", res);
            let { status, message } = res;
            if (status) {
              AntMessage.success(message);
              onUpdateList();
            } else {
              AntMessage.error(message);
            }
          });
      },
    });
  };

  const handleInputChange = (e) => {
    setAddEditFormValues({
      ...addEditFormValues,
      [e.target.name]: e.target.value,
    });
  };


  const handleClickEdit = (data) => {
    let Hobbies = [];
    data.Hobbies.split(',').forEach(ele => {
      Hobbies.push({ label: ele, value: ele })
    })

    let Role = { label: data.Role, value: data.Role }

    setAddEditFormValues({ ...data, DateOfBirth: new Date(data.DateOfBirth), actionType: "edit", Hobbies, Role });
    setIsModalVisible(true);
  };

  return (
    <div className="App" style={{ padding: "30px" }}>
      <Button type="primary" style={{ margin: "30px" }} onClick={showModal}>
        Add User
      </Button>


      <Modal
        title={
          addEditFormValues.actionType === "edit" ? "Edit User" : "Add User"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="User Name"
          name="UserName"
          value={addEditFormValues.UserName}
          onChange={handleInputChange}
        />
        <TextArea
          rows={4}
          placeholder="Bio"
          name="Bio"
          value={addEditFormValues.Bio}
          onChange={handleInputChange}
        />
        <Select
          name="Hobbies"
          onChange={(s) => {
            setAddEditFormValues({ ...addEditFormValues,'Hobbies': s });
          }}
          isMulti={true}
          value={addEditFormValues.Hobbies}
          placeholder="Hobbies"
          options={[
            { label: "Cooking", value: "Cooking" },
            { label: "Driving", value: "Driving" },
            { label: "Dancing", value: "Dancing" },
            { label: "Swimming", value: "Swimming" },
          ]}
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          label="Hobbies"
        />
        <Select
          name="Role"
          onChange={(s) => {
            setAddEditFormValues({ ...addEditFormValues,'Role': s });
          }}
          value={addEditFormValues.Role}
          placeholder="Role"
          options={[
            { label: "Student", value: "Student" },
            { label: "Teacher", value: "Teacher" },
            { label: "Principal", value: "Principal" },
            { label: "Realtor", value: "Realtor" },
          ]}
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          label="Role"
        />

        <div style={{ marginTop: '25px' }} >
          <label htmlFor='DateOfBirth' >
            Date Of Birth
          </label>
          <DatePicker
            name='DateOfBirth'
            selected={addEditFormValues.DateOfBirth}
            value={addEditFormValues.DateOfBirth}
            onChange={val => setAddEditFormValues({
              ...addEditFormValues,
              DateOfBirth: val,
            })}
          />
        </div>

      </Modal>




      <div style={{ padding: "30px" }}>
        <Table
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={rawTableData}
        />
      </div>


    </div>
  );
}

export default App;
