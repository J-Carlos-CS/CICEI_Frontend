import { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  Input,
  DatePicker,
  message,
  Tag,
  Cascader,
} from "antd";
import moment from "moment";
import TypeProductService from "../../../../services/typeProductService.js";
import TypeBookService from "../../../../services/TypeBookService.js";
import PublisherService from "../../../../services/PublisherService.js";
import TypeArticleService from "../../../../services/TypeArticleService.js";
import ProductService from "../../../../services/ProductService.js";
import StatusPublishService from "../../../../services/StatusPublishservice.js";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 9,
    },
    lg: {
      span: 10,
    },
    xl: {
      span: 10,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
    md: {
      span: 15,
    },
    lg: {
      span: 14,
    },
    xl: {
      span: 14,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function ProductFormModal({
  isModalVisible = false,
  handleOk,
  handleCancel,
  userList = [],
  LinesInstitutional = [],
  projectId,
  productTarget = null,
  activities = [],
}) {
  const [form] = Form.useForm();
  const [formField, setformField] = useState([]);
  const [typeProductSelected, settypeProductSelected] = useState(null);
  const [typeProducts, settypeProducts] = useState([]);
  const [typeArticles, settypeArticles] = useState([]);
  const [publishers, setpublishers] = useState([]);
  const [typeBooks, settypeBooks] = useState([]);
  const [OtherPublisher, setOtherPublisher] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [statusPublish, setStatusPublish] = useState([]);
  const [urls, setUrls] = useState([]);
  //console.log("userList",userList);
  //const [activityUser, setActivityUser] = useState("");
  const onFinish = (values) => {
    console.log("values", values);
    setRequesting(true);
    if (!values.authors || values?.authors?.length === 0) {
      values.authors = [values.userActivity];
    } else {
      values.authors.push(values.userActivity);
    }
    //console.log("values", values);
    let product = {
      typeProductId: values.typeProductId || null,
      typeBookId: values.typeBookId || null,
      typeArticleId: values.typeArticleId || null,
      lineId: values.lineId || null,
      publisherId: values.publisherId || null,
      projectId: parseInt(projectId) || null,
      title: values.title || "",
      observation: values.observation || "",
      journal: values.journal || "",
      otherPublisher: values.otherPublisher || "",
      date: new Date(values.date._d) || new Date(),
      nameProgressId: "Pendiente",
      progress: 0,
      authors: values.authors,
      activityId: values.activityId,
      statusPublishId: values?.statusPublishId?.pop() || 0,
      urls: JSON.stringify(urls),
    };
    console.log("producr", product);
    message.loading({ content: "Actualizando...", key: "update" });
    if (productTarget) {
      product = { ...product, id: productTarget.id };
      ProductService.updateProduct(product)
        .then(async (res) => {
          if (res.data?.success) {
            message.success("Producto actualizado.", 4);
            await handleOk();
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
          } else {
            setRequesting(false);
            message.warning({
              content: res?.data?.description,
              key: "update",
              duration: 5,
            });
          }
        })
        .catch((e) => {
          setRequesting(false);

          message.error({
            content: "Hubo un error. " + e.message,
            key: "update",
            duration: 5,
          });
        });
    } else {
      ProductService.registerProduct(product)
        .then(async (res) => {
          if (res.data?.success) {
            message.success("Producto registrado.", 4);
            await handleOk();
            message.success({
              content: "Actualizado",
              key: "update",
              duration: 3,
            });
          } else {
            setRequesting(false);
            message.error({
              content: res?.data?.description,
              key: "update",
              duration: 5,
            });
          }
        })
        .catch((e) => {
          setRequesting(false);
          message.error({
            content: "Hubo un error. " + e.message,
            key: "update",
            duration: 5,
          });
        });
    }
  };

  const onChangeActivity = (a) => {
    let act = activities.filter((e) => {
      if (e.id === a) {
        return true;
      }
      return false;
    });
    if (act.length >= 1) {
      //setActivityUser(`${a.User?.firstName} ${a.User?.lastName}`);
      setformField((e) => [
        {
          name: ["activityId"],
          value: a,
        },
        /*  {
          name: ["userActivity"],
          value: `${act[0].User?.firstName} ${act[0].User?.lastName}`,
        }, */
        {
          name: ["userActivity"],
          value: act[0].User?.id,
        },
      ]);
      //console.log(act[0])
    }
  };
  const dateFormat = "YYYY/MM/DD";

  useEffect(() => {
    if (productTarget) {
      let statusPublishProduct = null;
      statusPublishProduct = productTarget?.StatusPublish?.id && [
        productTarget?.StatusPublish?.id,
      ];
      productTarget?.StatusPublish?.parentId &&
        statusPublishProduct?.unshift(productTarget?.StatusPublish?.parentId);

      setformField([
        {
          name: ["typeProductId"],
          value: productTarget.typeProductId,
        },
        {
          name: ["title"],
          value: productTarget.title,
        },
        {
          name: ["observation"],
          value: productTarget.observation,
        },
        {
          name: ["activityId"],
          value: productTarget.activityId || null,
        },
        {
          name: ["userActivity"],
          value: (() => {
            let act = activities?.filter(
              (a) => a.id === productTarget.activityId
            );
            if (act[0]) {
              return act[0]?.User?.id;
            } else {
              return "";
            }
          })(),
        },
        {
          name: ["authors"],
          value: productTarget.Authors?.map((author) => {
            return author?.User?.id;
          }),
        },
        {
          name: ["date"],
          value: moment(productTarget.date, dateFormat),
        },
        {
          name: ["lineId"],
          value: productTarget.lineId,
        },
        {
          name: ["typeBookId"],
          value: productTarget.typeBookId,
        },
        {
          name: ["publisherId"],
          value: productTarget.publisherId,
        },
        {
          name: ["typeArticleId"],
          value: productTarget.typeArticleId,
        },
        {
          name: ["journal"],
          value: productTarget.journal,
        },
        {
          name: ["statusPublishId"],
          value: statusPublishProduct || [1],
        },
      ]);
    }
    if (productTarget?.urls) {
      setUrls(JSON.parse(productTarget?.urls));
    }
    //setUrls(productTarget?.urls && JSON.parse(productTarget?.urls));
  }, [productTarget, activities]);

  /*  const getOptions = (list) => {
    let options = list.map((e) => ({
      value: e.User?.firstName + " " + e.User?.lastName,
    }));
    return options;
  }; */

  const getStatusPublish = async () => {
    try {
      let {
        data: { response = [], description = "", success = false },
      } = await StatusPublishService.getStatusPublish();
      if (success) {
        console.log("statusPublis", response);
        setStatusPublish(response);
      } else {
        message.warn({
          content: "Error. " + description,
          duration: 5,
          key: "getStatus",
        });
      }
    } catch (error) {
      message.error({ content: "", duration: 5, key: "getStatus" });
    }
  };
  const getTypeProducts = useCallback(() => {
    TypeProductService.getTypeProduct()
      .then((res) => {
        if (res.data?.success) {
          settypeProducts(res.data.response);
          if (productTarget) {
            let typeProduct = res.data.response.filter(
              (tp) => tp.id === productTarget.typeProductId
            );
            settypeProductSelected(typeProduct[0]);
          }
        } else {
          message.error("No existen tipos de productos para registrar.", 5);
        }
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message, 5);
        console.log("error", e.message);
      });
  }, [productTarget]);

  const getTypeArticle = () => {
    TypeArticleService.getTypeArticle()
      .then((res) => {
        if (res.data?.success) {
          if (res.data?.response.length > 0) {
            settypeArticles(res.data.response);
          } else {
            message.error("No existen tipos de articulos para registrar.", 5);
          }
        }
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message, 5);
        console.log("error", e.message);
      });
  };
  const getTypeBooks = () => {
    TypeBookService.getTypeBooks()
      .then((res) => {
        if (res.data?.success) {
          if (res.data?.response.length > 0) {
            settypeBooks(res.data?.response);
          } else {
            message.error("No existen tipos de libros para el registro.", 5);
          }
        }
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message, 5);
        console.log("error", e.message);
      });
  };

  const getPublisher = () => {
    PublisherService.getPublishers()
      .then((res) => {
        if (res.data?.success) {
          if (res.data?.response?.length > 0) {
            setpublishers(res.data?.response);
          } else {
            message.error("No existen tipos de libros para el registro.", 5);
          }
        }
      })
      .catch((e) => {
        message.error("Hubo un error. " + e.message, 5);
        console.log("error", e.message);
      });
  };

  useEffect(() => {
    getTypeBooks();
    getPublisher();
    getTypeArticle();
    getStatusPublish();
  }, []);

  useEffect(() => {
    getTypeProducts();
  }, [getTypeProducts]);

  const handleDelete = (urlId) => {
    setUrls((state) => state?.filter((url) => url?.id !== urlId));
  };

  function tagRender(props) {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={"gold"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  const onChangeTypeProduct = (value) => {
    let typeProduct = typeProducts.filter((tp) => tp.id === value);
    settypeProductSelected(typeProduct[0]);
  };

  const onChangeOtherPublishser = (value) => {
    if (value === 0) {
      setOtherPublisher(true);
    } else {
      setOtherPublisher(false);
    }
  };

  const getOptions = (options) => {
    let optionCascader = options?.map((option) => {
      return {
        value: option?.id,
        label: option?.name,
        children:
          option?.firstChild?.map((children) => ({
            value: children?.id,
            label: children?.name,
          })) || [],
      };
    });
    return optionCascader;
  };

  const handleUrl = () => {
   /*  console.log("formUrl", form.getFieldValue("urlText"));
    console.log("formUrl", form.getFieldsValue()); */
    let urlObj = {
      name: form.getFieldValue("urlText"),
      id: Date.now(),
    };
    setUrls((state) => [...state, urlObj]);
    form.setFieldsValue({ urlText: "" });
  };
  return (
    <Modal
      title={productTarget ? "Editar Producto" : "Registrar Producto"}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      footer={null}
    >
      <Form
        //className="form"
        {...formItemLayout}
        form={form}
        fields={formField}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="typeProductId"
          label="Tipo de Producto"
          rules={[
            {
              required: true,
              message: "Por favor seleccione el tipo de producto.",
            },
          ]}
        >
          <Select onChange={onChangeTypeProduct}>
            {typeProducts.map((tp) => (
              <Select.Option key={tp.id} value={tp.id}>
                {tp.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="Título"
          rules={[
            {
              required: true,
              message: "Por favor ingrese el título.",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="observation"
          label="Observación"
          rules={[
            {
              required: false,
              message: "",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="date"
          label="Fecha de publicación"
          rules={[
            {
              required: true,
              message: "Por favor seleccione la fecha.",
            },
          ]}
        >
          <DatePicker picker="month" />
        </Form.Item>

        <Form.Item
          name="activityId"
          label="Actividad"
          rules={[
            {
              required: true,
              message: "Por favor seleccione la actividad del producto.",
            },
          ]}
        >
          <Select
            onChange={(e) => {
              onChangeActivity(e);
            }}
          >
            {activities.map((a) => (
              <Select.Option
                key={a.id}
                value={a.id}
                //disabled={a.Product ? true : false}
              >
                {a.Products?.length > 0
                  ? `(${a.Products?.length} Productos)- ${a.name}`
                  : a.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="userActivity"
          label="Encargado de actividad(Autor)"
          rules={[
            {
              required: true,
              message: "Por favor seleccione la actividad del producto.",
            },
          ]}
        >
          <Select
            onChange={(e) => {
              onChangeActivity(e);
            }}
            disabled
          >
            {userList.map((userProject, index) => (
              <Select.Option
                key={index}
                value={userProject?.User?.id}
                //disabled={a.Product ? true : false}
              >
                {`${userProject?.User?.firstName} ${userProject?.User?.lastName}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="authors"
          label="Otros Autores"
          rules={[
            {
              required: false,
              message: "Seleccione al autor o autores.",
            },
          ]}
        >
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            //defaultValue={["gold", "cyan"]}
            style={{ width: "100%" }}
            //options={getOptions(userList)}
          >
            {userList.map((userProject, index) => (
              <Select.Option key={index} value={userProject?.User?.id}>{`${
                userProject?.User?.firstName
              } ${userProject?.User?.lastName} ${
                userProject?.User?.sintetic ? "-(Sintético)" : ""
              }`}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="lineId"
          label="Línea UCB"
          rules={[
            {
              required: true,
              message: "Por favor seleccione una línea de la UCB.",
            },
          ]}
        >
          <Select>
            {LinesInstitutional.map((l) => (
              <Select.Option key={l.id} value={l.id}>
                {l.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="statusPublishId"
          label="Estado de la Publicación"
          rules={[
            {
              required: true,
              message: "Por favor seleccione el estado de la publicación.",
            },
          ]}
        >
          <Cascader
            options={getOptions(statusPublish)}
            placeholder=""
            /*   showSearch={{
              filter,
            }} */
            //onSearch={(value) => console.log(value)}
          />
        </Form.Item>
        <Form.Item
          //name="url"
          //noStyle
          label="Url de publicación"
          rules={[
            {
              required: false,
              message: "",
            },
          ]}
        >
          <Input.Group compact>
            <Form.Item name="urlText" noStyle>
              <Input
                style={{
                  width: "calc(100% - 200px)",
                }}
              />
            </Form.Item>
            <Button type="primary" onClick={handleUrl}>
              +Agregar URL
            </Button>
          </Input.Group>
          {urls?.length > 0 ? (
            <div>
              {urls?.map((url) => (
                <div key={url?.id}>
                  <strong>{`- ${url?.name}`}</strong>
                  <Button
                    type="link"
                    onClick={() => {
                      handleDelete(url?.id);
                    }}
                  >
                    Quitar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <strong>Sin urls aun.</strong>
            </div>
          )}
        </Form.Item>

        {typeProductSelected?.name === "Artículo científico" ? (
          <Form.Item
            name="typeArticleId"
            label="Tipo de Articulo"
            rules={[
              {
                required: true,
                message: "Por favor seleccione el tipo de articulo.",
              },
            ]}
          >
            <Select>
              {typeArticles.map((tb) => (
                <Select.Option key={tb.id} value={tb.id}>
                  {tb.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : null}

        {typeProductSelected?.name === "Artículo científico" ? (
          <Form.Item
            name="journal"
            label="Revista"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre de la revista.",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : null}

        {typeProductSelected?.name === "Libro" ? (
          <Form.Item
            name="typeBookId"
            label="Tipo de Libro"
            rules={[
              {
                required: true,
                message: "Por favor seleccione el tipo de la libro.",
              },
            ]}
          >
            <Select>
              {typeBooks.map((tb) => (
                <Select.Option key={tb.id} value={tb.id}>
                  {tb.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : null}
        {typeProductSelected?.name === "Artículo científico" ||
        typeProductSelected?.name === "Libro" ? (
          <Form.Item
            name="publisherId"
            label="Institución/Editorial"
            rules={[
              {
                required: true,
                message: "Por favor seleccione la editorial.",
              },
            ]}
          >
            <Select onChange={onChangeOtherPublishser}>
              {publishers.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
              <Select.Option key={0} value={0}>
                {"Otra"}
              </Select.Option>
            </Select>
          </Form.Item>
        ) : null}
        {OtherPublisher ? (
          <Form.Item
            name="otherPublisher"
            label=" "
            rules={[
              {
                required: true,
                message:
                  "Por favor ingrese el nombre de la Editorial o institución.",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={requesting}>
            Aceptar
          </Button>
          <Button
            type="secondary"
            htmlType="button"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
