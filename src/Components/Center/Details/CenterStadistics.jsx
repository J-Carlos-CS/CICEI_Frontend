import React, { useState } from "react";
import { Select, Button } from "antd";
export default function CenterListProyects(params) {
    const [value, setValue] = useState(null);

  const clear = () => setValue(null);

  return (
    <div className="App">
      <Select
        value={value}
        onChange={setValue}
        allowClear
        placeholder="Please clear the input"
        style={{ width: "200px" }}
      >
        {[5].map(v => (
          <Select.Option key={v} value={v}>
            {v}
          </Select.Option>
        ))}
      </Select>
      <Button onClick={clear}>clear</Button>
      <div>value : {value}</div>
    </div>
  );
}