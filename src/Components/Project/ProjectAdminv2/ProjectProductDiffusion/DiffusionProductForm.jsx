import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import DiffusionCategoryService from "../../../../services/DiffusionCategoryService";
import DiffusionProductService from "../../../../services/DiffusionProductService";
import StatusPublishService from "../../../../services/StatusPublishservice";
import {
  Modal,
  Form,
  Select,
  Button,
  Input,
  message,
  Cascader,
  Typography,
  Avatar,
  Tag,
  InputNumber,
  DatePicker,
} from "antd";
import {
  SmileOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import moment from "moment";

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
const tailLayout = {
  wrapperCol: {
    offset: 12,
    span: 12,
  },
};

const grades = [
  { name: "Doctor", id: 1 },
  { name: "Magister", id: 2 },
  { name: "Licenciado", id: 3 },
  { name: "Estudiante", id: 4 },
];

const statesPublication = [
  { value: "Presentado", label: "Presentado" },
  {
    value: "Revisado",
    label: "Revisado",
    children: [
      { value: "Menor", label: "Menor" },
      { value: "Mayor", label: "Mayor" },
      { value: "Rechazado", label: "Rechazado" },
    ],
  },
  { value: "Rechazado", label: "Rechazado" },
  { value: "Aceptado", label: "Aceptado" },
];
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
const prefixSelector = (myGrades) => {
  return (
    <Form.Item
      name="gradeId"
      noStyle
      rules={[
        {
          required: true,
          message: "Por favor selecciona tu grado académico",
        },
      ]}
    >
      <Select style={{ width: 150 }}>
        {myGrades.map((grade) => (
          <Select.Option value={grade.name} key={grade.id}>
            {grade.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
const useResetFormOnCloseModal = ({ form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    if (!visible && prevVisible) {
      console.log(form);
      form.resetFields();
    }
  }, [visible]);
};

//Modal for Channels
const ModalChannels = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Agregar Canal de TV"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Registrar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="tvChannelForm">
        <Form.Item
          name="name"
          label="Nombre del Canal de Televisión"
          rules={[
            {
              required: true,
              message: "Ingrese el nombre del canal de TV",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="country"
          label="Pais"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el pais donde se emite el canal.",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

//Modal for SocialNetworks
const ModalSocialNetworks = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Agregar Red Social"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Registrar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="socialNetworksForm">
        <Form.Item
          name="name"
          label="Nombre de la Red Social"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="linkSocialNetwork"
          label="Link de la publicación"
          rules={[
            {
              required: true,
              message: "Por favor ingresa tu especialidad o afinidad",
            },
            {
              type: "url",
              warningOnly: true,
              message: "Por favor introduzca el link",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

//Modal for Expositors

const ModalExpositorForm = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Agregar Expositor"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Registrar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="expositorForm">
        <Form.Item
          name="name"
          label="Nombre Completo"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="grade"
          label="Grado Académico"
          rules={[
            {
              required: true,
              message: "Por favor ingresa tu especialidad o afinidad",
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector(grades)}
            placeholder={"(Ej: En Química orgánica)"}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="country"
          label="Pais"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

//Modal for Episodes

const ModalEpisodesForm = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Agregar Episodio"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Registrar"
      cancelText="Cancelar"
    >
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        name="episodesForm"
      >
        <Form.Item
          name="name"
          label="Nombre del episodio"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre del episodio",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción"
          rules={[
            {
              required: true,
              message: "Describa el episodio",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          // name={"duration"}
          label="Duración"
          rules={[
            {
              required: true,
              message: "Ingrese la duración del episodio.",
            },
          ]}
        >
          <Input.Group compact>
            <Form.Item
              label="Horas"
              name={["duration", "hours"]}
              rules={[{ required: true, message: "Duración en horas." }]}
              noStyle
            >
              <InputNumber min={0} value={0} placeholder="Horas" />
            </Form.Item>
            <Form.Item
              /* {...field} */
              label="Minutos"
              name={["duration", "minutes"]}
              rules={[{ required: true, message: "Duración en minutos." }]}
              noStyle
            >
              <InputNumber min={0} value={0} placeholder="Minutos" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function DiffusionProductForm({
  productSelected,
  onCloseForm,
  activities,
  userList,
  projectId,
  linesInstitutional = [],
}) {
  const [form] = Form.useForm();
  const [visibleExpositorModal, setVisibleExpositorModal] = useState(false);
  const [visibleEpisodesModal, setVisibleEpisodesModal] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [typeProduct, setTypeProduct] = useState("");
  const [visibleSocialNetworks, setVisibleSocialNetworks] = useState(false);
  const [visibleChannelForm, setVisibleChannelForm] = useState(false);
  const [fields, setFields] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [statusPublish, setStatusPublish] = useState([]);

  const showExpositorModal = () => {
    setVisibleExpositorModal(true);
  };

  const hideExpositorModal = () => {
    setVisibleExpositorModal(false);
  };

  const showEpisodesModal = () => {
    setVisibleEpisodesModal(true);
  };

  const hideEpisodesModal = () => {
    setVisibleEpisodesModal(false);
  };

  const showSocialNetworksModal = () => {
    setVisibleSocialNetworks(true);
  };

  const hideSocialNetworksModal = () => {
    setVisibleSocialNetworks(false);
  };

  const showChannelModal = () => {
    setVisibleChannelForm(true);
  };

  const hideChannelModal = () => {
    setVisibleChannelForm(false);
  };

  /*  useEffect(() => {
    if(listCategories?.length > 0){
      console.log(form.getFieldValue("productId"));
      onChangeCascader(form.getFieldValue("productId"));
    }
  }, [listCategories]) */

  const handleDeleteExpositor = ({ getFieldValue, setFieldsValue, index }) => {
    let expositors = getFieldValue("expositors");
    expositors = expositors.flatMap((x, pos) => {
      if (index === pos) {
        return [];
      }
      return [x];
    });
    form.setFieldsValue({
      expositors: [...expositors],
    });
  };
  const handleDeleteEpiosde = ({ getFieldValue, setFieldsValue, index }) => {
    let episodes = getFieldValue("episodes");
    episodes = episodes.flatMap((x, pos) => {
      if (index === pos) {
        return [];
      }
      return [x];
    });
    form.setFieldsValue({
      episodes: [...episodes],
    });
  };
  const handleDeleteChannels = ({ getFieldValue, setFieldsValue, index }) => {
    let tvChannels = getFieldValue("tvChannels");
    tvChannels = tvChannels.flatMap((x, pos) => {
      if (index === pos) {
        return [];
      }
      return [x];
    });
    form.setFieldsValue({
      tvChannels: [...tvChannels],
    });
  };

  const handleDeleteSocialNetwork = ({
    getFieldValue,
    setFieldsValue,
    index,
  }) => {
    let socialNetworks = getFieldValue("socialNetworks");
    socialNetworks = socialNetworks.flatMap((x, pos) => {
      if (index === pos) {
        return [];
      }
      return [x];
    });
    form.setFieldsValue({
      socialNetworks: [...socialNetworks],
    });
  };

  const getDiffusionCategories = useCallback(async () => {
    try {
      let {
        data: { response, success, description },
      } = await DiffusionCategoryService.getDiffusionCategory();
      if (success) {
        let arrFormated = response.map((category) => {
          return {
            value: category.id,
            label: category.name,
            children: category.firstCategory.map((subCategory) => {
              return {
                value: subCategory.id,
                label: subCategory.name,
                children: subCategory.secondCategory.map((subSubCategory) => {
                  return {
                    value: subSubCategory.id,
                    label: subSubCategory.name,
                  };
                }),
              };
            }),
          };
        });
        console.log(arrFormated);
        setListCategories(arrFormated);
      } else {
        message.error("Error. " + description, 5);
      }
    } catch (error) {
      message.error("Error. " + error.message, 5);
    }
  }, []);
  const onChangeCascader = (value) => {
    let track = "";
    let length = value?.length || 0;
    //console.log("list Car", listCategories);
    if (length > 1) {
      let categoryIndex = listCategories.findIndex(
        (category) => category.value === value[0]
      );
      let productSelected = listCategories[categoryIndex];
      track = `${productSelected.label}`;
      let subCategoryIndex = productSelected.children.findIndex(
        (category) => category.value === value[1]
      );

      productSelected =
        listCategories[categoryIndex].children[subCategoryIndex];
      track = `${track}_${productSelected.label}`;

      if (length === 3) {
        let subSubCategoryIndex = productSelected.children.findIndex(
          (category) => category.value === value[2]
        );
        productSelected = productSelected.children[subSubCategoryIndex];
        track = `${track}_${productSelected.label}`;
      }
      if (
        track !== "Charlas_Congreso" &&
        track !== "Charlas_Conferencia" &&
        track !== "Charlas_Taller"
      ) {
        form.setFieldsValue({
          expositors: [],
        });
      }

      if (track !== "Medios de Comunicación_Radio_Radio novela") {
        form.setFieldsValue({
          episodes: [],
        });
      }
      if (track?.indexOf("Redes Sociales") < 0) {
        form.setFieldsValue({
          socialNetworks: [],
        });
      }
      if (track?.indexOf("Medios de Comunicación") < 0) {
        form.setFieldsValue({
          tvChannels: [],
        });
      }
      setTypeProduct(track);
    }
  };

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

  useEffect(() => {
    getDiffusionCategories();
    getStatusPublish();
  }, [getDiffusionCategories]);

  //const editProduct = async (product) => {};

  const onFormFinish = async (name, { values, forms }) => {
    try {
      const { registerProduct } = forms;
      if (name === "expositorForm") {
        const expositors = registerProduct.getFieldValue("expositors") || [];
        registerProduct.setFieldsValue({
          expositors: [...expositors, values],
        });
        setVisibleExpositorModal(false);
      }
      if (name === "episodesForm") {
        const episodes = registerProduct.getFieldValue("episodes") || [];

        let episodeFormated = {
          description: values.description,
          name: values.name,
          hours: values.duration.hours,
          minutes: values.duration.minutes,
        };

        registerProduct.setFieldsValue({
          episodes: [...episodes, episodeFormated],
        });
        setVisibleEpisodesModal(false);
      }
      if (name === "socialNetworksForm") {
        const socialNetworks =
          registerProduct.getFieldValue("socialNetworks") || [];

        registerProduct.setFieldsValue({
          socialNetworks: [...socialNetworks, values],
        });
        setVisibleSocialNetworks(false);
      }
      if (name === "tvChannelForm") {
        const tvChannels = registerProduct.getFieldValue("tvChannels") || [];

        registerProduct.setFieldsValue({
          tvChannels: [...tvChannels, values],
        });
        setVisibleChannelForm(false);
      }
      if (name === "registerProduct") {
        const { registerProduct } = forms;

        let episodes = registerProduct.getFieldValue("episodes");
        if (episodes?.length > 0) {
          values.episodes = JSON.stringify(
            registerProduct.getFieldValue("episodes")
          );
        } else {
          values.episodes = null;
        }

        let expositors = registerProduct.getFieldValue("expositors");
        if (expositors?.length > 0) {
          values.expositors = JSON.stringify(
            registerProduct.getFieldValue("expositors")
          );
        } else {
          values.expositors = null;
        }

        let socialNetworks = registerProduct.getFieldValue("socialNetworks");
        if (socialNetworks?.length > 0) {
          values.socialNetworks = JSON.stringify(
            registerProduct.getFieldValue("socialNetworks")
          );
        } else {
          values.socialNetworks = null;
        }
        let tvChannels = registerProduct.getFieldValue("tvChannels");
        if (tvChannels?.length > 0) {
          values.tvChannels = JSON.stringify(
            registerProduct.getFieldValue("tvChannels")
          );
        } else {
          values.tvChannels = null;
        }
        //console.log("valuesss", values);
        setRequesting(true);
        values.projectId = projectId || 0;
        let productForDB = {
          id: productSelected?.id || null,
          title: values?.title || null,
          target: values?.target || null,
          publicTarget: values?.publicTarget || null,
          description: values?.description || null,
          url: values?.url || null,
          socialNetworks: values?.socialNetworks || null,
          duration: values?.duration ? JSON.stringify(values?.duration) : null,
          resume: values?.resume || null,
          radioTransmiter: values?.radioTransmiter || null,
          episodes: values?.episodes || null,
          tvChannels: values?.tvChannels || null,
          newsPaper: values?.newsPaper || null,
          image: values?.image || null,
          progress: values?.progress || null,
          statePublication: values?.statePublication || null,
          activityId: values?.activityId || null,
          authors: values?.authors || [],
          diffusionCategoryId: values?.productId[values?.productId?.length - 1],
          workshopLeaders: values?.expositors || null,
          projectId: values?.projectId || 0,
          lineId: values?.lineId,
          statusPublishId: values?.statusPublishId?.pop() || 0,
          date: values?.date?._d || new Date(),
          place: values?.place || "",
          event: values?.event,
        };
        //let response = null;
        console.log("productFOrDB", productForDB);
        message.loading({
          content: "Procesando...",
          duration: 4,
          key: "diffusionProduct",
        });
        if (!productSelected) {
          let {
            data: { response = null, success = false, description = "" },
          } = await DiffusionProductService.registerDiffusionProduct(
            productForDB
          );
          if (success) {
            message.success({
              content: "Registrado correctamente",
              duration: 4,
              key: "diffusionProduct",
            });
            onCloseForm({ state: "success" });
          } else {
            console.log("description", description);
            message.warning({
              content: description,
              duration: 4,
              key: "diffusionProduct",
            });
            setRequesting(false);
          }
        } else {
          console.log("diffusionProduct", productForDB);
          let {
            data: { response = null, success = false, description = "" },
          } = await DiffusionProductService.editDiffusionProduct(productForDB);
          if (success) {
            message.success({
              content: "Editado correctamente.",
              duration: 3,
              key: "diffusionProduct",
            });
            onCloseForm({ state: "success" });
          } else {
            message.warn({
              content: description,
              duration: 5,
              key: "diffusionProduct",
            });
            setRequesting(false);
          }
        }
      }
    } catch (error) {
      setRequesting(false);
      message.error("Error. " + error.message, 5);
    }
  };

  useEffect(() => {
    if (productSelected) {
      let fullCategoryNameTrack = [];
      let diffusionCategoryTrack = [productSelected?.DiffusionCategory?.id];
      fullCategoryNameTrack.unshift(productSelected?.DiffusionCategory?.name);

      let category = productSelected?.DiffusionCategory;
      let parentId =
        productSelected?.DiffusionCategory?.firstParentCategory?.id;

      if (parentId) {
        diffusionCategoryTrack.unshift(parentId);
        fullCategoryNameTrack.unshift(category?.firstParentCategory?.name);
      }

      category = category?.firstParentCategory?.secondParentCategory;
      parentId = category?.id;
      if (parentId) {
        diffusionCategoryTrack.unshift(parentId);
        fullCategoryNameTrack.unshift(category?.name);
      }

      /*  console.log("fullName", fullCategoryNameTrack.join("_"));
      console.log("fullTrack", diffusionCategoryTrack); */
      setTypeProduct(fullCategoryNameTrack.join("_"));
      let strToObj = (strObj) => {
        let obj = JSON.parse(strObj);
        if (obj !== null) {
          return obj;
        }
        return null;
      };

      let statusPublishProduct = null;
      statusPublishProduct = productSelected?.StatusPublish?.id && [
        productSelected?.StatusPublish?.id,
      ];
      productSelected?.StatusPublish?.parentId &&
        statusPublishProduct?.unshift(productSelected?.StatusPublish?.parentId);
      setFields([
        {
          name: ["title"],
          value: productSelected.title,
        },
        {
          name: ["productId"],
          value: diffusionCategoryTrack,
        },
        {
          name: ["target"],
          value: productSelected.target,
        },
        {
          name: ["publicTarget"],
          value: productSelected.publicTarget,
        },
        {
          name: ["url"],
          value: productSelected.url,
        },
        {
          name: ["description"],
          value: productSelected.description,
        },
        {
          name: ["radioTransmiter"],
          value: productSelected.radioTransmiter,
        },
        {
          name: ["resume"],
          value: productSelected.resume,
        },
        {
          name: ["newsPaper"],
          value: productSelected.newsPaper,
        },
        {
          name: ["image"],
          value: productSelected.image,
        },
        {
          name: ["progress"],
          value: productSelected.progress,
        },
        {
          name: ["lineId"],
          value: [productSelected.lineId || 0],
        },
        {
          name: ["authors"],
          value: productSelected?.DiffusionAuthors?.map(
            (author) => author.userId
          ),
        },
        {
          name: ["socialNetworks"],
          value: strToObj(productSelected?.socialNetworks),
        },
        {
          name: ["duration"],
          value: (() => {
            let duration = strToObj(productSelected?.duration);
            return {
              hours: duration?.hours || 0,
              minutes: duration?.minutes || 0,
            };
          })(),
        },
        {
          name: ["episodes"],
          value: strToObj(productSelected?.episodes),
        },
        {
          name: ["activityId"],
          value: productSelected?.activityId,
        },
        {
          name: ["statePublication"],
          value: productSelected?.statePublication?.split("_"),
        },
        {
          name: ["tvChannels"],
          value: strToObj(productSelected?.tvChannels),
        },
        {
          name: ["expositors"],
          value: strToObj(productSelected?.workshopLeaders),
        },
        {
          name: ["statusPublishId"],
          value: statusPublishProduct || [1],
        },
        {
          name: ["event"],
          value: productSelected?.event || "",
        },
        {
          name: ["place"],
          value: productSelected?.place || "",
        },
        {
          name: ["date"],
          value: moment(productSelected?.date),
        },
      ]);
      /* let productForDB = {
        title: productSelected?.title || null,
        target: productSelected?.target || null,
        publicTarget: productSelected?.publicTarget || null,
        description: productSelected?.description || null,
        url: productSelected?.url || null,
        socialNetworks: values?.socialNetworks || null,
        duration: values?.duration ? JSON.stringify(values?.duration) : null,
        resume: productSelected?.resume || null,
        radioTransmiter: productSelected?.radioTransmiter || null,
        episodes: values?.episodes || null,
        tvChannels: values?.tvChannels || null,
        newsPaper: productSelected?.newsPaper || null,
        image: productSelected?.image || null,
        progress: productSelected?.progress || null,
        //statePublication: productSelected?.statePublication || null,
        activityId: productSelected?.activityId || null,
        authors: productSelected?.DiffusionAuthors?.map((author) => author.id),
        productId: diffusionCategoryTrack,
        workshopLeaders: values?.expositors || null,
        projectId: projectId || 0,
        lineId: productSelected?.lineId,
      };
      form.setFieldsValue(productForDB); */
    }
  }, [productSelected, form, projectId]);
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
  return (
    <Modal
      title={productSelected ? "Editar Producto" : "Registrar Producto"}
      visible={true}
      //onOk={handleOk}
      onCancel={onCloseForm}
      width={1000}
      footer={null}
    >
      <Form.Provider onFormFinish={onFormFinish}>
        <Form
          {...formItemLayout}
          form={form}
          name="registerProduct"
          //onFinish={onFinish}
          fields={fields}
          scrollToFirstError
        >
          <Form.Item
            label="Tipo de producto"
            name="productId"
            rules={[
              {
                required: true,
                message: "Por favor seleccione tipo de producto",
              },
            ]}
          >
            <Cascader
              onChange={onChangeCascader}
              options={listCategories}
              placeholder="Seleccione tipo de producto"
            />
          </Form.Item>

          {![
            "Redes Sociales_Publicación",
            "Redes Sociales_Video",
            "Redes Sociales_Reels",
            "Redes Sociales_Post",
          ].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Título"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el título!",
                },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
          ) : null}

          {[
            "Redes Sociales_Publicación",
            "Redes Sociales_Video",
            "Redes Sociales_Reels",
            "Redes Sociales_Post",
          ].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Contenido Principal"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el contenido!",
                },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
          ) : null}

          {[
            "Medios de Comunicación_Revista_Artículo",
            "Medios de Comunicación_Prensa_Columna",
            "Medios de Comunicación_Prensa_Publicidad",
            "Medios de Comunicación_Prensa_Noticia",
            "Medios de Comunicación_TV_Publicidad",
            "Medios de Comunicación_TV_Spot",
            "Medios de Comunicación_TV_Noticia",
            "Medios de Comunicación_Radio_Podcast",
            "Medios de Comunicación_Radio_Radio novela",
            "Medios de Comunicación_Radio_Jingle",
            "Medios de Comunicación_Radio_Cuña",
            "Medios de Comunicación_Radio_Socio drama",
            "Charlas_Congreso",
            "Charlas_Conferencia",
            "Charlas_Taller",
            "Charlas_Ponencia",
          ].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Resumen de Contenido"
              name="resume"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el resumen!",
                },
              ]}
            >
              <Input.TextArea placeholder="Resumen de contenido" />
            </Form.Item>
          ) : null}
          {["Charlas_Ponencia"].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Evento"
              name="event"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el evento u ocasion!",
                },
              ]}
            >
              <Input placeholder="Ej: Congreso Litio, Workshop Energias" />
            </Form.Item>
          ) : null}
          {["Charlas_Ponencia"].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Lugar"
              name="place"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el lugar del evento!",
                },
              ]}
            >
              <Input placeholder="Ej: Cochabamba-Bolivia" />
            </Form.Item>
          ) : null}
          {["Charlas_Ponencia"].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Fecha"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el lugar del evento!",
                },
              ]}
            >
              <DatePicker placeholder="Seleccione una fecha" />
            </Form.Item>
          ) : null}
          {!["Charlas_Ponencia"].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Objetivo"
              name="target"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el objetivo!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null}
          {!["Charlas_Ponencia"].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Publico Objetivo "
              name="publicTarget"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el publico objetivo!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null}

          {["Medios de Comunicación_Radio_Radio novela"].some(
            (product) => product === typeProduct
          ) ? (
            <>
              <Form.Item
                label="Episodios"
                //name="workshopLeaders"
                rules={[
                  {
                    required: true,
                    message: "Por favor registre los episodios!",
                  },
                ]}
                shouldUpdate={(prevValues, curValues) => {
                  return prevValues.episodes !== curValues.episodes;
                }}
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const episodes = getFieldValue("episodes") || [];
                  return episodes.length ? (
                    <ul
                      style={{
                        listStyle: "none",
                        maxHeight: "15em",
                        overflowX: "auto",
                      }}
                    >
                      {episodes.map((episodes, index) => (
                        <li key={index} style={{ marginBottom: "0.5em" }}>
                          <Avatar
                            icon={<VideoCameraOutlined />}
                            style={{ marginRight: "0.3em" }}
                          />
                          {episodes.name} - {episodes.hours}h:{episodes.minutes}
                          m
                          <Button
                            onClick={() => {
                              handleDeleteEpiosde({
                                getFieldValue,
                                setFieldsValue,
                                index,
                              });
                            }}
                            type="link"
                            style={{ marginLeft: "0.5em" }}
                          >
                            Eliminar
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography.Text className="ant-form-text" type="secondary">
                      ( <SmileOutlined /> Sin episodios aun. )
                    </Typography.Text>
                  );
                }}
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  htmlType="button"
                  type="dashed"
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => {
                    showEpisodesModal();
                  }}
                >
                  + Agregar Episodios
                </Button>
              </Form.Item>
            </>
          ) : null}

          {[
            "Redes Sociales_Publicación",
            "Redes Sociales_Video",
            "Redes Sociales_Reels",
            "Redes Sociales_Post",
          ].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Url Pagina"
              name="url"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el lnik de la pagina!",
                },
                {
                  type: "url",
                  message: "Por favor ingrese el lnik de la pagina!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null}
          {[
            "Redes Sociales_Publicación",
            "Redes Sociales_Video",
            "Redes Sociales_Reels",
            "Redes Sociales_Post",
          ].some((product) => product === typeProduct) ? (
            <>
              <Form.Item
                label="Redes Sociales"
                required={true}
                rules={[
                  {
                    required: true,
                    message: "Por favor registre la redes sociales!",
                  },
                ]}
                shouldUpdate={(prevValues, curValues) => {
                  return prevValues.socialNetworks !== curValues.socialNetworks;
                }}
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const socialNetworks = getFieldValue("socialNetworks") || [];
                  return socialNetworks.length ? (
                    <ul
                      style={{
                        listStyle: "none",
                        maxHeight: "15em",
                        overflowX: "auto",
                      }}
                    >
                      {socialNetworks.map((socialNetwork, index) => (
                        <li key={index} style={{ marginBottom: "0.5em" }}>
                          <Avatar
                            icon={<VideoCameraOutlined />}
                            style={{ marginRight: "0.3em" }}
                          />
                          {socialNetwork?.name} -{" "}
                          {socialNetwork?.linkSocialNetwork}
                          <Button
                            onClick={() => {
                              handleDeleteSocialNetwork({
                                getFieldValue,
                                setFieldsValue,
                                index,
                              });
                            }}
                            type="link"
                            style={{ marginLeft: "0.5em" }}
                          >
                            Eliminar
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography.Text className="ant-form-text" type="secondary">
                      ( <SmileOutlined /> Sin links a redes sociales aun. )
                    </Typography.Text>
                  );
                }}
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  htmlType="button"
                  type="dashed"
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => {
                    showSocialNetworksModal();
                  }}
                >
                  + Agregar Redes sociales
                </Button>
              </Form.Item>
            </>
          ) : null}
          {[
            "Medios de Comunicación_Radio_Podcast",
            "Medios de Comunicación_Radio_Radio novela",
            "Medios de Comunicación_Radio_Jingle",
            "Medios de Comunicación_Radio_Cuña",
          ].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Estación de transmisión "
              name="radioTransmiter"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese la estación de transmisión!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null}
          {[
            "Medios de Comunicación_TV_Publicidad",
            "Medios de Comunicación_TV_Spot",
            "Medios de Comunicación_TV_Noticia",
          ].some((product) => product === typeProduct) ? (
            <>
              <Form.Item
                label="Canales de TV"
                //name="workshopLeaders"
                rules={[
                  {
                    required: true,
                    message: "Por favor registre los canales de TV!",
                  },
                ]}
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.tvChannels !== curValues.tvChannels
                }
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const tvChannels = getFieldValue("tvChannels") || [];
                  return tvChannels.length ? (
                    <ul
                      style={{
                        listStyle: "none",
                        maxHeight: "15em",
                        overflowX: "auto",
                      }}
                    >
                      {tvChannels.map((tvChannel, index) => (
                        <li key={index} style={{ marginBottom: "0.5em" }}>
                          <Avatar
                            icon={<UserOutlined />}
                            style={{ marginRight: "0.3em" }}
                          />
                          {tvChannel.name} - {tvChannel.country}
                          <Button
                            onClick={() => {
                              handleDeleteChannels({
                                getFieldValue,
                                setFieldsValue,
                                index,
                              });
                            }}
                            type="link"
                            style={{ marginLeft: "0.5em" }}
                          >
                            Eliminar
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography.Text className="ant-form-text" type="secondary">
                      ( <SmileOutlined /> Sin canales aun. )
                    </Typography.Text>
                  );
                }}
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  htmlType="button"
                  type="dashed"
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => {
                    showChannelModal();
                  }}
                >
                  + Agregar Canal de tv
                </Button>
              </Form.Item>
            </>
          ) : null}
          {[
            "Medios de Comunicación_Revista_Artículo",
            "Medios de Comunicación_Prensa_Columna",
            "Medios de Comunicación_Prensa_Publicidad",
            "Medios de Comunicación_Prensa_Noticia",
            "Charlas_Congreso",
            "Charlas_Conferencia",
            "Charlas_Taller",
          ].some((product) => product === typeProduct) ? (
            <Form.Item
              label="Periódico"
              name="newsPaper"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el periódico!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null}

          {[
            "Edu_comunicacional_Videos",
            "Redes Sociales_Video",
            "Redes Sociales_Reels",
            "Medios de Comunicación_Radio_Radio novela",
            "Medios de Comunicación_Radio_Jingle",
            "Medios de Comunicación_Radio_Cuña",
            "Medios de Comunicación_Radio_Socio drama",
            "Medios de Comunicación_TV_Publicidad",
            "Medios de Comunicación_TV_Spot",
            "Medios de Comunicación_TV_Noticia",
          ].some((product) => product === typeProduct) ? (
            <Form.Item
              //name={"duration"}
              label="Duración"
              required={true}
              rules={[
                {
                  required: true,
                  message: "Ingrese la duración del episodio.",
                },
              ]}
            >
              <Form.Item
                label="Horas"
                name={["duration", "hours"]}
                rules={[{ required: true, message: "Duración en horas." }]}
                noStyle
              >
                <InputNumber min={0} value={0} placeholder="Horas" />
              </Form.Item>
              <Form.Item
                /* {...field} */
                label="Minutos"
                name={["duration", "minutes"]}
                rules={[{ required: true, message: "Duración en minutos." }]}
                noStyle
              >
                <InputNumber min={0} value={0} placeholder="Minutos" />
              </Form.Item>
            </Form.Item>
          ) : null}
          {["Charlas_Congreso", "Charlas_Conferencia", "Charlas_Taller"].some(
            (product) => product === typeProduct
          ) ? (
            <>
              <Form.Item
                label="Expositores"
                //name="workshopLeaders"
                rules={[
                  {
                    required: true,
                    message: "Por favor registre a los expositores!",
                  },
                ]}
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.expositors !== curValues.expositors
                }
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const users = getFieldValue("expositors") || [];
                  return users.length ? (
                    <ul
                      style={{
                        listStyle: "none",
                        maxHeight: "15em",
                        overflowX: "auto",
                      }}
                    >
                      {users.map((user, index) => (
                        <li key={index} style={{ marginBottom: "0.5em" }}>
                          <Avatar
                            icon={<UserOutlined />}
                            style={{ marginRight: "0.3em" }}
                          />
                          {user.name} - {user.gradeId} {user.grade} -{" "}
                          {user.country}
                          <Button
                            onClick={() => {
                              handleDeleteExpositor({
                                getFieldValue,
                                setFieldsValue,
                                index,
                              });
                            }}
                            type="link"
                            style={{ marginLeft: "0.5em" }}
                          >
                            Eliminar
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography.Text className="ant-form-text" type="secondary">
                      ( <SmileOutlined /> Sin expositores aun. )
                    </Typography.Text>
                  );
                }}
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  htmlType="button"
                  type="dashed"
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => {
                    showExpositorModal();
                  }}
                >
                  + Agregar Expositor
                </Button>
              </Form.Item>
            </>
          ) : null}

          <Form.Item
            label="Actividad"
            name="activityId"
            rules={[
              {
                required: true,
                message: "Por favor seleccione la actividad!",
              },
            ]}
          >
            <Select placeholder="Seleccione">
              {activities.map((activity) => (
                <Select.Option value={activity.id} key={activity.id}>
                  {activity.name} -{" "}
                  {`${activity.User?.firstName} ${activity?.User?.lastName}`}{" "}
                  <strong>
                    {activity?.User?.sintetic ? "(Usuario Sintético)" : ""}
                  </strong>
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
                message: "Seleccione una línea.",
              },
            ]}
          >
            <Select
              //mode="multiple"
              showArrow
              tagRender={tagRender}
              //defaultValue={["gold", "cyan"]}
              style={{ width: "100%" }}
              //options={getOptions(userList)}
            >
              {linesInstitutional?.map((lineInstitutional) => (
                <Select.Option
                  key={lineInstitutional.id}
                  value={lineInstitutional?.id}
                >
                  {lineInstitutional?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/*  <Form.Item
            name="statePublication"
            label="Estado de Publicación"
            rules={[
              {
                required: true,
                message: "Seleccione el estado de la Publicación",
              },
            ]}
          >
            <Cascader options={statesPublication} placeholder="" />
          </Form.Item> */}

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

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={requesting}>
              Aceptar
            </Button>
            <Button
              type="secondary"
              htmlType="button"
              onClick={() => {
                onCloseForm();
              }}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
        <ModalExpositorForm
          visible={visibleExpositorModal}
          onCancel={hideExpositorModal}
        />
        <ModalEpisodesForm
          visible={visibleEpisodesModal}
          onCancel={hideEpisodesModal}
        />
        <ModalSocialNetworks
          visible={visibleSocialNetworks}
          onCancel={hideSocialNetworksModal}
        />
        <ModalChannels
          visible={visibleChannelForm}
          onCancel={hideChannelModal}
        />
      </Form.Provider>
    </Modal>
  );
}
