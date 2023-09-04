import { useState } from "react";
import { Modal, Select } from "antd";

export default function SelectColumnsModal({
  isVisible = false,
  handleOkOperation,
  handleCancel,
  listColums = [],
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = (selectedItems) => {
    setSelectedItems(selectedItems)
  }
  const filteredOptions = listColums.filter(o => !selectedItems.includes(o));

  const exportCols = () => {
    handleOkOperation(selectedItems);
  }
  return (
    <Modal
      title="Seleccione las columnas y el orden"
      okText="Aceptar y exportar"
      cancelText="Cancelar"
      visible={isVisible}
      onOk={exportCols}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Select
        mode="multiple"
        placeholder="Columnas a expotar"
        value={selectedItems}
        onChange={handleChange}
        style={{ width: '100%' }}
        allowClear
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
}
