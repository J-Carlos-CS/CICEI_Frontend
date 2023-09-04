import { useState, useEffect, useCallback } from "react";
import { Button, Row, Col, DatePicker } from "antd";
import XLSXGenerator from "./XLSXGenerator";

import Articles from "./Articles";
import Books from "./Books";
import Reports from "./Reports";

import compareDates from "../../utils/CompareDate";

export default function Production({ products = null, toogleUpdate }) {
  const [data, setData] = useState(null);
  const getExcel = () => {
    //XLSXGenerator.productsXLSX({ articles, books, reports });
    XLSXGenerator.productsXLSX({ ...data });
  };
  const [dateFilter, setDateFilter] = useState("");
  const [filter, setFilter] = useState({
    date: "",
  });

  const onChangeDate = (date, dateString) => {
    setDateFilter(date?._d ? date?._d?.toString() : "");
  };

  const onModifyFilter = () => {
    setFilter({ date: dateFilter || "" });
  };

  const applyFilters = useCallback(() => {
    console.log("productsss", products);
    let filteredProducts = { ...products };
    console.log("products", products);
    if (filter?.date !== "") {
      let typeListProducts = Object.keys(products);
      typeListProducts?.forEach((typeProduct) => {
        filteredProducts[typeProduct] = filteredProducts[typeProduct]?.filter(
          (product) => {
            if (compareDates(product?.date?.toString(), filter?.date) >= 0) {
              return true;
            } else {
              return false;
            }
          }
        );
      });
    }
    console.log("filtered", filteredProducts);
    setData(filteredProducts);
  }, [filter,toogleUpdate]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          getExcel();
        }}
      >
        Exportar a Excel
      </Button>
      <Row style={{ margin: "1em 0" }}>
        <Col span={24} style={{ display: "flex", alignItems: "end" }}>
          <div style={{ marginLeft: "0em" }}>
            <p style={{ marginBottom: "0em" }}>Productos al:</p>
            <DatePicker
              onChange={onChangeDate}
              picker="month"
              placeholder="Seleccionar mes"
            />
          </div>
          <div
            style={{ marginLeft: "2em", display: "flex", alignItems: "end" }}
          >
            <Button type="primary" onClick={onModifyFilter}>
              Aplicar filtros
            </Button>
          </div>
        </Col>
      </Row>

      <Articles list={data?.articles} />
      <Books list={data?.books} />
      <Reports list={data?.reports} />
    </>
  );
}
