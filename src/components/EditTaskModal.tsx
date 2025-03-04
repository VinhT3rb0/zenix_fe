import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import {
  useGetStatusesQuery,
  useUpdateTaskMutation,
} from '@/api/app_project/app_project';
import { useGetAllUsersQuery } from '@/api/app_home/app_home';

const { Option } = Select;

interface EditTaskModalProps {
  visible: boolean;
  onClose: () => void;
  task: any;
  projectId: string;
  sheetId: string;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  visible,
  onClose,
  task,
  projectId,
  sheetId,
}) => {
  const [form] = Form.useForm();
  const { data: statusesData } = useGetStatusesQuery();
  const { data: usersData } = useGetAllUsersQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [assignees, setAssignees] = useState<any[]>([]);

  console.log(task);

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        assignees: task.assignees,
        description: task.description,
        status: task.status,
      });
    }
  }, [task, form]);

  const handleUpdate = async (values: any) => {
    try {
      await updateTask({
        id: task.id,
        project: projectId,
        sheet: sheetId,
        ...values,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      title='Chỉnh sửa Task'
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={() => form.submit()}>
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleUpdate} layout='vertical'>
        <Form.Item
          name='title'
          label='Công việc'
          rules={[{ required: true, message: 'Vui lòng nhập công việc' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='assignees'
          label='Người phụ trách'
          rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
        >
          <Select
            mode='multiple'
            onSelect={(value: any) => {
              setAssignees((prev: any[]) => [...prev, value]);
            }}
          >
            {usersData?.results.map((user: any) => (
              <Option key={user.id} value={user.id}>
                {user.staff_str.full_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='description'
          label='Mô tả'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='status'
          label='Trạng thái'
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            {statusesData?.results.map((status: any) => (
              <Option key={status.id} value={status.id}>
                {status.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTaskModal;
