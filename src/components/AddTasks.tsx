import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import {
  useCreateSheetsMutation,
  useCreateTasksMutation,
  useGetTasksQuery,
} from '@/api/app_project/app_project';
import React from 'react';
import { useGetAllUsersQuery } from '@/api/app_home/app_home';

interface Sheet {
  id: string;
  name: string;
  data: any[];
}

const AddTasks = ({
  isAddTasksModalOpen,
  setIsAddTasksModalOpen,
  sheetsId,
  projectId,
}: {
  isAddTasksModalOpen: boolean;
  setIsAddTasksModalOpen: (isAddTasksModalOpen: boolean) => void;
  sheetsId: string;
  projectId: string;
}) => {
  const [form] = Form.useForm();
  const [createTasks] = useCreateTasksMutation();
  const { refetch: refetchTasks } = useGetTasksQuery();
  const { data: users } = useGetAllUsersQuery();
  const [assignee, setAssignee] = useState<any[]>([]);

  const handleCancel = () => {
    setIsAddTasksModalOpen(false);
  };

  const handleOk = async (values: any) => {
    setIsAddTasksModalOpen(false);
  };

  const handleFinish = async (values: any) => {
    try {
      await form.validateFields();
      const result = await createTasks({
        title: values.title,
        assignees: assignee,
        project: projectId,
        sheet: sheetsId,
        start_date: values.start_date.format('YYYY-MM-DD'),
        deadline: values.deadline.format('YYYY-MM-DD'),
        status: values.status,
        description: values.description,
      }).unwrap();

      if (result) {
        message.success('Thêm tasks thành công');
      }
    } catch (error) {
      message.error('Thêm tasks thất bại');
    }

    refetchTasks();
    form.resetFields();
    setAssignee([]);
    setIsAddTasksModalOpen(false);
  };

  return (
    <Modal
      title='Thêm tasks'
      open={isAddTasksModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item
          label='Tên tasks'
          name='title'
          rules={[{ required: true, message: 'Vui lòng nhập tên bảng!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label='Người phụ trách' name='assignee'>
          <Select
            placeholder='Chọn người phụ trách'
            mode='multiple'
            onSelect={(value: any) => {
              setAssignee((prev: any[]) => [...prev, value]);
            }}
          >
            {users?.results?.map((user: any) => (
              <Select.Option key={user.id} value={user.id}>
                {user.staff_str.full_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div className='flex items-center gap-4'>
          <Form.Item label='Ngày bắt đầu' name='start_date'>
            <DatePicker />
          </Form.Item>
          <Form.Item label='Ngày kết thúc' name='deadline'>
            <DatePicker />
          </Form.Item>
        </div>
        <Form.Item label='Trạng thái' name='status'>
          <Select>
            <Select.Option value={1}>Đang tiến hành</Select.Option>
            <Select.Option value={2}>Hoàn thành</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='Mô tả' name='description'>
          <Input.TextArea />
        </Form.Item>
        <Button type='primary' htmlType='submit'>
          Thêm tasks
        </Button>
      </Form>
    </Modal>
  );
};

export default AddTasks;
