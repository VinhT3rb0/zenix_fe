import { Modal, Form, Input, DatePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
interface Project {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
}
interface ProjectModalProps {
  visible: boolean;
  isEditMode: boolean;
  project?: Project | null;
  onOk: (values: any) => void;
  onCancel: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ visible, isEditMode, project, onOk, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        ...project,
        start_date: project.start_date ? dayjs(project.start_date) : null,
        end_date: project.end_date ? dayjs(project.end_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [project, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk({
        ...values,
        start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      });
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  return (
    <Modal
      title={isEditMode ? "Chỉnh sửa dự án" : "Thêm dự án"}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên dự án"
          rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="start_date"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          name="end_date"
          label="Ngày kết thúc"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectModal;