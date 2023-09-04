import React, { useCallback, useEffect, useState, useRef } from "react";
import { Table, Row, Col, Typography, Button, Space, Modal, message, Input } from "antd";
import CenterService from "../../services/CenterService";
import CampusService from "../../services/CampusService";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined, SnippetsOutlined, SearchOutlined } from "@ant-design/icons";

const { Column, ColumnGroup } = Table;

const { Title, Text } = Typography;
const { Search } = Input;

export default function Center() {
  const [stateModal, setStateModal] = useState({ visible: false });
  const [centerTarget, setCenterTarget] = useState({ title: "", id: 0 });
  const [centers, setCenters] = useState([]);
  const [listCampusOptions, setListCampusOptions] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [listFilterCampus, SetlistFilterCampus] = useState([]);

  const getAllCenters = useCallback(() => {
    return new Promise((resolve, reject) => {
      CenterService.getAllCenters().then((res) => {
        setCenters(res.data.response);
      });
    });
  }, []);

  const getListCampus = useCallback(() => {
    CampusService.getlistCampus().then((res) => {
      setListCampusOptions(res.data.response);
    });
  });

  const showModal = (record) => {
    setCenterTarget({ title: record.name, id: record.id });
    setStateModal({
      visible: true,
    });
  };

  const hideModal = () => {
    setStateModal({
      visible: false,
    });
  };

  const onAceptModal = () => {
    CenterService.deleteCenterById(centerTarget.id).then((res) => {
      if (res.data?.success) {
        message.success("Se elimino correctamente el centro", 3);
        getAllCenters();
        hideModal();
      }
    });
  };

  useEffect(() => {
    getAllCenters();
    getListCampus();
  }, [getAllCenters]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar por ${title}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}>
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}>
            Reestablecer
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}>
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}>
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const filterListCampus = () => {
    let listCampus = [];
    listCampusOptions?.map((key) => {
      listCampus.push({
        id: key.id,
        text: key.name,
        value: key.name,
      });
    });
    //let unique=[...new Map(listCampus.map((c)=>[c.id,c])).values()] #filtra valores repetidos
    return listCampus;
  };

  const columns = [
    {
      title: "Nombre",
      width: "15%",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      ...getColumnSearchProps("name", "nombre"),
      render: (text) => (
        <Text
          style={{
            width: "100%",
          }}
          ellipsis={{
            tooltip: { text },
          }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Sigla",
      dataIndex: "acronym",
      key: "acronym",
      ...getColumnSearchProps("acronym", "sigla"),
    },
    {
      title: "Sede academica",
      dataIndex: "campusId",
      key: "campusId",
      render: (i, record) => {
        const rowDataCampus = record?.Campus?.name;
        return (
          <Text
            style={{
              width: "100%",
            }}
            ellipsis={{ tooltip: { rowDataCampus } }}>
            {rowDataCampus}
          </Text>
        );
      },

      filters: filterListCampus(),
      onFilter: (value, record) => record.Campus.name.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Unidad academica",
      dataIndex: "academicUnitId",
      key: "academicUnitId",
      render: (i, record) => {
        const rowDataUA = record?.AcademicUnit?.name;
        return (
          <Text
            style={{
              width: "100%",
            }}
            ellipsis={{ tooltip: { rowDataUA } }}>
            {rowDataUA}
          </Text>
        );
      },
    },
    {
      title: "Coordinador",
      dataIndex: "coordinatorId",
      key: "coordinatorId",
      render: (i, record) => {
        const rowDataCoo = record?.User?.firstName + " " + record?.User?.lastName;
        return (
          <Text
            style={{
              width: "100%",
            }}
            ellipsis={{ tooltip: { rowDataCoo } }}>
            {rowDataCoo}
          </Text>
        );
      },
    },
    {
      title: "Opciones",
      width: "15%",
      dataIndex: "",
      key: "optionsForm",
      render: (_, record) => (
        <Space size="large" align="center">
          <Link style={{ display: "flex", flexDirection: "column" }} to={"/center/detail/" + record.id}>
            <SnippetsOutlined></SnippetsOutlined>
            <Text>Ver</Text>
          </Link>
          <Link style={{ display: "flex", flexDirection: "column" }} to={"/center/form/" + record.id}>
            <EditOutlined></EditOutlined>
            <Text>Editar</Text>
          </Link>
          <a style={{ display: "flex", flexDirection: "column" }} onClick={() => showModal(record)}>
            <DeleteOutlined></DeleteOutlined>
            <Text>Eliminar</Text>
          </a>
        </Space>
      ),
      fixed: "right",
    },
  ];

  return (
    <div>
      <>
        <Row align="center" style={{ marginTop: "25px" }}>
          <Col xs={{ span: 20 }} sm={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }} xl={{ span: 16 }} style={{ display: "flex", justifyContent: "center" }}>
            <Title>Centros</Title>
          </Col>
        </Row>
        <div className="">
          <Link to="/center/form/">
            <Button
              type="primary"
              style={{
                marginRight: "4%",
                marginBottom: 16,
                float: "right",
              }}>
              Agregar Centros
            </Button>
          </Link>
        </div>
        <Table
          style={{ marginLeft: "50px", marginRight: "50px", borderRadius: "3%" }}
          columns={columns}
          dataSource={centers}
          rowKey="id"
          pagination={{ showSizeChanger: true }} //pagination={{ pageSize: 10, total: 5, showSizeChanger: true }}
          scroll={{ x: "max-content", y: 750 }}></Table>
        <Modal
          title={`Eliminar el centro '${centerTarget.title}'`}
          open={stateModal.visible}
          onOk={onAceptModal}
          onCancel={hideModal}
          okText="Aceptar"
          cancelText="Cancelar">
          <p>¿Esta seguro que desea eliminar el centro?</p>
        </Modal>
      </>
    </div>
  );
}
